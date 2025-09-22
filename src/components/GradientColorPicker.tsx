import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GradientColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const GradientColorPicker: React.FC<GradientColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [direction, setDirection] = useState("135deg");
  const [startColor, setStartColor] = useState("#000000");
  const [endColor, setEndColor] = useState("#ffffff");
  const [startPosition, setStartPosition] = useState([0]);
  const [endPosition, setEndPosition] = useState([100]);

  // Parse existing gradient value if provided
  React.useEffect(() => {
    if (value && value.includes("linear-gradient")) {
      const match = value.match(/linear-gradient\(([^,]+),\s*([^)]+)\s+(\d+)%,\s*([^)]+)\s+(\d+)%\)/);
      if (match) {
        setDirection(match[1].trim());
        setStartColor(match[2].trim());
        setStartPosition([parseInt(match[3])]);
        setEndColor(match[4].trim());
        setEndPosition([parseInt(match[5])]);
      }
    }
  }, [value]);

  const updateGradient = () => {
    const gradient = `linear-gradient(${direction}, ${startColor} ${startPosition[0]}%, ${endColor} ${endPosition[0]}%)`;
    onChange(gradient);
  };

  React.useEffect(() => {
    updateGradient();
  }, [direction, startColor, endColor, startPosition, endPosition]);

  const presetDirections = [
    { value: "0deg", label: "Top to Bottom" },
    { value: "90deg", label: "Left to Right" },
    { value: "135deg", label: "Diagonal ↘" },
    { value: "180deg", label: "Bottom to Top" },
    { value: "270deg", label: "Right to Left" },
    { value: "45deg", label: "Diagonal ↗" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gradient Preview */}
        <div
          className="w-full h-16 rounded-md border"
          style={{
            background: `linear-gradient(${direction}, ${startColor} ${startPosition[0]}%, ${endColor} ${endPosition[0]}%)`,
          }}
        />

        {/* Direction Selector */}
        <div className="space-y-2">
          <Label className="text-xs">Direction</Label>
          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presetDirections.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Color */}
        <div className="space-y-2">
          <Label className="text-xs">Start Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={startColor}
              onChange={(e) => setStartColor(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
            />
            <Input
              type="text"
              value={startColor}
              onChange={(e) => setStartColor(e.target.value)}
              className="flex-1 h-8 text-xs"
              placeholder="#000000"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Position: {startPosition[0]}%</Label>
            <Slider
              value={startPosition}
              onValueChange={setStartPosition}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* End Color */}
        <div className="space-y-2">
          <Label className="text-xs">End Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={endColor}
              onChange={(e) => setEndColor(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
            />
            <Input
              type="text"
              value={endColor}
              onChange={(e) => setEndColor(e.target.value)}
              className="flex-1 h-8 text-xs"
              placeholder="#ffffff"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Position: {endPosition[0]}%</Label>
            <Slider
              value={endPosition}
              onValueChange={setEndPosition}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Custom Direction Input */}
        <div className="space-y-2">
          <Label className="text-xs">Custom Direction</Label>
          <Input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="h-8 text-xs"
            placeholder="135deg"
          />
        </div>
      </CardContent>
    </Card>
  );
};