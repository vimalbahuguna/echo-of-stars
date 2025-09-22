import { Planet } from '../types/astrology';

// Enhanced astronomical constants for higher precision
export const ASTRONOMICAL_CONSTANTS = {
  // Ayanamsa values for different systems (degrees)
  LAHIRI_AYANAMSA: 24.14, // Current approximate value
  RAMAN_AYANAMSA: 21.45,
  KRISHNAMURTI_AYANAMSA: 23.85,
  
  // Planetary mean motions (degrees per day)
  MEAN_MOTIONS: {
    sun: 0.9856,
    moon: 13.1764,
    mercury: 4.0923,
    venus: 1.6021,
    mars: 0.5240,
    jupiter: 0.0831,
    saturn: 0.0335,
    rahu: -0.0529, // Mean node (retrograde)
    ketu: -0.0529,
  },
  
  // Nakshatra data (27 nakshatras, 13°20' each)
  NAKSHATRA_SPAN: 13.333333, // 13°20' in decimal degrees
  NAKSHATRA_COUNT: 27,
};

// Nakshatra definitions with enhanced properties
export const NAKSHATRAS = [
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

// Enhanced zodiac sign properties
export const ZODIAC_SIGNS = [
  { name: 'Aries', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', exaltation: 'Sun' },
  { name: 'Taurus', element: 'Earth', quality: 'Fixed', ruler: 'Venus', exaltation: 'Moon' },
  { name: 'Gemini', element: 'Air', quality: 'Mutable', ruler: 'Mercury', exaltation: 'Rahu' },
  { name: 'Cancer', element: 'Water', quality: 'Cardinal', ruler: 'Moon', exaltation: 'Jupiter' },
  { name: 'Leo', element: 'Fire', quality: 'Fixed', ruler: 'Sun', exaltation: 'Ketu' },
  { name: 'Virgo', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', exaltation: 'Mercury' },
  { name: 'Libra', element: 'Air', quality: 'Cardinal', ruler: 'Venus', exaltation: 'Saturn' },
  { name: 'Scorpio', element: 'Water', quality: 'Fixed', ruler: 'Mars', exaltation: 'Uranus' },
  { name: 'Sagittarius', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', exaltation: 'Ketu' },
  { name: 'Capricorn', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', exaltation: 'Mars' },
  { name: 'Aquarius', element: 'Air', quality: 'Fixed', ruler: 'Saturn', exaltation: 'Rahu' },
  { name: 'Pisces', element: 'Water', quality: 'Mutable', ruler: 'Jupiter', exaltation: 'Venus' },
];

/**
 * Convert tropical longitude to sidereal using specified ayanamsa
 */
export function tropicalToSidereal(longitude: number, ayanamsa: number = ASTRONOMICAL_CONSTANTS.LAHIRI_AYANAMSA): number {
  let sidereal = longitude - ayanamsa;
  return sidereal < 0 ? sidereal + 360 : sidereal;
}

/**
 * Convert sidereal longitude to tropical using specified ayanamsa
 */
export function siderealToTropical(longitude: number, ayanamsa: number = ASTRONOMICAL_CONSTANTS.LAHIRI_AYANAMSA): number {
  let tropical = longitude + ayanamsa;
  return tropical >= 360 ? tropical - 360 : tropical;
}

/**
 * Get zodiac sign from longitude (0-based index)
 */
export function getZodiacSign(longitude: number): { sign: string; degrees: number; minutes: number; seconds: number } {
  const normalizedLongitude = longitude < 0 ? longitude + 360 : longitude % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  const degreesInSign = normalizedLongitude % 30;
  const degrees = Math.floor(degreesInSign);
  const minutes = Math.floor((degreesInSign - degrees) * 60);
  const seconds = Math.floor(((degreesInSign - degrees) * 60 - minutes) * 60);
  
  return {
    sign: ZODIAC_SIGNS[signIndex].name,
    degrees,
    minutes,
    seconds
  };
}

/**
 * Get nakshatra from sidereal longitude
 */
export function getNakshatra(siderealLongitude: number): { 
  nakshatra: string; 
  lord: string; 
  pada: number; 
  degrees: number;
  deity: string;
  nature: string;
  guna: string;
} {
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

/**
 * Calculate planetary strength (Shadbala) - simplified version
 */
export function calculatePlanetaryStrength(planet: Planet, houses: number[]): {
  positional: number;
  temporal: number;
  directional: number;
  motional: number;
  natural: number;
  aspectual: number;
  total: number;
} {
  // Simplified Shadbala calculation
  const positional = calculatePositionalStrength(planet);
  const temporal = calculateTemporalStrength(planet);
  const directional = calculateDirectionalStrength(planet, houses);
  const motional = calculateMotionalStrength(planet);
  const natural = calculateNaturalStrength(planet.name);
  const aspectual = 60; // Placeholder - requires aspect calculations
  
  const total = positional + temporal + directional + motional + natural + aspectual;
  
  return {
    positional,
    temporal,
    directional,
    motional,
    natural,
    aspectual,
    total
  };
}

function calculatePositionalStrength(planet: Planet): number {
  // Exaltation/debilitation strength
  const exaltationDegrees = getExaltationDegree(planet.name);
  if (exaltationDegrees !== null) {
    const distance = Math.abs(planet.longitude - exaltationDegrees);
    const normalizedDistance = Math.min(distance, 360 - distance);
    return Math.max(0, 60 - normalizedDistance);
  }
  return 30; // Neutral strength
}

function calculateTemporalStrength(planet: Planet): number {
  // Day/night strength based on planet nature
  const isDayTime = true; // This would need actual time calculation
  const dayPlanets = ['sun', 'jupiter', 'mars'];
  const nightPlanets = ['moon', 'venus', 'saturn'];
  
  if (dayPlanets.includes(planet.name.toLowerCase()) && isDayTime) return 60;
  if (nightPlanets.includes(planet.name.toLowerCase()) && !isDayTime) return 60;
  return 30;
}

function calculateDirectionalStrength(planet: Planet, houses: number[]): number {
  // Dig Bala - directional strength
  const directionalHouses: { [key: string]: number } = {
    'sun': 10, 'moon': 4, 'mars': 10, 'mercury': 1,
    'jupiter': 1, 'venus': 4, 'saturn': 7
  };
  
  const strongHouse = directionalHouses[planet.name.toLowerCase()];
  if (strongHouse && planet.house === strongHouse) return 60;
  return 30;
}

function calculateMotionalStrength(planet: Planet): number {
  // Chesta Bala - motional strength
  if (planet.isRetrograde) return 60; // Retrograde planets are considered strong
  if (Math.abs(planet.speed) > getAverageSpeed(planet.name)) return 45;
  return 30;
}

function calculateNaturalStrength(planetName: string): number {
  // Natural strength hierarchy
  const naturalStrengths: { [key: string]: number } = {
    'sun': 60, 'moon': 51.43, 'venus': 42.86, 'jupiter': 34.29,
    'mercury': 25.71, 'mars': 17.14, 'saturn': 8.57
  };
  return naturalStrengths[planetName.toLowerCase()] || 30;
}

function getExaltationDegree(planetName: string): number | null {
  const exaltationDegrees: { [key: string]: number } = {
    'sun': 10, 'moon': 33, 'mars': 298, 'mercury': 165,
    'jupiter': 95, 'venus': 357, 'saturn': 200
  };
  return exaltationDegrees[planetName.toLowerCase()] || null;
}

function getAverageSpeed(planetName: string): number {
  return ASTRONOMICAL_CONSTANTS.MEAN_MOTIONS[planetName.toLowerCase() as keyof typeof ASTRONOMICAL_CONSTANTS.MEAN_MOTIONS] || 1;
}

/**
 * Calculate divisional chart positions (Vargas)
 */
export function calculateDivisionalChart(planets: Planet[], division: number): Planet[] {
  return planets.map(planet => {
    const siderealLongitude = tropicalToSidereal(planet.longitude);
    const signLongitude = siderealLongitude % 30;
    const vargaPosition = (signLongitude * division) % 360;
    
    return {
      ...planet,
      longitude: vargaPosition,
      sign: getZodiacSign(vargaPosition).sign,
      degrees: getZodiacSign(vargaPosition).degrees
    };
  });
}

// Enhanced aspect definitions including minor aspects
export const ENHANCED_ASPECT_DEFINITIONS = {
  // Major aspects
  conjunction: { angle: 0, orb: 8, type: 'major', nature: 'neutral', strength: 1.0 },
  opposition: { angle: 180, orb: 8, type: 'major', nature: 'challenging', strength: 1.0 },
  trine: { angle: 120, orb: 8, type: 'major', nature: 'harmonious', strength: 0.9 },
  square: { angle: 90, orb: 8, type: 'major', nature: 'challenging', strength: 0.9 },
  sextile: { angle: 60, orb: 6, type: 'major', nature: 'harmonious', strength: 0.7 },
  
  // Minor aspects
  semisextile: { angle: 30, orb: 2, type: 'minor', nature: 'neutral', strength: 0.3 },
  semisquare: { angle: 45, orb: 2, type: 'minor', nature: 'challenging', strength: 0.4 },
  quintile: { angle: 72, orb: 2, type: 'minor', nature: 'creative', strength: 0.3 },
  sesquiquadrate: { angle: 135, orb: 2, type: 'minor', nature: 'challenging', strength: 0.4 },
  biquintile: { angle: 144, orb: 2, type: 'minor', nature: 'creative', strength: 0.3 },
  quincunx: { angle: 150, orb: 3, type: 'minor', nature: 'adjusting', strength: 0.5 },
  
  // Specialized aspects
  septile: { angle: 51.43, orb: 1, type: 'spiritual', nature: 'karmic', strength: 0.2 },
  novile: { angle: 40, orb: 1, type: 'spiritual', nature: 'spiritual', strength: 0.2 }
};

// Planet weights for aspect calculations
export const PLANET_ASPECT_WEIGHTS = {
  Sun: 1.0,
  Moon: 1.0,
  Mercury: 0.7,
  Venus: 0.9,
  Mars: 0.8,
  Jupiter: 0.6,
  Saturn: 0.7,
  Uranus: 0.4,
  Neptune: 0.4,
  Pluto: 0.5,
  'North Node': 0.6,
  'South Node': 0.6,
  Chiron: 0.5,
  Ascendant: 0.9,
  Midheaven: 0.6
};

/**
 * Calculate aspects between planets with enhanced minor aspects and variable orbs
 */
export function calculateAspects(
  planets: Planet[], 
  includeMinorAspects: boolean = false,
  includeSpiritualAspects: boolean = false
): Array<{
  from: string;
  to: string;
  aspect: string;
  orb: number;
  strength: number;
  type: string;
  nature: string;
  exact: boolean;
}> {
  const aspects = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;

      Object.entries(ENHANCED_ASPECT_DEFINITIONS).forEach(([name, def]) => {
        // Filter aspects based on type preferences
        if (!includeMinorAspects && def.type === 'minor') return;
        if (!includeSpiritualAspects && def.type === 'spiritual') return;

        const orb = Math.abs(angle - def.angle);
        if (orb <= def.orb) {
          // Calculate enhanced strength based on orb tightness and planet weights
          const orbFactor = 1 - (orb / def.orb);
          const planet1Weight = PLANET_ASPECT_WEIGHTS[planet1.name] || 0.5;
          const planet2Weight = PLANET_ASPECT_WEIGHTS[planet2.name] || 0.5;
          const planetWeight = (planet1Weight + planet2Weight) / 2;
          
          const strength = def.strength * orbFactor * planetWeight * 100;
          
          aspects.push({
            from: planet1.name,
            to: planet2.name,
            aspect: name,
            orb,
            strength,
            type: def.type,
            nature: def.nature,
            exact: orb < 1 // Consider exact if within 1 degree
          });
        }
      });
    }
  }

  // Sort by strength (strongest first)
  return aspects.sort((a, b) => b.strength - a.strength);
}

/**
 * Calculate aspects with variable orbs based on planet importance
 */
export function calculateAspectsWithVariableOrbs(planets: Planet[]): Array<{
  from: string;
  to: string;
  aspect: string;
  orb: number;
  strength: number;
  type: string;
  nature: string;
  exact: boolean;
}> {
  const aspects = [];
  const luminaries = ['Sun', 'Moon'];
  const personalPlanets = ['Mercury', 'Venus', 'Mars'];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;

      Object.entries(ENHANCED_ASPECT_DEFINITIONS).forEach(([name, def]) => {
        // Adjust orb based on planets involved
        let adjustedOrb = def.orb;
        
        // Tighter orbs for luminaries
        if (luminaries.includes(planet1.name) || luminaries.includes(planet2.name)) {
          adjustedOrb *= 1.2;
        }
        
        // Slightly wider orbs for personal planets
        if (personalPlanets.includes(planet1.name) || personalPlanets.includes(planet2.name)) {
          adjustedOrb *= 1.1;
        }
        
        // Tighter orbs for outer planets
        const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];
        if (outerPlanets.includes(planet1.name) || outerPlanets.includes(planet2.name)) {
          adjustedOrb *= 0.8;
        }

        const orb = Math.abs(angle - def.angle);
        if (orb <= adjustedOrb) {
          const orbFactor = 1 - (orb / adjustedOrb);
          const planet1Weight = PLANET_ASPECT_WEIGHTS[planet1.name] || 0.5;
          const planet2Weight = PLANET_ASPECT_WEIGHTS[planet2.name] || 0.5;
          const planetWeight = (planet1Weight + planet2Weight) / 2;
          
          const strength = def.strength * orbFactor * planetWeight * 100;
          
          aspects.push({
            from: planet1.name,
            to: planet2.name,
            aspect: name,
            orb,
            strength,
            type: def.type,
            nature: def.nature,
            exact: orb < 0.5 // Tighter exact orb for variable system
          });
        }
      });
    }
  }

  return aspects.sort((a, b) => b.strength - a.strength);
}

/**
 * Enhanced planetary position with additional Vedic properties
 */
export function enhancePlanetaryPosition(planet: Planet): Planet & {
  siderealLongitude: number;
  nakshatra: ReturnType<typeof getNakshatra>;
  strength: ReturnType<typeof calculatePlanetaryStrength>;
  dignity: string;
} {
  const siderealLongitude = tropicalToSidereal(planet.longitude);
  const nakshatra = getNakshatra(siderealLongitude);
  
  // Calculate dignity (exaltation, own sign, etc.)
  let dignity = 'Neutral';
  const signIndex = Math.floor(planet.longitude / 30);
  const currentSign = ZODIAC_SIGNS[signIndex];
  
  if (currentSign.ruler.toLowerCase() === planet.name.toLowerCase()) {
    dignity = 'Own Sign';
  } else if (currentSign.exaltation.toLowerCase() === planet.name.toLowerCase()) {
    dignity = 'Exalted';
  }
  
  return {
    ...planet,
    siderealLongitude,
    nakshatra,
    strength: calculatePlanetaryStrength(planet, []), // Houses would need to be passed
    dignity
  };
}