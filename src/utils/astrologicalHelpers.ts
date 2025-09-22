// Helper functions for astrological calculations and interpretations

/**
 * Get zodiac sign name from longitude
 */
export function getZodiacSignName(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  return signs[signIndex];
}

/**
 * Find house for a given longitude
 */
export function findHouseForLongitude(longitude: number, houseCusps: number[]): number {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  
  for (let i = 0; i < houseCusps.length; i++) {
    const currentCusp = ((houseCusps[i] % 360) + 360) % 360;
    const nextCusp = i === houseCusps.length - 1 
      ? ((houseCusps[0] % 360) + 360) % 360 
      : ((houseCusps[i + 1] % 360) + 360) % 360;
    
    if (currentCusp <= nextCusp) {
      // Normal case: cusp doesn't cross 0°
      if (normalizedLongitude >= currentCusp && normalizedLongitude < nextCusp) {
        return i + 1;
      }
    } else {
      // Cusp crosses 0° (e.g., from 350° to 10°)
      if (normalizedLongitude >= currentCusp || normalizedLongitude < nextCusp) {
        return i + 1;
      }
    }
  }
  
  return 1; // Default to first house if not found
}

/**
 * Get ordinal number string (1st, 2nd, 3rd, etc.)
 */
export function getOrdinalNumber(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Get Sun sign themes for composite analysis
 */
export function getSunSignThemes(sign: string): string {
  const themes: Record<string, string> = {
    'Aries': 'pioneering spirit, leadership, and dynamic action',
    'Taurus': 'stability, sensuality, and building lasting foundations',
    'Gemini': 'communication, versatility, and intellectual exploration',
    'Cancer': 'nurturing, emotional depth, and creating security',
    'Leo': 'creativity, self-expression, and generous leadership',
    'Virgo': 'service, attention to detail, and practical improvement',
    'Libra': 'harmony, partnership, and aesthetic beauty',
    'Scorpio': 'transformation, intensity, and deep psychological insight',
    'Sagittarius': 'adventure, philosophy, and expanding horizons',
    'Capricorn': 'achievement, responsibility, and long-term goals',
    'Aquarius': 'innovation, humanitarian ideals, and unique perspectives',
    'Pisces': 'compassion, spirituality, and transcendent connection'
  };
  
  return themes[sign] || 'unique expression and growth';
}

/**
 * Get house themes for composite analysis
 */
export function getHouseThemes(house: number): string {
  const themes: Record<number, string> = {
    1: 'identity, appearance, and how you present as a couple',
    2: 'shared resources, values, and material security',
    3: 'communication, daily interactions, and local community',
    4: 'home, family, and emotional foundations',
    5: 'creativity, romance, and shared pleasures',
    6: 'daily routines, health, and service to others',
    7: 'partnership dynamics, cooperation, and public relationships',
    8: 'transformation, shared resources, and deep intimacy',
    9: 'shared beliefs, higher learning, and long-distance connections',
    10: 'public reputation, career goals, and social status',
    11: 'friendships, group activities, and shared hopes',
    12: 'spirituality, hidden aspects, and karmic connections'
  };
  
  return themes[house] || 'personal growth and development';
}

/**
 * Element classification functions
 */
export function isFireSign(sign: string): boolean {
  return ['Aries', 'Leo', 'Sagittarius'].includes(sign);
}

export function isEarthSign(sign: string): boolean {
  return ['Taurus', 'Virgo', 'Capricorn'].includes(sign);
}

export function isAirSign(sign: string): boolean {
  return ['Gemini', 'Libra', 'Aquarius'].includes(sign);
}

export function isWaterSign(sign: string): boolean {
  return ['Cancer', 'Scorpio', 'Pisces'].includes(sign);
}

/**
 * Calculate the strength of an aspect based on orb tightness
 */
export function calculateAspectStrength(orb: number, maxOrb: number): number {
  if (orb > maxOrb) return 0;
  return Math.pow(1 - (orb / maxOrb), 2); // Quadratic falloff for more realistic strength
}

/**
 * Determine aspect nature from angle
 */
export function getAspectNature(aspectName: string): 'harmonious' | 'challenging' | 'neutral' | 'creative' | 'adjusting' | 'karmic' | 'spiritual' {
  const aspectNatures: Record<string, 'harmonious' | 'challenging' | 'neutral' | 'creative' | 'adjusting' | 'karmic' | 'spiritual'> = {
    'conjunction': 'neutral',
    'sextile': 'harmonious',
    'square': 'challenging',
    'trine': 'harmonious',
    'opposition': 'challenging',
    'semisextile': 'neutral',
    'semisquare': 'challenging',
    'quintile': 'creative',
    'sesquiquadrate': 'challenging',
    'biquintile': 'creative',
    'quincunx': 'adjusting',
    'septile': 'karmic',
    'novile': 'spiritual'
  };
  
  return aspectNatures[aspectName] || 'neutral';
}

/**
 * Format degrees to degrees, minutes, seconds
 */
export function formatDegrees(degrees: number): string {
  const wholeDegrees = Math.floor(degrees);
  const minutes = Math.floor((degrees - wholeDegrees) * 60);
  const seconds = Math.floor(((degrees - wholeDegrees) * 60 - minutes) * 60);
  
  return `${wholeDegrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"`;
}

/**
 * Calculate the angular separation between two longitudes
 */
export function calculateAngularSeparation(long1: number, long2: number): number {
  let diff = Math.abs(long1 - long2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Normalize longitude to 0-360 range
 */
export function normalizeLongitude(longitude: number): number {
  return ((longitude % 360) + 360) % 360;
}

/**
 * Convert decimal degrees to sign position
 */
export function degreesToSignPosition(longitude: number): { sign: string; degrees: number; minutes: number; seconds: number } {
  const normalizedLongitude = normalizeLongitude(longitude);
  const signIndex = Math.floor(normalizedLongitude / 30);
  const signDegrees = normalizedLongitude % 30;
  
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const degrees = Math.floor(signDegrees);
  const minutes = Math.floor((signDegrees - degrees) * 60);
  const seconds = Math.floor(((signDegrees - degrees) * 60 - minutes) * 60);
  
  return {
    sign: signs[signIndex],
    degrees,
    minutes,
    seconds
  };
}