import { Planet, Aspect, ChartData, House } from '../types/astrology';

// Enhanced aspect definitions including minor aspects
export const ASPECT_DEFINITIONS = {
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
  
  // Spiritual aspects
  septile: { angle: 51.43, orb: 1, type: 'spiritual', nature: 'karmic', strength: 0.2 },
  novile: { angle: 40, orb: 1, type: 'spiritual', nature: 'spiritual', strength: 0.2 }
};

// Planet weights for synastry calculations
export const PLANET_WEIGHTS = {
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

// Synastry interpretations for key planetary combinations
export const SYNASTRY_INTERPRETATIONS = {
  'Sun-Moon': {
    conjunction: 'Deep emotional understanding and natural compatibility',
    opposition: 'Complementary but potentially polarizing energies',
    trine: 'Harmonious emotional and ego expression',
    square: 'Tension between core identity and emotional needs',
    sextile: 'Supportive and encouraging connection'
  },
  'Venus-Mars': {
    conjunction: 'Strong romantic and sexual attraction',
    opposition: 'Magnetic attraction with potential for conflict',
    trine: 'Natural romantic harmony and passion',
    square: 'Intense attraction with relationship challenges',
    sextile: 'Pleasant romantic and physical compatibility'
  },
  'Moon-Venus': {
    conjunction: 'Deep emotional and romantic connection',
    trine: 'Natural affection and emotional harmony',
    square: 'Different emotional and love languages',
    sextile: 'Gentle, supportive emotional bond'
  }
};

export interface EnhancedAspect {
  from: string;
  to: string;
  aspect: string;
  orb: number;
  strength?: number;
  type: string;
  nature: string;
  exact: boolean;
}

export interface SynastryAspect {
  from: string;
  to: string;
  aspect: string;
  orb: number;
  strength?: number;
  type: string;
  person1Planet: Planet;
  person2Planet: Planet;
  weight: number;
  interpretation?: string;
  exact: boolean;
}

export interface HouseOverlay {
  planet: Planet;
  fromChart: number; // 1 or 2
  houseNumber: number;
  interpretation?: string;
}

export interface CompositeChart {
  planets: Planet[];
  houses: number[];
  ascendant: number;
  midheaven: number;
  aspects: EnhancedAspect[];
}

export interface CompatibilityScore {
  overall: number;
  emotional: number;
  intellectual: number;
  physical: number;
  spiritual: number;
  communication: number;
  values: number;
}

// Helper functions for zodiac signs and elements
function getZodiacSignName(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[Math.floor(longitude / 30)];
}

function getSunSignThemes(sign: string): string {
  const themes: Record<string, string> = {
    'Aries': 'leadership, initiative, and pioneering spirit',
    'Taurus': 'stability, sensuality, and material security',
    'Gemini': 'communication, versatility, and intellectual curiosity',
    'Cancer': 'nurturing, emotional depth, and family bonds',
    'Leo': 'creativity, self-expression, and generous leadership',
    'Virgo': 'service, attention to detail, and practical wisdom',
    'Libra': 'harmony, partnership, and aesthetic beauty',
    'Scorpio': 'transformation, intensity, and emotional depth',
    'Sagittarius': 'adventure, philosophy, and higher learning',
    'Capricorn': 'achievement, responsibility, and long-term goals',
    'Aquarius': 'innovation, humanitarian ideals, and independence',
    'Pisces': 'compassion, spirituality, and artistic expression'
  };
  return themes[sign] || 'personal growth and self-discovery';
}

function getHouseThemes(house: number): string {
  const themes = [
    'identity and self-expression',
    'values and material resources',
    'communication and learning',
    'home and emotional foundation',
    'creativity and self-expression',
    'service and daily routines',
    'partnerships and relationships',
    'transformation and shared resources',
    'philosophy and higher learning',
    'career and public reputation',
    'friendships and group involvement',
    'spirituality and subconscious patterns'
  ];
  return themes[house - 1] || 'personal development';
}

function getOrdinalNumber(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${num}${suffix}`;
}

function isFireSign(sign: string): boolean {
  return ['Aries', 'Leo', 'Sagittarius'].includes(sign);
}

function isEarthSign(sign: string): boolean {
  return ['Taurus', 'Virgo', 'Capricorn'].includes(sign);
}

function isAirSign(sign: string): boolean {
  return ['Gemini', 'Libra', 'Aquarius'].includes(sign);
}

function isWaterSign(sign: string): boolean {
  return ['Cancer', 'Scorpio', 'Pisces'].includes(sign);
}

// Main calculation functions
export function calculateAdvancedSynastryAspects(
  chart1Planets: Planet[],
  chart2Planets: Planet[],
  includeMinorAspects: boolean = true
): SynastryAspect[] {
  const synastryAspects: SynastryAspect[] = [];

  chart1Planets.forEach(planet1 => {
    chart2Planets.forEach(planet2 => {
      const aspects = findAspectsBetweenPlanets(planet1, planet2, includeMinorAspects);
      
      aspects.forEach(aspect => {
        const weight = calculateAspectWeight(planet1, planet2, aspect);
        const interpretation = getAspectInterpretation(planet1, planet2, aspect);
        
        synastryAspects.push({
          from: planet1.name,
          to: planet2.name,
          aspect: aspect.aspect,
          orb: aspect.orb,
          strength: aspect.strength,
          type: aspect.type,
          person1Planet: planet1,
          person2Planet: planet2,
          weight,
          interpretation,
          exact: aspect.exact
        });
      });
    });
  });

  return synastryAspects.sort((a, b) => (b.weight * (b.strength || 0)) - (a.weight * (a.strength || 0)));
}

export function calculateHouseOverlays(
  chart1Planets: Planet[],
  chart2Planets: Planet[],
  chart1Houses: number[] | House[],
  chart2Houses: number[] | House[]
): HouseOverlay[] {
  const overlays: HouseOverlay[] = [];
  
  // Convert House[] to number[] if needed
  const houses1 = Array.isArray(chart1Houses) && chart1Houses.length > 0 && typeof chart1Houses[0] === 'object' 
    ? (chart1Houses as House[]).map(h => h.cusp) 
    : chart1Houses as number[];
  const houses2 = Array.isArray(chart2Houses) && chart2Houses.length > 0 && typeof chart2Houses[0] === 'object' 
    ? (chart2Houses as House[]).map(h => h.cusp) 
    : chart2Houses as number[];

  // Chart 1 planets in Chart 2 houses
  chart1Planets.forEach(planet => {
    const houseNumber = findHouseForPlanet(planet, houses2);
    overlays.push({
      planet,
      fromChart: 1,
      houseNumber,
      interpretation: getHouseOverlayInterpretation(planet, houseNumber, 1)
    });
  });

  // Chart 2 planets in Chart 1 houses
  chart2Planets.forEach(planet => {
    const houseNumber = findHouseForPlanet(planet, houses1);
    overlays.push({
      planet,
      fromChart: 2,
      houseNumber,
      interpretation: getHouseOverlayInterpretation(planet, houseNumber, 2)
    });
  });

  return overlays;
}

export function calculateCompositeChart(
  chart1: ChartData,
  chart2: ChartData
): CompositeChart {
  const compositePlanets: Planet[] = [];
  const compositeHouses: number[] = [];

  // Calculate composite planets using enhanced midpoint method
  chart1.planets.forEach((planet1, index) => {
    const planet2 = chart2.planets[index];
    if (planet2 && planet1.name === planet2.name) {
      const compositeLongitude = calculateEnhancedMidpoint(planet1.longitude, planet2.longitude);
      
      compositePlanets.push({
         name: planet1.name,
         longitude: compositeLongitude,
         latitude: ((planet1.latitude || 0) + (planet2.latitude || 0)) / 2,
         speed: ((planet1.speed || 0) + (planet2.speed || 0)) / 2,
         isRetrograde: planet1.isRetrograde || planet2.isRetrograde,
         house: findHouseForLongitude(compositeLongitude, compositeHouses)
       });
    }
  });

  // Calculate composite house cusps
   // Convert houses to number arrays if needed
   const houses1 = Array.isArray(chart1.houses) && chart1.houses.length > 0 && typeof chart1.houses[0] === 'object' 
     ? (chart1.houses as House[]).map(h => h.cusp) 
     : chart1.houses as number[];
   const houses2 = Array.isArray(chart2.houses) && chart2.houses.length > 0 && typeof chart2.houses[0] === 'object' 
     ? (chart2.houses as House[]).map(h => h.cusp) 
     : chart2.houses as number[];
   
   for (let i = 0; i < 12; i++) {
     if (houses1[i] !== undefined && houses2[i] !== undefined) {
       compositeHouses.push(calculateEnhancedMidpoint(houses1[i], houses2[i]));
     }
   }

  // Calculate composite ascendant and midheaven
  const compositeAscendant = calculateEnhancedMidpoint(chart1.ascendant, chart2.ascendant);
  const compositeMidheaven = calculateEnhancedMidpoint(chart1.midheaven, chart2.midheaven);

  // Calculate aspects within the composite chart
  const compositeAspects = calculateEnhancedCompositeAspects(compositePlanets);

  return {
    planets: compositePlanets,
    houses: compositeHouses,
    ascendant: compositeAscendant,
    midheaven: compositeMidheaven,
    aspects: compositeAspects
  };
}

function calculateEnhancedMidpoint(longitude1: number, longitude2: number): number {
  // Normalize longitudes to 0-360 range
  const norm1 = ((longitude1 % 360) + 360) % 360;
  const norm2 = ((longitude2 % 360) + 360) % 360;
  
  // Calculate both possible midpoints
  const midpoint1 = (norm1 + norm2) / 2;
  const midpoint2 = midpoint1 + 180;
  
  // Choose the midpoint that represents the shorter arc
  const diff = Math.abs(norm2 - norm1);
  if (diff <= 180) {
    return midpoint1 % 360;
  } else {
    return midpoint2 % 360;
  }
}

function calculateEnhancedCompositeAspects(planets: Planet[]): EnhancedAspect[] {
  const aspects: EnhancedAspect[] = [];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      Object.entries(ASPECT_DEFINITIONS).forEach(([name, def]) => {
        const angleDiff = Math.abs(planet1.longitude - planet2.longitude);
        const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
        const orb = Math.abs(normalizedDiff - def.angle);
        
        if (orb <= def.orb * 0.75) { // Tighter orbs for composite
          const orbFactor = 1 - (orb / (def.orb * 0.75));
          const strength = def.strength * orbFactor;
          
          aspects.push({
            from: planet1.name,
            to: planet2.name,
            aspect: name,
            orb,
            strength,
            type: def.type,
            nature: def.nature,
            exact: orb < 1
          });
        }
      });
    }
  }
  
  return aspects.sort((a, b) => (b.strength || 0) - (a.strength || 0));
}

export function analyzeCompositeChart(composite: CompositeChart): {
  relationshipThemes: string[];
  strengths: string[];
  challenges: string[];
  purpose: string;
  advice: string[];
} {
  const themes: string[] = [];
  const strengths: string[] = [];
  const challenges: string[] = [];
  let purpose = '';
  const advice: string[] = [];
  
  // Analyze composite Sun for relationship identity
  const compositeSun = composite.planets.find(p => p.name === 'Sun');
  if (compositeSun) {
    const sunSign = getZodiacSignName(compositeSun.longitude);
    const sunHouse = compositeSun.house;
    
    themes.push(`This relationship has a ${sunSign} identity, emphasizing ${getSunSignThemes(sunSign)}`);
    themes.push(`The relationship's core purpose is expressed through the ${getOrdinalNumber(sunHouse)} house: ${getHouseThemes(sunHouse)}`);
  }
  
  // Analyze composite Moon for emotional dynamics
  const compositeMoon = composite.planets.find(p => p.name === 'Moon');
  if (compositeMoon) {
    const moonSign = getZodiacSignName(compositeMoon.longitude);
    const moonHouse = compositeMoon.house;
    
    themes.push(`Emotional security is found through ${moonSign} qualities in the ${getOrdinalNumber(moonHouse)} house`);
  }
  
  // Analyze major aspects for relationship dynamics
  composite.aspects.forEach(aspect => {
    if (aspect.type === 'major' && aspect.strength && aspect.strength > 0.7) {
      if (aspect.nature === 'harmonious') {
        strengths.push(`${aspect.from}-${aspect.to} ${aspect.aspect}: Natural flow and support`);
      } else if (aspect.nature === 'challenging') {
        challenges.push(`${aspect.from}-${aspect.to} ${aspect.aspect}: Growth through tension and transformation`);
      }
    }
  });
  
  // Generate purpose based on composite chart emphasis
  const fireSignCount = composite.planets.filter(p => isFireSign(getZodiacSignName(p.longitude))).length;
  const earthSignCount = composite.planets.filter(p => isEarthSign(getZodiacSignName(p.longitude))).length;
  const airSignCount = composite.planets.filter(p => isAirSign(getZodiacSignName(p.longitude))).length;
  const waterSignCount = composite.planets.filter(p => isWaterSign(getZodiacSignName(p.longitude))).length;
  
  const dominantElement = Math.max(fireSignCount, earthSignCount, airSignCount, waterSignCount);
  
  if (dominantElement === fireSignCount) {
    purpose = 'To inspire action, creativity, and passionate expression in the world';
  } else if (dominantElement === earthSignCount) {
    purpose = 'To build something lasting and practical that serves the material world';
  } else if (dominantElement === airSignCount) {
    purpose = 'To communicate ideas, foster understanding, and create intellectual connections';
  } else {
    purpose = 'To deepen emotional understanding and nurture spiritual growth';
  }
  
  // Generate advice based on aspects
  const harmonious = composite.aspects.filter(a => a.nature === 'harmonious').length;
  const challenging = composite.aspects.filter(a => a.nature === 'challenging').length;
  
  if (harmonious > challenging) {
    advice.push('Embrace the natural flow between you and build on your strengths');
    advice.push('Be mindful not to become complacent in your harmony');
  } else {
    advice.push('Use challenges as opportunities for growth and deeper understanding');
    advice.push('Practice patience and compassion during difficult periods');
  }
  
  return { relationshipThemes: themes, strengths, challenges, purpose, advice };
}

