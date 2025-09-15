import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { CircularNatalHoroscope } from 'https://esm.sh/circular-natal-horoscope-js@latest';

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

    // Get user's tenant
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get user's birth chart
    const { data: birthChart, error: birthChartError } = await supabaseClient
      .from('birth_charts')
      .select(`
        *,
        planetary_positions(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (birthChartError || !birthChart) {
      throw new Error('User birth chart not found. Please calculate your birth chart first.');
    }

    // Calculate today's transit chart
    const now = new Date();
    // For transit, we can use a default location or try to get user's current location if available
    // For simplicity, let's use a default central location or the birth location if no current location is provided.
    const transitLatitude = birthChart.birth_latitude || 34.0522; // Default to Los Angeles
    const transitLongitude = birthChart.birth_longitude || -118.2437; // Default to Los Angeles
    const transitTimezone = birthChart.timezone || 'America/Los_Angeles'; // Default to Los Angeles timezone

    const transitHoroscope = new CircularNatalHoroscope({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      latitude: transitLatitude,
      longitude: transitLongitude,
      timezone: transitTimezone,
      houseSystem: birthChart.chart_data?.houseSystem || 'Placidus', // Use user's preferred house system or default
    });

    const transitPlanetsData = transitHoroscope.getPlanets();
    const transitHousesData = transitHoroscope.getHouses();
    const transitAspectsData = transitHoroscope.getAspects();

    // Build comprehensive daily horoscope prompt
    const systemPrompt = `You are an expert astrologer with deep knowledge of both Western and Vedic astrology. You are generating a personalized daily horoscope based on a user's natal chart and today's planetary transits.

User's Natal Chart Information:
- System: ${birthChart.astrological_system}
- Birth Date: ${birthChart.birth_date}
- Birth Time: ${birthChart.birth_time}
- Birth Location: ${birthChart.metadata?.location || 'Unknown'}
- House System: ${birthChart.chart_data?.houseSystem || 'Placidus'}

Natal Planetary Positions (Tropical Zodiac):
${birthChart.planetary_positions?.map((p: any) => 
  `${p.planet_name}: ${p.sign_name} ${p.sign_degrees.toFixed(2)}° in House ${p.house_number}${p.is_retrograde ? ' Retrograde' : ''} (Longitude: ${p.longitude.toFixed(2)}°)`
).join('\n')}

Natal House Cusps:
Ascendant (1st House Cusp): ${birthChart.chart_data?.ascendant?.toFixed(2)}°
Midheaven (10th House Cusp): ${birthChart.chart_data?.midheaven?.toFixed(2)}°
${birthChart.chart_data?.houses?.map((cusp: number, index: number) => 
  `House ${index + 1} Cusp: ${cusp.toFixed(2)}°`
).join('\n')}

Natal Major Aspects:
${birthChart.chart_data?.aspects?.map((a: any) => 
  `${a.from} ${a.aspect} ${a.to} (Orb: ${a.orb.toFixed(2)}°)`
).join('\n')}

---

Today's Transit Chart Information (as of ${now.toISOString()}):
- Location for Transits: Latitude ${transitLatitude}, Longitude ${transitLongitude}, Timezone ${transitTimezone}
- House System: ${birthChart.chart_data?.houseSystem || 'Placidus'}

Transit Planetary Positions (Tropical Zodiac):
${transitPlanetsData.map((p: any) => 
  `${p.label}: ${p.Sign.label} ${p.Sign.degree.toFixed(2)}° in House ${p.House.houseNumber}${p.isRetrograde ? ' Retrograde' : ''} (Longitude: ${p.longitude.toFixed(2)}°)`
).join('\n')}

Transit House Cusps:
Ascendant (1st House Cusp): ${transitHoroscope.getAscendant().longitude.toFixed(2)}°
Midheaven (10th House Cusp): ${transitHoroscope.getMidheaven().longitude.toFixed(2)}°
${transitHousesData.map((h: any, index: number) => 
  `House ${index + 1} Cusp: ${h.cusp.toFixed(2)}°`
).join('\n')}

Transit Major Aspects:
${transitAspectsData.map((a: any) => 
  `${a.planet1.label} ${a.aspect.label} ${a.planet2.label} (Orb: ${a.aspect.orb.toFixed(2)}°)`
).join('\n')}

---

Based on the comparison of the user's natal chart and today's transit chart, provide a comprehensive and personalized daily horoscope. Focus on key transits and their potential influence on the user's day. Include:
1. General theme for the day
2. Key areas of life affected (e.g., career, relationships, finances)
3. Opportunities and challenges
4. Practical advice and guidance
5. A concluding positive affirmation or thought for the day

Write in an encouraging, insightful, and accessible tone. Keep it concise enough for a daily reading, but rich in astrological wisdom.`;

    console.log('Generating daily horoscope with OpenAI...');

    // Call OpenAI API for horoscope
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
          { role: 'user', content: `Generate a personalized daily horoscope for today, ${now.toDateString()}.` }
        ],
        max_tokens: 1000,
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
    const horoscopeText = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log('Daily horoscope generated, tokens used:', tokensUsed);

    // Optionally store the daily horoscope in a new table if needed
    // For now, just return it.

    return new Response(JSON.stringify({
      success: true,
      horoscope: {
        text: horoscopeText,
        generatedAt: now.toISOString(),
        tokensUsed
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating daily horoscope:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
