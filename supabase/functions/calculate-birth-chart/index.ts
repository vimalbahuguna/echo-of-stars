import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import HoroscopeModule from 'https://esm.sh/circular-natal-horoscope-js@latest';

const Origin = HoroscopeModule.Origin;
const Horoscope = HoroscopeModule.Horoscope;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface BirthData {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude?: number;
  longitude?: number;
  astrologicalSystem: 'western' | 'vedic';
  houseSystem?: string;
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
    console.log('calculate-birth-chart function invoked');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

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

    if (!birthData.latitude || !birthData.longitude) {
      throw new Error('Latitude and longitude are required for accurate birth chart calculation.');
    }

    const geoapifyApiKey = Deno.env.get('GEOAPIFY_API_KEY');
    if (!geoapifyApiKey) {
      throw new Error('Geoapify API key not configured. Please set the GEOAPIFY_API_KEY environment variable.');
    }

    // Fetch timezone from Geoapify
    const timezoneApiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${birthData.latitude}&lon=${birthData.longitude}&apiKey=${geoapifyApiKey}`;
    const timezoneResponse = await fetch(timezoneApiUrl);
    const timezoneData = await timezoneResponse.json();

    let timezone = 'UTC'; // Default to UTC
    if (timezoneData.features && timezoneData.features.length > 0) {
      timezone = timezoneData.features[0].properties.timezone.name;
    } else {
      console.warn(`Could not determine timezone for ${birthData.latitude}, ${birthData.longitude}. Using UTC.`);
    }
    console.log(`Found timezone: ${timezone}`);

    const birthDate = new Date(`${birthData.date}T${birthData.time}`);

    const origin = new Origin({
      year: birthDate.getFullYear(),
      month: birthDate.getMonth(), // Month is 0-indexed in Origin
      date: birthDate.getDate(),
      hour: birthDate.getHours(),
      minute: birthDate.getMinutes(),
      latitude: birthData.latitude,
      longitude: birthData.longitude,
    });

    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: birthData.houseSystem || 'Placidus',
      zodiac: birthData.astrologicalSystem === 'western' ? 'tropical' : 'sidereal',
      aspectPoints: ['bodies', 'points', 'angles'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      aspectTypes: ["major", "minor"],
      language: 'en'
    });

    const planetsData = horoscope.CelestialBodies.all;
    console.log('Planets Data:', JSON.stringify(planetsData, null, 2));

    const housesData = horoscope.Houses;
    const aspectsData = horoscope.Aspects.all;
    const ascendantData = horoscope.Ascendant;
    const midheavenData = horoscope.Midheaven;

    const planets: Planet[] = planetsData.map((p: any) => ({
      name: p.key || p.label,
      longitude: p.ChartPosition?.Ecliptic?.DecimalDegrees || 0,
      latitude: p.latitude || 0,
      speed: p.speed || 0,
      sign: p.Sign?.label || 'Unknown',
      degrees: p.ChartPosition?.Ecliptic?.ArcDegrees?.degrees || 0,
      house: p.House?.id || 0,
      isRetrograde: p.isRetrograde || false,
    }));

    const houses: number[] = housesData.map((h: any) => h.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees || 0);
    
    const aspects: Array<{from: string, to: string, aspect: string, orb: number}> = aspectsData.map((a: any) => ({
      from: a.point1Label || 'Unknown',
      to: a.point2Label || 'Unknown', 
      aspect: a.label || 'Unknown',
      orb: a.orb || 0,
    }));
    const ascendant = ascendantData.longitude;
    const midheaven = midheavenData.longitude;

    const chartData = {
      planets,
      houses,
      aspects,
      ascendant: ascendant,
      midheaven: midheaven,
      system: birthData.astrologicalSystem
    };

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
        timezone: timezone,
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
      throw new Error(`Failed to save chart: ${error.message}`);
    }

    const planetRows = planets.map(planet => ({
      chart_id: chart.id,
      planet_name: planet.name,
      longitude: planet.longitude,
      latitude: planet.latitude,
      speed: planet.speed,
      house_number: planet.house,
      sign_name: planet.sign,
      sign_degrees: planet.degrees,
      is_retrograde: planet.isRetrograde
    }));

    const { error: planetsError } = await supabaseClient
      .from('planetary_positions')
      .insert(planetRows);

    if (planetsError) {
      console.error('Database error (planets):', planetsError);
      throw new Error(`Failed to save planetary positions: ${planetsError.message}`);
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