export function calculateCompatibilityScores(
  synastryAspects: SynastryAspect[],
  houseOverlays: HouseOverlay[],
  compositeChart: CompositeChart
): CompatibilityScore {
  const scores: CompatibilityScore = {
    overall: 0,
    emotional: 0,
    intellectual: 0,
    physical: 0,
    spiritual: 0,
    communication: 0,
    values: 0
  };

  // Calculate scores from synastry aspects
  synastryAspects.forEach(aspect => {
    const category = categorizeAspectForScoring(aspect);
    const aspectScore = calculateAspectScore(aspect);
    scores[category] += aspectScore;
  });

  // Calculate scores from house overlays
  houseOverlays.forEach(overlay => {
    const category = categorizeHouseOverlayForScoring(overlay);
    const overlayScore = calculateHouseOverlayScore(overlay);
    scores[category] += overlayScore;
  });

  // Normalize scores to 0-100 range
  Object.keys(scores).forEach(key => {
    const category = key as keyof CompatibilityScore;
    scores[category] = Math.max(0, Math.min(100, scores[category] + 50));
  });

  // Calculate overall score as weighted average
  scores.overall = (
    scores.emotional * 0.25 +
    scores.intellectual * 0.15 +
    scores.physical * 0.20 +
    scores.spiritual * 0.15 +
    scores.communication * 0.15 +
    scores.values * 0.10
  );

  return scores;
}

