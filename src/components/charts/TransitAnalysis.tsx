import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Calendar, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  longitude: number;
  isRetrograde?: boolean;
}

interface Transit {
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

interface TransitAnalysisProps {
  natalPlanets: Planet[];
  currentDate?: Date;
}

// Mock current planetary positions (in a real app, this would come from an ephemeris API)
const getCurrentPlanetaryPositions = (date: Date): Planet[] => {
  // This is simplified mock data - real implementation would calculate actual positions
  return [
    { name: 'Sun', house: 3, sign: 'Gemini', degree: 15.5, longitude: 75.5, isRetrograde: false },
    { name: 'Moon', house: 7, sign: 'Libra', degree: 22.3, longitude: 202.3, isRetrograde: false },
    { name: 'Mars', house: 5, sign: 'Leo', degree: 8.7, longitude: 128.7, isRetrograde: false },
    { name: 'Mercury', house: 4, sign: 'Cancer', degree: 28.1, longitude: 118.1, isRetrograde: true },
    { name: 'Jupiter', house: 2, sign: 'Taurus', degree: 12.9, longitude: 42.9, isRetrograde: false },
    { name: 'Venus', house: 6, sign: 'Virgo', degree: 19.4, longitude: 169.4, isRetrograde: false },
    { name: 'Saturn', house: 11, sign: 'Aquarius', degree: 25.8, longitude: 325.8, isRetrograde: true },
    { name: 'Rahu', house: 1, sign: 'Aries', degree: 14.2, longitude: 14.2, isRetrograde: true },
    { name: 'Ketu', house: 7, sign: 'Libra', degree: 14.2, longitude: 194.2, isRetrograde: true }
  ];
};

// Calculate aspects between planets
const calculateAspect = (planet1Longitude: number, planet2Longitude: number): string => {
  let diff = Math.abs(planet1Longitude - planet2Longitude);
  if (diff > 180) diff = 360 - diff;
  
  if (diff <= 8) return 'Conjunction';
  if (diff >= 52 && diff <= 68) return 'Sextile';
  if (diff >= 82 && diff <= 98) return 'Square';
  if (diff >= 112 && diff <= 128) return 'Trine';
  if (diff >= 172 && diff <= 188) return 'Opposition';
  
  return 'None';
};

// Get aspect intensity
const getAspectIntensity = (aspect: string): 'low' | 'medium' | 'high' => {
  switch (aspect) {
    case 'Conjunction':
    case 'Opposition':
      return 'high';
    case 'Square':
      return 'high';
    case 'Trine':
    case 'Sextile':
      return 'medium';
    default:
      return 'low';
  }
};

// Get aspect effect
const getAspectEffect = (aspect: string, transitPlanet: string, natalPlanet: string): 'positive' | 'negative' | 'neutral' => {
  // Simplified logic - real implementation would be more complex
  const benefics = ['Jupiter', 'Venus', 'Moon'];
  const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
  
  if (aspect === 'Trine' || aspect === 'Sextile') {
    return 'positive';
  } else if (aspect === 'Square' || aspect === 'Opposition') {
    if (malefics.includes(transitPlanet)) return 'negative';
    if (benefics.includes(transitPlanet)) return 'neutral';
  } else if (aspect === 'Conjunction') {
    if (benefics.includes(transitPlanet)) return 'positive';
    if (malefics.includes(transitPlanet)) return 'negative';
  }
  
  return 'neutral';
};

const TransitAnalysis: React.FC<TransitAnalysisProps> = ({ 
  natalPlanets, 
  currentDate = new Date() 
}) => {
  const [currentPlanets, setCurrentPlanets] = useState<Planet[]>([]);
  const [transits, setTransits] = useState<Transit[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [selectedPlanet, setSelectedPlanet] = useState('all');

  // Calculate transits
  const calculateTransits = () => {
    const currentPositions = getCurrentPlanetaryPositions(currentDate);
    setCurrentPlanets(currentPositions);
    
    const calculatedTransits: Transit[] = [];
    
    currentPositions.forEach(transitPlanet => {
      natalPlanets.forEach(natalPlanet => {
        const aspect = calculateAspect(transitPlanet.longitude, natalPlanet.longitude);
        
        if (aspect !== 'None') {
          const intensity = getAspectIntensity(aspect);
          const effect = getAspectEffect(aspect, transitPlanet.name, natalPlanet.name);
          
          calculatedTransits.push({
            planet: transitPlanet.name,
            currentSign: transitPlanet.sign || '',
            currentHouse: transitPlanet.house,
            natalSign: natalPlanet.sign || '',
            natalHouse: natalPlanet.house,
            aspect,
            intensity,
            effect,
            startDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Mock: 7 days ago
            endDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000), // Mock: 14 days from now
            description: `${transitPlanet.name} in ${transitPlanet.sign} ${aspect} natal ${natalPlanet.name} in ${natalPlanet.sign}`
          });
        }
      });
    });
    
    setTransits(calculatedTransits);
  };

  useEffect(() => {
    calculateTransits();
  }, [natalPlanets, currentDate]);

  // Filter transits based on selected criteria
  const filteredTransits = transits.filter(transit => {
    if (selectedPlanet !== 'all' && transit.planet !== selectedPlanet) {
      return false;
    }
    return true;
  });

  // Get planet color
  const getPlanetColor = (planet: string) => {
    const colors: { [key: string]: string } = {
      'Sun': 'bg-orange-500',
      'Moon': 'bg-blue-500',
      'Mars': 'bg-red-500',
      'Mercury': 'bg-green-500',
      'Jupiter': 'bg-yellow-500',
      'Venus': 'bg-pink-500',
      'Saturn': 'bg-purple-500',
      'Rahu': 'bg-gray-700',
      'Ketu': 'bg-gray-500'
    };
    return colors[planet] || 'bg-gray-400';
  };

  // Get effect color
  const getEffectColor = (effect: string) => {
    switch (effect) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  // Get intensity badge variant
  const getIntensityVariant = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Transit Analysis
          </CardTitle>
          <CardDescription>
            Current planetary movements and their effects on your natal chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={selectedPlanet} onValueChange={setSelectedPlanet}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Planet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Planets</SelectItem>
                {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map(planet => (
                  <SelectItem key={planet} value={planet}>{planet}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Planetary Positions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Analysis Date</div>
              <div className="text-lg font-bold">{formatDate(currentDate)}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Active Transits</div>
              <div className="text-lg font-bold">{filteredTransits.length}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">High Intensity</div>
              <div className="text-lg font-bold">
                {filteredTransits.filter(t => t.intensity === 'high').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Planetary Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Planetary Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlanets.map((planet) => (
              <div key={planet.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPlanetColor(planet.name)}`} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {planet.name}
                      {planet.isRetrograde && (
                        <Badge variant="outline" className="text-xs">R</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {planet.sign} {planet.degree?.toFixed(1)}°
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">House {planet.house}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Transits */}
      <Card>
        <CardHeader>
          <CardTitle>Active Transits</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="aspects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aspects">Aspects</TabsTrigger>
              <TabsTrigger value="houses">House Transits</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="aspects" className="space-y-4">
              <div className="space-y-3">
                {filteredTransits.map((transit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPlanetColor(transit.planet)}`} />
                        <div>
                          <div className="font-medium">{transit.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(transit.startDate)} - {formatDate(transit.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getIntensityVariant(transit.intensity)}>
                          {transit.intensity}
                        </Badge>
                        <Badge className={getEffectColor(transit.effect)}>
                          {transit.effect}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Transit:</span>
                        <span>{transit.currentSign} (House {transit.currentHouse})</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Natal:</span>
                        <span>{transit.natalSign} (House {transit.natalHouse})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="houses" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(house => {
                  const houseTransits = currentPlanets.filter(p => p.house === house);
                  return (
                    <div key={house} className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">House {house}</div>
                      <div className="space-y-2">
                        {houseTransits.length > 0 ? (
                          houseTransits.map(planet => (
                            <div key={planet.name} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getPlanetColor(planet.name)}`} />
                              <span className="text-sm">{planet.name}</span>
                              {planet.isRetrograde && (
                                <Badge variant="outline" className="text-xs">R</Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Empty</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                {filteredTransits
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .map((transit, index) => {
                    const progress = Math.min(100, Math.max(0, 
                      ((currentDate.getTime() - transit.startDate.getTime()) / 
                       (transit.endDate.getTime() - transit.startDate.getTime())) * 100
                    ));
                    
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPlanetColor(transit.planet)}`} />
                            <span className="font-medium">{transit.planet} {transit.aspect}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(progress)}% complete
                          </span>
                        </div>
                        <Progress value={progress} className="h-2 mb-2" />
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transit.startDate)} - {formatDate(transit.endDate)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transit Effects & Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Transit Effects & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="positive" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="challenging">Challenging</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
            </TabsList>
            
            <TabsContent value="positive" className="space-y-4">
              <div className="space-y-3">
                {filteredTransits.filter(t => t.effect === 'positive').map((transit, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">{transit.description}</div>
                        <div className="text-sm text-green-600 mt-1">
                          This transit brings opportunities for growth and positive developments in areas related to {transit.planet}.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="challenging" className="space-y-4">
              <div className="space-y-3">
                {filteredTransits.filter(t => t.effect === 'negative').map((transit, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-800">{transit.description}</div>
                        <div className="text-sm text-red-600 mt-1">
                          This transit may bring challenges that require patience and careful handling. Focus on learning and growth.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="neutral" className="space-y-4">
              <div className="space-y-3">
                {filteredTransits.filter(t => t.effect === 'neutral').map((transit, index) => (
                  <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-800">{transit.description}</div>
                        <div className="text-sm text-yellow-600 mt-1">
                          This transit brings mixed influences. The outcome depends on your actions and other planetary factors.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransitAnalysis;