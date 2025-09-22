import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import HoroscopeModule from 'https://esm.sh/circular-natal-horoscope-js@latest';

const Origin = HoroscopeModule.Origin;
const Horoscope = HoroscopeModule.Horoscope;

// Enhanced astronomical constants for higher precision
const ASTRONOMICAL_CONSTANTS = {
  LAHIRI_AYANAMSA: 24.14, // Current approximate value for 2024
  RAMAN_AYANAMSA: 21.45,
  KRISHNAMURTI_AYANAMSA: 23.85,
  
  // Nakshatra span in degrees
  NAKSHATRA_SPAN: 13.333333, // 13°20' in decimal degrees
  NAKSHATRA_COUNT: 27,
};

// Enhanced Nakshatra data
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', nature: 'Light', guna: 'Rajas' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', nature: 'Fierce', guna: 'Rajas' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', nature: 'Mixed', guna: 'Rajas' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', nature: 'Fixed', guna: 'Rajas' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', nature: 'Soft', guna: 'Tamas' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', nature: 'Sharp', guna: 'Tamas' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', nature: 'Movable', guna: 'Sattva' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', nature: 'Light', guna: 'Sattva' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', nature: 'Sharp', guna: 'Sattva' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitrs', nature: 'Fierce', guna: 'Tamas' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', nature: 'Fierce', guna: 'Rajas' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', nature: 'Fixed', guna: 'Rajas' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar', nature: 'Light', guna: 'Rajas' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', nature: 'Soft', guna: 'Tamas' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', nature: 'Movable', guna: 'Tamas' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', nature: 'Mixed', guna: 'Sattva' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', nature: 'Soft', guna: 'Sattva' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', nature: 'Sharp', guna: 'Sattva' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', nature: 'Sharp', guna: 'Tamas' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', nature: 'Fierce', guna: 'Rajas' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas', nature: 'Fixed', guna: 'Rajas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', nature: 'Movable', guna: 'Rajas' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', nature: 'Movable', guna: 'Tamas' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', nature: 'Movable', guna: 'Tamas' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', nature: 'Fierce', guna: 'Sattva' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', nature: 'Fixed', guna: 'Sattva' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', nature: 'Soft', guna: 'Sattva' },
];

// Helper functions for enhanced calculations
function tropicalToSidereal(longitude: number, ayanamsa: number = ASTRONOMICAL_CONSTANTS.LAHIRI_AYANAMSA): number {
  let sidereal = longitude - ayanamsa;
  return sidereal < 0 ? sidereal + 360 : sidereal;
}

function getNakshatra(siderealLongitude: number) {
  const normalizedLongitude = siderealLongitude < 0 ? siderealLongitude + 360 : siderealLongitude % 360;
  const nakshatraIndex = Math.floor(normalizedLongitude / ASTRONOMICAL_CONSTANTS.NAKSHATRA_SPAN);
  const degreesInNakshatra = normalizedLongitude % ASTRONOMICAL_CONSTANTS.NAKSHATRA_SPAN;
  const pada = Math.floor(degreesInNakshatra / (ASTRONOMICAL_CONSTANTS.NAKSHATRA_SPAN / 4)) + 1;
  
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  
  return {
    nakshatra: nakshatra.name,
    lord: nakshatra.lord,
    pada,
    degrees: degreesInNakshatra,
    deity: nakshatra.deity,
    nature: nakshatra.nature,
    guna: nakshatra.guna
  };
}

function calculatePlanetaryDignity(planetName: string, longitude: number): string {
  const signIndex = Math.floor(longitude / 30);
  const planetLower = planetName.toLowerCase();
  
  // Simplified dignity calculation
  const ownSigns: { [key: string]: number[] } = {
    'sun': [4], // Leo
    'moon': [3], // Cancer
    'mars': [0, 7], // Aries, Scorpio
    'mercury': [2, 5], // Gemini, Virgo
    'jupiter': [8, 11], // Sagittarius, Pisces
    'venus': [1, 6], // Taurus, Libra
    'saturn': [9, 10], // Capricorn, Aquarius
  };
  
  const exaltationSigns: { [key: string]: number } = {
    'sun': 0, // Aries
    'moon': 1, // Taurus
    'mars': 9, // Capricorn
    'mercury': 5, // Virgo
    'jupiter': 3, // Cancer
    'venus': 11, // Pisces
    'saturn': 6, // Libra
  };
  
  if (exaltationSigns[planetLower] === signIndex) {
    return 'Exalted';
  } else if (ownSigns[planetLower]?.includes(signIndex)) {
    return 'Own Sign';
  } else if (exaltationSigns[planetLower] === (signIndex + 6) % 12) {
    return 'Debilitated';
  }
  
  return 'Neutral';
}

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
    const { command, data: birthData } = await req.json();

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

    if (command === 'calculateChart') {
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

      const planets: Planet[] = planetsData.map((p: any) => {
        const longitude = p.ChartPosition?.Ecliptic?.DecimalDegrees || 0;
        const siderealLongitude = birthData.astrologicalSystem === 'vedic' ? 
          tropicalToSidereal(longitude) : longitude;
        const nakshatra = birthData.astrologicalSystem === 'vedic' ? 
          getNakshatra(siderealLongitude) : null;
        
        return {
          name: p.key || p.label,
          longitude: longitude,
          latitude: p.latitude || 0,
          speed: p.speed || 0,
          sign: p.Sign?.label || 'Unknown',
          degrees: p.ChartPosition?.Ecliptic?.ArcDegrees?.degrees || 0,
          house: p.House?.id || 0,
          isRetrograde: p.isRetrograde || false,
          // Enhanced Vedic properties
          siderealLongitude: siderealLongitude,
          nakshatra: nakshatra,
          dignity: calculatePlanetaryDignity(p.key || p.label, longitude)
        };
      });

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
    } else {
      return new Response(JSON.stringify({ error: `Unknown command: ${command}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in astrology-service function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});