// Helper functions
function findAspectsBetweenPlanets(
  planet1: Planet,
  planet2: Planet,
  includeMinorAspects: boolean
): EnhancedAspect[] {
  const aspects: EnhancedAspect[] = [];
  const angleDiff = Math.abs(planet1.longitude - planet2.longitude);
  const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);

  Object.entries(ASPECT_DEFINITIONS).forEach(([name, def]) => {
    if (!includeMinorAspects && def.type === 'minor') return;
    
    const orb = Math.abs(normalizedDiff - def.angle);
    if (orb <= def.orb) {
      const orbFactor = 1 - (orb / def.orb);
      const strength = def.strength * orbFactor;
      
      aspects.push({
        from: planet1.name,
        to: planet2.name,
        aspect: name,
        orb,
        strength,
        type: def.type,
        nature: def.nature,
        exact: orb < 1
      });
    }
  });

  return aspects;
}

function calculateAspectWeight(planet1: Planet, planet2: Planet, aspect: EnhancedAspect): number {
  const weight1 = PLANET_WEIGHTS[planet1.name as keyof typeof PLANET_WEIGHTS] || 0.5;
  const weight2 = PLANET_WEIGHTS[planet2.name as keyof typeof PLANET_WEIGHTS] || 0.5;
  const aspectWeight = ASPECT_DEFINITIONS[aspect.aspect as keyof typeof ASPECT_DEFINITIONS]?.strength || 0.5;
  
  return (weight1 + weight2) * aspectWeight;
}

