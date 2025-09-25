import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for existing sample data...');

    // Check if sample chart already exists
    const { data: existingChart } = await supabase
      .from('birth_charts')
      .select('id')
      .eq('is_public', true)
      .eq('metadata->>sample', 'true')
      .limit(1);

    if (existingChart && existingChart.length > 0) {
      console.log('Sample chart already exists:', existingChart[0].id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          chartId: existingChart[0].id,
          message: 'Sample chart already exists'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating new sample birth chart...');

    // Sample birth chart data
    const sampleChartData = {
      birth_date: '1990-05-15',
      birth_time: '14:30:00',
      birth_location: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      astrological_system: 'western',
      is_public: true,
      metadata: {
        sample: true,
        name: 'Jane Doe',
        description: 'Sample birth chart for demonstration'
      },
      chart_data: {
        planets: [
          { name: "Sun", sign: "Taurus", degree: 25.3, house: 10, retrograde: false },
          { name: "Moon", sign: "Cancer", degree: 12.7, house: 12, retrograde: false },
          { name: "Mercury", sign: "Gemini", degree: 8.1, house: 11, retrograde: false },
          { name: "Venus", sign: "Aries", degree: 19.5, house: 9, retrograde: false },
          { name: "Mars", sign: "Leo", degree: 2.9, house: 1, retrograde: false },
          { name: "Jupiter", sign: "Sagittarius", degree: 14.2, house: 5, retrograde: true },
          { name: "Saturn", sign: "Capricorn", degree: 28.6, house: 6, retrograde: false },
          { name: "Uranus", sign: "Aquarius", degree: 6.4, house: 7, retrograde: false },
          { name: "Neptune", sign: "Pisces", degree: 11.8, house: 8, retrograde: true },
          { name: "Pluto", sign: "Scorpio", degree: 22.1, house: 4, retrograde: false }
        ],
        houses: [
          { number: 1, cusp: 2.9, sign: "Leo" },
          { number: 2, cusp: 28.1, sign: "Leo" },
          { number: 3, cusp: 25.4, sign: "Virgo" },
          { number: 4, cusp: 22.1, sign: "Scorpio" },
          { number: 5, cusp: 14.2, sign: "Sagittarius" },
          { number: 6, cusp: 28.6, sign: "Capricorn" },
          { number: 7, cusp: 6.4, sign: "Aquarius" },
          { number: 8, cusp: 11.8, sign: "Pisces" },
          { number: 9, cusp: 19.5, sign: "Aries" },
          { number: 10, cusp: 25.3, sign: "Taurus" },
          { number: 11, cusp: 8.1, sign: "Gemini" },
          { number: 12, cusp: 12.7, sign: "Cancer" }
        ]
      }
    };

    // Insert sample birth chart
    const { data: chartResult, error: chartError } = await supabase
      .from('birth_charts')
      .insert(sampleChartData)
      .select('id')
      .single();

    if (chartError) {
      console.error('Error creating sample chart:', chartError);
      throw chartError;
    }

    console.log('Sample chart created:', chartResult.id);

    // Insert sample planetary positions
    const planetaryPositions = sampleChartData.chart_data.planets.map(planet => ({
      chart_id: chartResult.id,
      planet_name: planet.name,
      sign: planet.sign,
      degree: planet.degree,
      house: planet.house,
      is_retrograde: planet.retrograde
    }));

    const { error: planetsError } = await supabase
      .from('planetary_positions')
      .insert(planetaryPositions);

    if (planetsError) {
      console.error('Error inserting planetary positions:', planetsError);
      throw planetsError;
    }

    // Insert sample interpretation
    const sampleInterpretation = {
      chart_id: chartResult.id,
      content: "This sample birth chart shows a Taurus Sun in the 10th house, indicating a strong focus on career and public image with practical, determined energy. The Cancer Moon in the 12th house suggests deep emotional sensitivity and intuitive abilities that may be hidden from others. With Jupiter in Sagittarius in the 5th house (retrograde), there's a natural inclination toward philosophical thinking and creative expression, though the retrograde motion indicates this energy may be more internalized. The Leo rising (Mars in 1st house) gives a confident, dynamic personality that others find magnetic and inspiring.",
      ai_model: 'sample-demo',
      metadata: {
        sample: true,
        generated_at: new Date().toISOString()
      }
    };

    const { error: interpretationError } = await supabase
      .from('chart_interpretations')
      .insert(sampleInterpretation);

    if (interpretationError) {
      console.error('Error inserting sample interpretation:', interpretationError);
      throw interpretationError;
    }

    console.log('Sample data seeded successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        chartId: chartResult.id,
        message: 'Sample birth chart created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-sample-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});