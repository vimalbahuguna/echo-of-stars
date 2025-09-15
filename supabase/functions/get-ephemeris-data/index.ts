import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CircularNatalHoroscope } from 'https://esm.sh/circular-natal-horoscope-js@latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, latitude, longitude, timezone, houseSystem = 'Placidus' } = await req.json();

    if (!startDate || !endDate || !latitude || !longitude || !timezone) {
      throw new Error('startDate, endDate, latitude, longitude, and timezone are required.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new Error('startDate cannot be after endDate.');
    }

    // Limit the range to prevent excessive computation
    const maxDays = 31; // Max one month
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > maxDays) {
      throw new Error(`Date range exceeds maximum of ${maxDays} days.`);
    }

    const ephemerisData = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const hour = 12; // Midday for general ephemeris
      const minute = 0;

      const horoscope = new CircularNatalHoroscope({
        year, month, day, hour, minute,
        latitude,
        longitude,
        timezone,
        houseSystem,
      });

      const planetsData = horoscope.getPlanets();
      const housesData = horoscope.getHouses();
      const aspectsData = horoscope.getAspects();

      ephemerisData.push({
        date: currentDate.toISOString().split('T')[0],
        planets: planetsData.map((p: any) => ({
          name: p.label,
          longitude: p.longitude,
          sign: p.Sign.label,
          degrees: p.Sign.degree,
          isRetrograde: p.isRetrograde,
        })),
        aspects: aspectsData.map((a: any) => ({
          from: a.planet1.label,
          to: a.planet2.label,
          aspect: a.aspect.label,
          orb: a.aspect.orb,
        })),
        // You can add more data here, e.g., moon phase, ingresses, etc.
      });

      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return new Response(JSON.stringify({
      success: true,
      ephemeris: ephemerisData,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating ephemeris data:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