function getAspectInterpretation(planet1: Planet, planet2: Planet, aspect: EnhancedAspect): string {
  const key = `${planet1.name}-${planet2.name}` as keyof typeof SYNASTRY_INTERPRETATIONS;
  const reverseKey = `${planet2.name}-${planet1.name}` as keyof typeof SYNASTRY_INTERPRETATIONS;
  
  const interpretation = SYNASTRY_INTERPRETATIONS[key] || SYNASTRY_INTERPRETATIONS[reverseKey];
  if (interpretation) {
    return interpretation[aspect.aspect as keyof typeof interpretation] || 'Significant planetary connection';
  }
  
  return 'Meaningful astrological aspect between these planets';
}

function findHouseForPlanet(planet: Planet, houses: number[]): number {
  return findHouseForLongitude(planet.longitude, houses);
}

function findHouseForLongitude(longitude: number, houses: number[]): number {
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    if (nextHouse > currentHouse) {
      if (longitude >= currentHouse && longitude < nextHouse) {
        return i + 1;
      }
    } else {
      if (longitude >= currentHouse || longitude < nextHouse) {
        return i + 1;
      }
    }
  }
  return 1;
}

function getHouseOverlayInterpretation(planet: Planet, houseNumber: number, fromChart: number): string {
  return `${planet.name} from chart ${fromChart} falls in the ${getOrdinalNumber(houseNumber)} house`;
}

