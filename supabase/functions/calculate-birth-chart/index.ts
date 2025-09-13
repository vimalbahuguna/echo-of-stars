import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BirthData {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  astrologicalSystem: 'western' | 'vedic';
}

interface Planet {
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  sign: string;
  degrees: number;
  house: number;
  isRetrograde: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const birthData: BirthData = await req.json();
    console.log('Calculating birth chart for:', birthData);

    // Basic astronomical calculations (simplified for demonstration)
    const planets = calculatePlanetPositions(birthData);
    const houses = calculateHouses(birthData);
    const aspects = calculateAspects(planets);

    const chartData = {
      planets,
      houses,
      aspects,
      ascendant: houses[0],
      midheaven: houses[9],
      system: birthData.astrologicalSystem
    };

    // Store the chart in database
    const { data: chart, error } = await supabaseClient
      .from('birth_charts')
      .insert({
        user_id: user.id,
        tenant_id: profile.tenant_id,
        chart_name: `${birthData.name}'s Birth Chart`,
        birth_date: birthData.date,
        birth_time: birthData.time,
        birth_latitude: birthData.latitude,
        birth_longitude: birthData.longitude,
        timezone: birthData.timezone,
        astrological_system: birthData.astrologicalSystem,
        chart_data: chartData,
        metadata: {
          location: birthData.location,
          calculated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save chart');
    }

    // Store planetary positions
    for (const planet of planets) {
      await supabaseClient
        .from('planetary_positions')
        .insert({
          chart_id: chart.id,
          planet_name: planet.name,
          longitude: planet.longitude,
          latitude: planet.latitude,
          speed: planet.speed,
          house_number: planet.house,
          sign_name: planet.sign,
          sign_degrees: planet.degrees,
          is_retrograde: planet.isRetrograde
        });
    }

    console.log('Chart calculated and stored successfully');

    return new Response(JSON.stringify({
      success: true,
      chart: {
        id: chart.id,
        chartData,
        metadata: chart.metadata
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simplified astronomical calculations
function calculatePlanetPositions(birthData: BirthData): Planet[] {
  const date = new Date(birthData.date + 'T' + birthData.time);
  const daysSinceEpoch = (date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
  
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  // Simplified planetary positions (in real implementation, use Swiss Ephemeris or similar)
  const planets: Planet[] = [
    {
      name: 'Sun',
      longitude: (daysSinceEpoch * 0.9856 + 280) % 360,
      latitude: 0,
      speed: 0.9856,
      sign: '',
      degrees: 0,
      house: 0,
      isRetrograde: false
    },
    {
      name: 'Moon',
      longitude: (daysSinceEpoch * 13.176 + 30) % 360,
      latitude: 5.145 * Math.sin(daysSinceEpoch * 0.0549),
      speed: 13.176,
      sign: '',
      degrees: 0,
      house: 0,
      isRetrograde: false
    },
    {
      name: 'Mercury',
      longitude: (daysSinceEpoch * 4.092 + 100) % 360,
      latitude: 7 * Math.sin(daysSinceEpoch * 0.01),
      speed: 4.092,
      sign: '',
      degrees: 0,
      house: 0,
      isRetrograde: Math.sin(daysSinceEpoch * 0.01) < -0.5
    },
    // Add more planets...
  ];

  // Calculate sign and house positions
  planets.forEach(planet => {
    const signIndex = Math.floor(planet.longitude / 30);
    planet.sign = signs[signIndex];
    planet.degrees = planet.longitude % 30;
    planet.house = Math.floor(planet.longitude / 30) + 1; // Simplified house calculation
  });

  return planets;
}

function calculateHouses(birthData: BirthData): number[] {
  // Simplified house calculation (in real implementation, use proper house systems)
  const houses = [];
  const ascendant = (new Date(birthData.date + 'T' + birthData.time).getHours() * 15) % 360;
  
  for (let i = 0; i < 12; i++) {
    houses.push((ascendant + i * 30) % 360);
  }
  
  return houses;
}

function calculateAspects(planets: Planet[]): Array<{from: string, to: string, aspect: string, orb: number}> {
  const aspects = [];
  const aspectOrbs = {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 8,
    sextile: 6
  };

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;

      // Check for major aspects
      const aspectAngles = [0, 60, 90, 120, 180];
      const aspectNames = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

      for (let k = 0; k < aspectAngles.length; k++) {
        const orb = Math.abs(angle - aspectAngles[k]);
        if (orb <= aspectOrbs[aspectNames[k] as keyof typeof aspectOrbs]) {
          aspects.push({
            from: planet1.name,
            to: planet2.name,
            aspect: aspectNames[k],
            orb
          });
        }
      }
    }
  }

  return aspects;
}