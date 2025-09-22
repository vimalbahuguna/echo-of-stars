import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Star, TrendingUp, AlertCircle, Info } from "lucide-react";

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  longitude: number;
  isRetrograde?: boolean;
}

interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in years
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaPeriod[];
}

interface DashaSystemProps {
  planets: Planet[];
  birthDate: Date;
  moonLongitude: number;
}

// Vimshottari Dasha periods (in years)
const vimshottariPeriods = {
  'Sun': 6,
  'Moon': 10,
  'Mars': 7,
  'Rahu': 18,
  'Jupiter': 16,
  'Saturn': 19,
  'Mercury': 17,
  'Ketu': 7,
  'Venus': 20
};

// Nakshatra data for Dasha calculation
const nakshatras = [
  { name: 'Ashwini', lord: 'Ketu', startDegree: 0 },
  { name: 'Bharani', lord: 'Venus', startDegree: 13.33 },
  { name: 'Krittika', lord: 'Sun', startDegree: 26.67 },
  { name: 'Rohini', lord: 'Moon', startDegree: 40 },
  { name: 'Mrigashira', lord: 'Mars', startDegree: 53.33 },
  { name: 'Ardra', lord: 'Rahu', startDegree: 66.67 },
  { name: 'Punarvasu', lord: 'Jupiter', startDegree: 80 },
  { name: 'Pushya', lord: 'Saturn', startDegree: 93.33 },
  { name: 'Ashlesha', lord: 'Mercury', startDegree: 106.67 },
  { name: 'Magha', lord: 'Ketu', startDegree: 120 },
  { name: 'Purva Phalguni', lord: 'Venus', startDegree: 133.33 },
  { name: 'Uttara Phalguni', lord: 'Sun', startDegree: 146.67 },
  { name: 'Hasta', lord: 'Moon', startDegree: 160 },
  { name: 'Chitra', lord: 'Mars', startDegree: 173.33 },
  { name: 'Swati', lord: 'Rahu', startDegree: 186.67 },
  { name: 'Vishakha', lord: 'Jupiter', startDegree: 200 },
  { name: 'Anuradha', lord: 'Saturn', startDegree: 213.33 },
  { name: 'Jyeshtha', lord: 'Mercury', startDegree: 226.67 },
  { name: 'Mula', lord: 'Ketu', startDegree: 240 },
  { name: 'Purva Ashadha', lord: 'Venus', startDegree: 253.33 },
  { name: 'Uttara Ashadha', lord: 'Sun', startDegree: 266.67 },
  { name: 'Shravana', lord: 'Moon', startDegree: 280 },
  { name: 'Dhanishta', lord: 'Mars', startDegree: 293.33 },
  { name: 'Shatabhisha', lord: 'Rahu', startDegree: 306.67 },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', startDegree: 320 },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', startDegree: 333.33 },
  { name: 'Revati', lord: 'Mercury', startDegree: 346.67 }
];

