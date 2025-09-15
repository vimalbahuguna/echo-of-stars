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

    const { chartId1, chartId2 } = await req.json();
    if (!chartId1 || !chartId2) {
      throw new Error('Two chart IDs are required for compatibility analysis.');
    }

    // Fetch both charts
    const { data: chart1, error: error1 } = await supabaseClient
      .from('birth_charts')
      .select(`
        *,
        planetary_positions(*)
      `)
      .eq('id', chartId1)
      .single();

    const { data: chart2, error: error2 } = await supabaseClient
      .from('birth_charts')
      .select(
        `
        *,
        planetary_positions(*)
      `
      )
      .eq('id', chartId2)
      .single();

    if (error1 || !chart1) {
      throw new Error(`Chart 1 (ID: ${chartId1}) not found.`);
    }
    if (error2 || !chart2) {
      throw new Error(`Chart 2 (ID: ${chartId2}) not found.`);
    }

    // --- Synastry Calculation ---
    // This part needs to be implemented to compare chart1 and chart2
    // For now, we'll just pass the raw data to the LLM, but ideally, 
    // we'd calculate inter-chart aspects and house overlays here.

    const synastryAspects = calculateSynastryAspects(chart1.planetary_positions, chart2.planetary_positions);
    const houseOverlays = calculateHouseOverlays(chart1.planetary_positions, chart2.chart_data.houses);

    // Build comprehensive compatibility prompt
    const systemPrompt = `You are an expert astrologer specializing in relationship compatibility (synastry and composite charts). You are generating a comprehensive compatibility report for two individuals based on their natal charts and the synastry between them.

--- Individual 1 (Chart ID: ${chart1.id}) ---
Chart Information:
- Name: ${chart1.chart_name}
- System: ${chart1.astrological_system}
- Birth Date: ${chart1.birth_date}
- Birth Time: ${chart1.birth_time}
- Location: ${chart1.metadata?.location || 'Unknown'}
- House System: ${chart1.chart_data?.houseSystem || 'Placidus'}

Planetary Positions (Tropical Zodiac):
${chart1.planetary_positions?.map((p: any) => 
  `${p.planet_name}: ${p.sign_name} ${p.sign_degrees.toFixed(2)}° in House ${p.house_number}${p.is_retrograde ? ' Retrograde' : ''} (Longitude: ${p.longitude.toFixed(2)}°)`
).join('\n')}

House Cusps:
Ascendant (1st House Cusp): ${chart1.chart_data?.ascendant?.toFixed(2)}°
Midheaven (10th House Cusp): ${chart1.chart_data?.midheaven?.toFixed(2)}°
${chart1.chart_data?.houses?.map((cusp: number, index: number) => 
  `House ${index + 1} Cusp: ${cusp.toFixed(2)}°`
).join('\n')}

---

--- Individual 2 (Chart ID: ${chart2.id}) ---
Chart Information:
- Name: ${chart2.chart_name}
- System: ${chart2.astrological_system}
- Birth Date: ${chart2.birth_date}
- Birth Time: ${chart2.birth_time}
- Location: ${chart2.metadata?.location || 'Unknown'}
- House System: ${chart2.chart_data?.houseSystem || 'Placidus'}

Planetary Positions (Tropical Zodiac):
${chart2.planetary_positions?.map((p: any) => 
  `${p.planet_name}: ${p.sign_name} ${p.sign_degrees.toFixed(2)}° in House ${p.house_number}${p.is_retrograde ? ' Retrograde' : ''} (Longitude: ${p.longitude.toFixed(2)}°)`
).join('\n')}

House Cusps:
Ascendant (1st House Cusp): ${chart2.chart_data?.ascendant?.toFixed(2)}°
Midheaven (10th House Cusp): ${chart2.chart_data?.midheaven?.toFixed(2)}°
${chart2.chart_data?.houses?.map((cusp: number, index: number) => 
  `House ${index + 1} Cusp: ${cusp.toFixed(2)}°`
).join('\n')}

---

--- Synastry Analysis ---
Inter-chart Aspects:
${synastryAspects.map((a: any) => 
  `${a.fromPlanet.name} (Chart 1) ${a.aspect} ${a.toPlanet.name} (Chart 2) (Orb: ${a.orb.toFixed(2)}°)`
).join('\n')}

House Overlays (Chart 1 Planets in Chart 2 Houses):
${houseOverlays.map((o: any) => 
  `${o.planet.name} (Chart 1) in House ${o.houseNumber} (Chart 2)`
).join('\n')}

---

Please provide a comprehensive, insightful, and personalized astrological compatibility report. Include:
1. Overall relationship dynamics and themes
2. Strengths and areas of harmony
3. Challenges and potential friction points
4. Communication styles and emotional connections
5. Shared life purpose or lessons
6. Practical advice for navigating the relationship

Write in an engaging, accessible style that balances traditional astrological wisdom with modern psychological insights. Make it personal and meaningful.`;

    console.log('Generating compatibility report with OpenAI...');

    // Call OpenAI API for compatibility report
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
          { role: 'user', content: `Generate a detailed astrological compatibility report for these two individuals.` }
        ],
        max_tokens: 2500, // Increased max tokens for a comprehensive report
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
    const compatibilityReportText = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log('Compatibility report generated, tokens used:', tokensUsed);

    // Optionally store the compatibility report in a new table if needed
    // For now, just return it.

    return new Response(JSON.stringify({
      success: true,
      compatibilityReport: {
        text: compatibilityReportText,
        generatedAt: new Date().toISOString(),
        tokensUsed
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating compatibility report:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to calculate synastry aspects between two sets of planets
function calculateSynastryAspects(planets1: any[], planets2: any[]): any[] {
  const aspects = [];
  const aspectOrbs = {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 8,
    sextile: 6
  };

  const aspectAngles = [
    { angle: 0, name: 'conjunction' },
    { angle: 60, name: 'sextile' },
    { angle: 90, name: 'square' },
    { angle: 120, name: 'trine' },
    { angle: 180, name: 'opposition' }
  ];

  for (const p1 of planets1) {
    for (const p2 of planets2) {
      let angleDiff = Math.abs(p1.longitude - p2.longitude);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;

      for (const aspectDef of aspectAngles) {
        const orb = Math.abs(angleDiff - aspectDef.angle);
        if (orb <= aspectOrbs[aspectDef.name as keyof typeof aspectOrbs]) {
          aspects.push({
            fromPlanet: p1,
            toPlanet: p2,
            aspect: aspectDef.name,
            orb: orb
          });
        }
      }
    }
  }
  return aspects;
}

// Helper function to calculate house overlays (planets of chart1 in houses of chart2)
function calculateHouseOverlays(planets1: any[], houses2: number[]): any[] {
  const overlays = [];
  // Assuming houses2 are sorted by cusp degree and represent 12 house cusps
  // This is a simplified approach and might need refinement based on exact house system logic
  for (const p1 of planets1) {
    let houseNumber = 0;
    for (let i = 0; i < houses2.length; i++) {
      const cuspStart = houses2[i];
      const cuspEnd = houses2[(i + 1) % 12];

      // Handle wrap-around for 12th house to 1st house
      if (cuspStart < cuspEnd) {
        if (p1.longitude >= cuspStart && p1.longitude < cuspEnd) {
          houseNumber = i + 1;
          break;
        }
      } else { // Cusp wraps around 0/360 (e.g., 12th house starts at 330, 1st at 30)
        if (p1.longitude >= cuspStart || p1.longitude < cuspEnd) {
          houseNumber = i + 1;
          break;
        }
      }
    }
    if (houseNumber > 0) {
      overlays.push({
        planet: p1,
        houseNumber: houseNumber
      });
    }
  }
  return overlays;
}
