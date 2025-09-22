import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Star, TrendingUp, Heart, Briefcase, Home, Users, Zap } from "lucide-react";
import NorthIndianChart from './NorthIndianChart';
import SouthIndianChart from './SouthIndianChart';
import EastIndianChart from './EastIndianChart';
import { ChartSystem } from './ChartSystemSelector';

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  longitude: number;
  isRetrograde?: boolean;
}

interface DivisionalChartsProps {
  planets: Planet[];
  chartSystem: ChartSystem;
  onChartSystemChange: (system: ChartSystem) => void;
}

// Divisional chart definitions
const divisionalCharts = [
  { 
    id: 'D1', 
    name: 'Rashi (D1)', 
    description: 'Main birth chart - overall personality and life',
    division: 1,
    icon: <Star className="w-4 h-4" />,
    significance: 'General life, personality, physical body'
  },
  { 
    id: 'D2', 
    name: 'Hora (D2)', 
    description: 'Wealth and financial matters',
    division: 2,
    icon: <TrendingUp className="w-4 h-4" />,
    significance: 'Wealth, money, financial prosperity'
  },
  { 
    id: 'D3', 
    name: 'Drekkana (D3)', 
    description: 'Siblings, courage, and short journeys',
    division: 3,
    icon: <Users className="w-4 h-4" />,
    significance: 'Siblings, courage, communication, short travels'
  },
  { 
    id: 'D4', 
    name: 'Chaturthamsa (D4)', 
    description: 'Property, real estate, and fortune',
    division: 4,
    icon: <Home className="w-4 h-4" />,
    significance: 'Property, real estate, vehicles, general fortune'
  },
  { 
    id: 'D7', 
    name: 'Saptamsa (D7)', 
    description: 'Children and progeny',
    division: 7,
    icon: <Heart className="w-4 h-4" />,
    significance: 'Children, creativity, progeny, grandchildren'
  },
  { 
    id: 'D9', 
    name: 'Navamsa (D9)', 
    description: 'Marriage, dharma, and spiritual strength',
    division: 9,
    icon: <Zap className="w-4 h-4" />,
    significance: 'Marriage, spouse, dharma, spiritual strength'
  },
  { 
    id: 'D10', 
    name: 'Dasamsa (D10)', 
    description: 'Career, profession, and reputation',
    division: 10,
    icon: <Briefcase className="w-4 h-4" />,
    significance: 'Career, profession, reputation, status'
  },
  { 
    id: 'D12', 
    name: 'Dvadasamsa (D12)', 
    description: 'Parents and ancestry',
    division: 12,
    icon: <Users className="w-4 h-4" />,
    significance: 'Parents, ancestry, past life karma'
  }
];

const DivisionalCharts: React.FC<DivisionalChartsProps> = ({ 
  planets, 
  chartSystem, 
  onChartSystemChange 
}) => {
  const [selectedChart, setSelectedChart] = useState('D1');

  // Calculate divisional chart positions
  const calculateDivisionalPositions = (division: number): Planet[] => {
    return planets.map(planet => {
      // Simplified divisional calculation
      // In a real implementation, this would use proper Vedic calculations
      const adjustedLongitude = (planet.longitude * division) % 360;
      const newHouse = Math.floor(adjustedLongitude / 30) + 1;
      
      return {
        ...planet,
        house: newHouse,
        longitude: adjustedLongitude
      };
    });
  };

  const renderChart = (chartPlanets: Planet[]) => {
    switch (chartSystem) {
      case 'north':
        return <NorthIndianChart planets={chartPlanets} />;
      case 'south':
        return <SouthIndianChart planets={chartPlanets} />;
      case 'east':
        return <EastIndianChart planets={chartPlanets} />;
      default:
        return <SouthIndianChart planets={chartPlanets} />;
    }
  };

  const selectedChartData = divisionalCharts.find(chart => chart.id === selectedChart);
  const divisionalPlanets = selectedChart === 'D1' 
    ? planets 
    : calculateDivisionalPositions(selectedChartData?.division || 1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" />
            Divisional Charts (Vargas)
          </CardTitle>
          <CardDescription>
            Explore different aspects of life through specialized divisional charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart Selection */}
            <div className="flex flex-wrap gap-2">
              {divisionalCharts.map((chart) => (
                <Button
                  key={chart.id}
                  variant={selectedChart === chart.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChart(chart.id)}
                  className="flex items-center gap-2"
                >
                  {chart.icon}
                  {chart.id}
                </Button>
              ))}
            </div>

            {/* Selected Chart Info */}
            {selectedChartData && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {selectedChartData.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedChartData.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedChartData.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {selectedChartData.significance}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedChartData?.icon}
              {selectedChartData?.name}
            </CardTitle>
            <Select value={chartSystem} onValueChange={onChartSystemChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North Indian</SelectItem>
                <SelectItem value="south">South Indian</SelectItem>
                <SelectItem value="east">East Indian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {renderChart(divisionalPlanets)}
          </div>
        </CardContent>
      </Card>

      {/* Planetary Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Planetary Positions in {selectedChartData?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisionalPlanets.map((planet) => (
              <div key={planet.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{planet.name}</span>
                  {planet.isRetrograde && (
                    <Badge variant="outline" className="text-xs">R</Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">House {planet.house}</div>
                  {planet.sign && (
                    <div className="text-xs text-muted-foreground">{planet.sign}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="remedies">Remedies</TabsTrigger>
            </TabsList>
            <TabsContent value="strengths" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Based on the {selectedChartData?.name}, here are the key strengths:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Strong planetary placements in beneficial houses</li>
                  <li>Favorable aspects supporting the chart's theme</li>
                  <li>Natural talents and abilities highlighted</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="challenges" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Areas that may require attention in {selectedChartData?.name}:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Challenging planetary positions</li>
                  <li>Difficult aspects that need balancing</li>
                  <li>Karmic lessons to be learned</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="remedies" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Suggested remedial measures for {selectedChartData?.name}:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Specific mantras and prayers</li>
                  <li>Gemstone recommendations</li>
                  <li>Charitable activities and donations</li>
                  <li>Lifestyle adjustments</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DivisionalCharts;