function calculateMidpoint(longitude1: number, longitude2: number): number {
  const diff = Math.abs(longitude2 - longitude1);
  if (diff <= 180) {
    return (longitude1 + longitude2) / 2;
  } else {
    return ((longitude1 + longitude2 + 360) / 2) % 360;
  }
}

function categorizeAspectForScoring(aspect: SynastryAspect): keyof CompatibilityScore {
  const planet1 = aspect.person1Planet.name;
  const planet2 = aspect.person2Planet.name;
  
  if (['Sun', 'Moon'].includes(planet1) || ['Sun', 'Moon'].includes(planet2)) {
    return 'emotional';
  } else if (['Mercury'].includes(planet1) || ['Mercury'].includes(planet2)) {
    return 'communication';
  } else if (['Venus', 'Mars'].includes(planet1) || ['Venus', 'Mars'].includes(planet2)) {
    return 'physical';
  } else if (['Jupiter', 'Saturn'].includes(planet1) || ['Jupiter', 'Saturn'].includes(planet2)) {
    return 'values';
  } else if (['Uranus', 'Neptune', 'Pluto'].includes(planet1) || ['Uranus', 'Neptune', 'Pluto'].includes(planet2)) {
    return 'spiritual';
  } else {
    return 'intellectual';
  }
}

function calculateAspectScore(aspect: SynastryAspect): number {
  const baseScore = aspect.strength || 0.5;
  const aspectDef = ASPECT_DEFINITIONS[aspect.aspect as keyof typeof ASPECT_DEFINITIONS];
  
  if (!aspectDef) return 0;
  
  let score = baseScore * aspect.weight * 10;
  
  if (aspectDef.nature === 'harmonious') {
    score *= 1.2;
  } else if (aspectDef.nature === 'challenging') {
    score *= 0.8;
  }
  
  return score;
}

function categorizeHouseOverlayForScoring(overlay: HouseOverlay): keyof CompatibilityScore {
  const house = overlay.houseNumber;
  
  if ([1, 5, 10].includes(house)) return 'emotional';
  if ([3, 9, 11].includes(house)) return 'communication';
  if ([2, 6, 8].includes(house)) return 'values';
  if ([4, 7, 12].includes(house)) return 'spiritual';
  
  return 'intellectual';
}

function calculateHouseOverlayScore(overlay: HouseOverlay): number {
  const planetWeight = PLANET_WEIGHTS[overlay.planet.name as keyof typeof PLANET_WEIGHTS] || 0.5;
  const houseScores = [5, 3, 7, 8, 10, 4, 12, 9, 6, 5, 8, 6]; // Scores for houses 1-12
  
  return (houseScores[overlay.houseNumber - 1] || 5) * planetWeight;
}