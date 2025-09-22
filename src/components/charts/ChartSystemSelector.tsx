import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, Square, Diamond } from "lucide-react";

export type ChartSystem = 'north' | 'south' | 'east';

interface ChartSystemSelectorProps {
  value: ChartSystem;
  onChange: (system: ChartSystem) => void;
}

const ChartSystemSelector: React.FC<ChartSystemSelectorProps> = ({ value, onChange }) => {
  const chartSystems = [
    {
      value: 'north' as ChartSystem,
      label: 'North Indian',
      description: 'Diamond-shaped chart with fixed house positions',
      icon: <Diamond className="w-4 h-4" />
    },
    {
      value: 'south' as ChartSystem,
      label: 'South Indian',
      description: 'Square grid with numbered houses',
      icon: <Grid3X3 className="w-4 h-4" />
    },
    {
      value: 'east' as ChartSystem,
      label: 'East Indian',
      description: 'Rectangular format with house sequence',
      icon: <Square className="w-4 h-4" />
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-primary" />
          Chart System
        </CardTitle>
        <CardDescription>
          Choose your preferred Vedic chart display format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chart-system">Chart Format</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id="chart-system">
              <SelectValue placeholder="Select chart system" />
            </SelectTrigger>
            <SelectContent>
              {chartSystems.map((system) => (
                <SelectItem key={system.value} value={system.value}>
                  <div className="flex items-center gap-2">
                    {system.icon}
                    <div>
                      <div className="font-medium">{system.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {system.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="text-center p-2 border rounded">
            <Diamond className="w-6 h-6 mx-auto mb-1" />
            <div>North</div>
          </div>
          <div className="text-center p-2 border rounded">
            <Grid3X3 className="w-6 h-6 mx-auto mb-1" />
            <div>South</div>
          </div>
          <div className="text-center p-2 border rounded">
            <Square className="w-6 h-6 mx-auto mb-1" />
            <div>East</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSystemSelector;