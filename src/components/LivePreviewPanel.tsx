import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Theme } from "@/types/theme";

interface LivePreviewPanelProps {
  theme: Theme;
  className?: string;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  theme,
  className = "",
}) => {
  // Create a preview style object from the theme
  const previewStyle = React.useMemo(() => {
    const style: React.CSSProperties = {};
    
    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--preview-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      const hslValues = value.replace(/hsl\(|\)/g, '');
      style[cssVar as any] = hslValues;
    });

    // Apply gradient variables if they exist
    if (theme.gradients) {
      Object.entries(theme.gradients).forEach(([key, value]) => {
        const cssVar = `--preview-gradient-${key.replace(/([A-Z])/g, '-$1').toLowerCase().replace('gradient', '')}`;
        style[cssVar as any] = value;
      });
    }

    return style;
  }, [theme]);

  return (
    <Card className={`w-full ${className}`} style={previewStyle}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Background</h4>
          <div className="grid grid-cols-2 gap-2">
            <div
              className="h-12 rounded border"
              style={{ backgroundColor: `hsl(${theme.colors.background})` }}
              title="Solid Background"
            />
            {theme.gradients?.backgroundGradient && (
              <div
                className="h-12 rounded border"
                style={{ background: theme.gradients.backgroundGradient }}
                title="Gradient Background"
              />
            )}
          </div>
        </div>

        {/* Card Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Card Elements</h4>
          <div
            className="p-3 rounded border"
            style={{ 
              backgroundColor: `hsl(${theme.colors.card})`,
              color: `hsl(${theme.colors.cardForeground})`,
              borderColor: `hsl(${theme.colors.border})`
            }}
          >
            <div className="text-xs font-medium mb-2">Sample Card</div>
            <div className="text-xs opacity-70">This is how cards will look with your theme</div>
          </div>
          {theme.gradients?.cardGradient && (
            <div
              className="p-3 rounded border"
              style={{ 
                background: theme.gradients.cardGradient,
                color: `hsl(${theme.colors.cardForeground})`,
                borderColor: `hsl(${theme.colors.border})`
              }}
            >
              <div className="text-xs font-medium mb-2">Gradient Card</div>
              <div className="text-xs opacity-70">This is how gradient cards will look</div>
            </div>
          )}
        </div>

        {/* Button Previews */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Buttons</h4>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 py-1 text-xs rounded"
              style={{
                backgroundColor: `hsl(${theme.colors.primary})`,
                color: `hsl(${theme.colors.primaryForeground})`,
              }}
            >
              Primary
            </button>
            <button
              className="px-3 py-1 text-xs rounded"
              style={{
                backgroundColor: `hsl(${theme.colors.secondary})`,
                color: `hsl(${theme.colors.secondaryForeground})`,
              }}
            >
              Secondary
            </button>
            <button
              className="px-3 py-1 text-xs rounded"
              style={{
                backgroundColor: `hsl(${theme.colors.accent})`,
                color: `hsl(${theme.colors.accentForeground})`,
              }}
            >
              Accent
            </button>
          </div>
          {/* Gradient Buttons */}
          {theme.gradients && (
            <div className="flex gap-2 flex-wrap">
              {theme.gradients.primaryGradient && (
                <button
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    background: theme.gradients.primaryGradient,
                    color: `hsl(${theme.colors.primaryForeground})`,
                  }}
                >
                  Primary Gradient
                </button>
              )}
              {theme.gradients.secondaryGradient && (
                <button
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    background: theme.gradients.secondaryGradient,
                    color: `hsl(${theme.colors.secondaryForeground})`,
                  }}
                >
                  Secondary Gradient
                </button>
              )}
            </div>
          )}
        </div>

        {/* Input Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Form Elements</h4>
          <input
            type="text"
            placeholder="Sample input"
            className="w-full px-2 py-1 text-xs rounded border"
            style={{
              backgroundColor: `hsl(${theme.colors.input})`,
              borderColor: `hsl(${theme.colors.border})`,
              color: `hsl(${theme.colors.foreground})`,
            }}
          />
        </div>

        {/* Badge Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Badges</h4>
          <div className="flex gap-2 flex-wrap">
            <span
              className="px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: `hsl(${theme.colors.muted})`,
                color: `hsl(${theme.colors.mutedForeground})`,
              }}
            >
              Muted
            </span>
            <span
              className="px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: `hsl(${theme.colors.destructive})`,
                color: `hsl(${theme.colors.destructiveForeground})`,
              }}
            >
              Destructive
            </span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Color Palette</h4>
          <div className="grid grid-cols-4 gap-1">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div
                key={key}
                className="h-8 rounded border flex items-center justify-center"
                style={{ backgroundColor: `hsl(${value})` }}
                title={key}
              >
                <span className="text-xs opacity-0 hover:opacity-100 transition-opacity">
                  {key.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Palette */}
        {theme.gradients && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Gradient Palette</h4>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(theme.gradients).map(([key, value]) => (
                <div
                  key={key}
                  className="h-8 rounded border flex items-center justify-center"
                  style={{ background: value }}
                  title={key}
                >
                  <span className="text-xs opacity-0 hover:opacity-100 transition-opacity text-white mix-blend-difference">
                    {key.replace('Gradient', '').slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};