const DashaSystem: React.FC<DashaSystemProps> = ({ planets, birthDate, moonLongitude }) => {
  const [selectedDashaType, setSelectedDashaType] = useState('vimshottari');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dashaPeriods, setDashaPeriods] = useState<DashaPeriod[]>([]);
  const [currentDasha, setCurrentDasha] = useState<DashaPeriod | null>(null);

  // Calculate birth nakshatra and dasha lord
  const calculateBirthNakshatra = () => {
    const nakshatraIndex = Math.floor(moonLongitude / 13.33);
    return nakshatras[nakshatraIndex] || nakshatras[0];
  };

  // Calculate Vimshottari Dasha periods
  const calculateVimshottariDasha = () => {
    const birthNakshatra = calculateBirthNakshatra();
    const dashaLord = birthNakshatra.lord;
    
    // Calculate remaining period of birth nakshatra
    const nakshatraProgress = (moonLongitude % 13.33) / 13.33;
    const remainingPeriod = vimshottariPeriods[dashaLord as keyof typeof vimshottariPeriods] * (1 - nakshatraProgress);
    
    const periods: DashaPeriod[] = [];
    let currentStartDate = new Date(birthDate);
    
    // Get the sequence starting from birth dasha lord
    const planetSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const startIndex = planetSequence.indexOf(dashaLord);
    const orderedSequence = [...planetSequence.slice(startIndex), ...planetSequence.slice(0, startIndex)];
    
    // First period (remaining from birth)
    const firstEndDate = new Date(currentStartDate);
    firstEndDate.setFullYear(firstEndDate.getFullYear() + Math.floor(remainingPeriod));
    firstEndDate.setMonth(firstEndDate.getMonth() + Math.round((remainingPeriod % 1) * 12));
    
    periods.push({
      planet: dashaLord,
      startDate: new Date(currentStartDate),
      endDate: firstEndDate,
      duration: remainingPeriod,
      level: 'maha'
    });
    
    currentStartDate = new Date(firstEndDate);
    
    // Subsequent periods
    for (let i = 1; i < orderedSequence.length; i++) {
      const planet = orderedSequence[i];
      const duration = vimshottariPeriods[planet as keyof typeof vimshottariPeriods];
      const endDate = new Date(currentStartDate);
      endDate.setFullYear(endDate.getFullYear() + duration);
      
      periods.push({
        planet,
        startDate: new Date(currentStartDate),
        endDate,
        duration,
        level: 'maha'
      });
      
      currentStartDate = new Date(endDate);
    }
    
    return periods;
  };

  // Calculate Antardasha periods for a given Mahadasha
  const calculateAntardasha = (mahadasha: DashaPeriod): DashaPeriod[] => {
    const planetSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const startIndex = planetSequence.indexOf(mahadasha.planet);
    const orderedSequence = [...planetSequence.slice(startIndex), ...planetSequence.slice(0, startIndex)];
    
    const antardashas: DashaPeriod[] = [];
    let currentStartDate = new Date(mahadasha.startDate);
    const totalDuration = mahadasha.duration;
    
    // Calculate total proportional units
    const totalUnits = orderedSequence.reduce((sum, planet) => 
      sum + vimshottariPeriods[planet as keyof typeof vimshottariPeriods], 0
    );
    
    orderedSequence.forEach(planet => {
      const planetPeriod = vimshottariPeriods[planet as keyof typeof vimshottariPeriods];
      const antardashaYears = (planetPeriod / totalUnits) * totalDuration;
      
      const endDate = new Date(currentStartDate);
      endDate.setFullYear(endDate.getFullYear() + Math.floor(antardashaYears));
      endDate.setMonth(endDate.getMonth() + Math.round((antardashaYears % 1) * 12));
      
      antardashas.push({
        planet,
        startDate: new Date(currentStartDate),
        endDate,
        duration: antardashaYears,
        level: 'antar'
      });
      
      currentStartDate = new Date(endDate);
    });
    
    return antardashas;
  };

  // Find current running dasha
  const findCurrentDasha = (periods: DashaPeriod[]) => {
    return periods.find(period => 
      currentDate >= period.startDate && currentDate <= period.endDate
    ) || null;
  };

  // Calculate progress percentage
  const calculateProgress = (period: DashaPeriod) => {
    const total = period.endDate.getTime() - period.startDate.getTime();
    const elapsed = currentDate.getTime() - period.startDate.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  useEffect(() => {
    const periods = calculateVimshottariDasha();
    setDashaPeriods(periods);
    setCurrentDasha(findCurrentDasha(periods));
  }, [moonLongitude, birthDate, currentDate]);

  const birthNakshatra = calculateBirthNakshatra();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Dasha System & Predictions
          </CardTitle>
          <CardDescription>
            Vedic timing system for life events and planetary periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Birth Nakshatra</div>
              <div className="text-lg font-bold">{birthNakshatra.name}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Dasha Lord</div>
              <div className="text-lg font-bold">{birthNakshatra.lord}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">System</div>
              <div className="text-lg font-bold">Vimshottari</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Dasha */}
      {currentDasha && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getPlanetColor(currentDasha.planet)}`} />
              Current Mahadasha: {currentDasha.planet}
            </CardTitle>
            <CardDescription>
              {formatDate(currentDasha.startDate)} - {formatDate(currentDasha.endDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress(currentDasha))}%</span>
                </div>
                <Progress value={calculateProgress(currentDasha)} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentDasha.duration.toFixed(1)} years
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Remaining</h4>
                  <p className="text-sm text-muted-foreground">
                    {((currentDasha.endDate.getTime() - currentDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)} years
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dasha Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Mahadasha Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-3">
                {dashaPeriods.slice(0, 10).map((period, index) => {
                  const isCurrent = currentDasha?.planet === period.planet && 
                                   currentDate >= period.startDate && 
                                   currentDate <= period.endDate;
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${isCurrent ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPlanetColor(period.planet)}`} />
                          <div>
                            <div className="font-medium">{period.planet} Mahadasha</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(period.startDate)} - {formatDate(period.endDate)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={isCurrent ? "default" : "secondary"}>
                            {period.duration.toFixed(1)} years
                          </Badge>
                          {isCurrent && (
                            <div className="text-xs text-primary mt-1">Current</div>
                          )}
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="mt-3">
                          <Progress value={calculateProgress(period)} className="h-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Planet</th>
                      <th className="text-left p-2">Start Date</th>
                      <th className="text-left p-2">End Date</th>
                      <th className="text-left p-2">Duration</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashaPeriods.slice(0, 10).map((period, index) => {
                      const isCurrent = currentDasha?.planet === period.planet;
                      return (
                        <tr key={index} className={`border-b ${isCurrent ? 'bg-primary/5' : ''}`}>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getPlanetColor(period.planet)}`} />
                              {period.planet}
                            </div>
                          </td>
                          <td className="p-2 text-sm">{formatDate(period.startDate)}</td>
                          <td className="p-2 text-sm">{formatDate(period.endDate)}</td>
                          <td className="p-2 text-sm">{period.duration.toFixed(1)} years</td>
                          <td className="p-2">
                            {isCurrent ? (
                              <Badge variant="default">Current</Badge>
                            ) : period.endDate < currentDate ? (
                              <Badge variant="secondary">Past</Badge>
                            ) : (
                              <Badge variant="outline">Future</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Antardasha */}
      {currentDasha && (
        <Card>
          <CardHeader>
            <CardTitle>Current Antardasha Periods</CardTitle>
            <CardDescription>
              Sub-periods within {currentDasha.planet} Mahadasha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculateAntardasha(currentDasha).map((antardasha, index) => {
                const isCurrent = currentDate >= antardasha.startDate && currentDate <= antardasha.endDate;
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${isCurrent ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPlanetColor(antardasha.planet)}`} />
                        <span className="text-sm font-medium">
                          {currentDasha.planet} - {antardasha.planet}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(antardasha.startDate)} - {formatDate(antardasha.endDate)}
                        </div>
                        {isCurrent && (
                          <Badge variant="default" className="text-xs mt-1">Current</Badge>
                        )}
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="mt-2">
                        <Progress value={calculateProgress(antardasha)} className="h-1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Dasha Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Period</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4">
              {currentDasha && (
                <div className="space-y-3">
                  <h4 className="font-medium">{currentDasha.planet} Mahadasha Effects</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• This period emphasizes the qualities and significations of {currentDasha.planet}</p>
                    <p>• Focus on areas ruled by {currentDasha.planet} in your birth chart</p>
                    <p>• Karmic lessons related to {currentDasha.planet} will manifest</p>
                    <p>• Results depend on {currentDasha.planet}'s strength and placement</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Next Major Transitions</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Prepare for upcoming planetary period changes</p>
                  <p>• Major life themes will shift with new Mahadasha</p>
                  <p>• Plan important decisions around favorable periods</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Understanding Dasha Effects</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Mahadasha sets the overall theme for the period</p>
                  <p>• Antardasha modifies and specifies the results</p>
                  <p>• Planetary strength and placement determine intensity</p>
                  <p>• Transits activate dasha results at specific times</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashaSystem;