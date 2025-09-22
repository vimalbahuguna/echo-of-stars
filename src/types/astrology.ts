// Core astrology types used throughout the application

export interface Planet {
  name: string;
  longitude: number;
  latitude?: number;
  speed?: number;
  sign?: string;
  degrees?: number;
  house: number;
  isRetrograde?: boolean;
  // Enhanced properties for Vedic astrology
  siderealLongitude?: number;
  nakshatra?: NakshatraInfo;
  strength?: PlanetaryStrength;
  dignity?: string;
}

export interface NakshatraInfo {
  nakshatra: string;
  lord: string;
  pada: number;
  degrees: number;
  deity: string;
  nature: string;
  guna: string;
}

export interface PlanetaryStrength {
  positional: number;
  temporal: number;
  directional: number;
  motional: number;
  natural: number;
  aspectual: number;
  total: number;
}

export interface ZodiacSign {
  name: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  exaltation: string;
}

export interface Aspect {
  from: string;
  to: string;
  aspect: string;
  orb: number;
  strength?: number;
}

export interface House {
  number: number;
  cusp: number;
  sign: string;
  planets: string[];
}

export interface ChartData {
  planets: Planet[];
  houses: House[] | number[];
  aspects: Aspect[];
  ascendant: number;
  midheaven: number;
  system: 'western' | 'vedic';
}

export type ChartSystem = 'north' | 'south' | 'east';

export interface DivisionalChart {
  id: string;
  name: string;
  description: string;
  division: number;
  significance: string;
}

export interface Transit {
  planet: string;
  currentSign: string;
  currentHouse: number;
  natalSign: string;
  natalHouse: number;
  aspect: string;
  intensity: 'low' | 'medium' | 'high';
  effect: 'positive' | 'negative' | 'neutral';
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in years
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaPeriod[];
}

export interface Remedy {
  id: string;
  type: 'gemstone' | 'mantra' | 'charity' | 'ritual' | 'lifestyle' | 'yantra';
  planet: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  cost: 'low' | 'medium' | 'high';
  effectiveness: number; // 1-10
  isCompleted?: boolean;
}

// Ayanamsa systems for Vedic astrology
export type AyanamsaSystem = 'lahiri' | 'raman' | 'krishnamurti';

// House systems
export type HouseSystem = 'placidus' | 'koch' | 'equal' | 'whole_sign' | 'campanus';

// Calculation preferences
export interface CalculationSettings {
  ayanamsa: AyanamsaSystem;
  houseSystem: HouseSystem;
  includeUranus: boolean;
  includeNeptune: boolean;
  includePluto: boolean;
  includeChiron: boolean;
}