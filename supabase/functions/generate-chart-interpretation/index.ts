import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { chartId, interpretationType = 'full' } = await req.json();
    console.log('Generating interpretation for chart:', chartId, 'type:', interpretationType);

    // Get chart data
    const { data: chart, error: chartError } = await supabaseClient
      .from('birth_charts')
      .select(`
        *,
        planetary_positions(*)
      `)
      .eq('id', chartId)
      .eq('user_id', user.id)
      .single();

    if (chartError || !chart) {
      throw new Error('Chart not found');
    }

    // Get user profile for personalization
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Build comprehensive astrological interpretation prompt
    const systemPrompt = `You are an expert astrologer with deep knowledge of both Western and Vedic astrology. You are generating a ${interpretationType} interpretation for a birth chart.

Chart Information:
- System: ${chart.astrological_system}
- Birth Date: ${chart.birth_date}
- Birth Time: ${chart.birth_time}
- Location: ${chart.metadata?.location || 'Unknown'}

Planetary Positions:
${chart.planetary_positions?.map((p: any) => 
  `${p.planet_name}: ${p.sign_name} ${p.sign_degrees.toFixed(2)}° (House ${p.house_number})${p.is_retrograde ? ' Retrograde' : ''}`
).join('\n')}

Chart Data: ${JSON.stringify(chart.chart_data, null, 2)}

Please provide a comprehensive, insightful, and personalized astrological interpretation. Include:
1. Overall personality insights
2. Key planetary influences and their meanings
3. Significant aspects and their interpretations
4. Life themes and potential challenges
5. Strengths and talents highlighted by the chart
6. Spiritual and evolutionary insights
7. Practical guidance for personal growth

Write in an engaging, accessible style that balances traditional astrological wisdom with modern psychological insights. Make it personal and meaningful.`;

    console.log('Generating interpretation with OpenAI...');

    // Call OpenAI API for interpretation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please generate a ${interpretationType} astrological interpretation for this birth chart.` }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log('Interpretation generated, tokens used:', tokensUsed);

    // Store interpretation in database
    const { data: savedInterpretation, error: saveError } = await supabaseClient
      .from('chart_interpretations')
      .insert({
        chart_id: chartId,
        user_id: user.id,
        tenant_id: profile?.tenant_id,
        interpretation_type: interpretationType,
        ai_model: 'gpt-4o',
        interpretation_text: interpretation,
        confidence_score: 0.88,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving interpretation:', saveError);
      throw new Error('Failed to save interpretation');
    }

    return new Response(JSON.stringify({
      success: true,
      interpretation: {
        id: savedInterpretation.id,
        text: interpretation,
        type: interpretationType,
        generatedAt: savedInterpretation.generated_at,
        tokensUsed
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating chart interpretation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});