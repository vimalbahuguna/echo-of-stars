import React from 'react';
import { useTranslation } from 'react-i18next';

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  isRetrograde?: boolean;
}

interface EastIndianChartProps {
  planets: Planet[];
  ascendant?: number;
}

const EastIndianChart: React.FC<EastIndianChartProps> = ({ planets, ascendant = 1 }) => {
  const { t } = useTranslation();

  const getPlanetsInHouse = (house: number) => {
    return planets
      .filter((p) => p.house === house)
      .map((p) => {
        const name = p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase();
        const abbrev = t(`planetAbbreviations.${name}`, { defaultValue: p.name.substring(0, 2) });
        return p.isRetrograde ? `${abbrev}(R)` : abbrev;
      })
      .join(' ');
  };

  // East Indian chart uses a rectangular layout with houses arranged in sequence
  const getHouseCoordinates = (house: number) => {
    // Adjust house based on ascendant position
    const adjustedHouse = ((house - ascendant + 12) % 12) + 1;
    
    const positions = {
      1: { x: 0, y: 0, width: 100, height: 75 },     // Top-left
      2: { x: 100, y: 0, width: 100, height: 75 },   // Top-center
      3: { x: 200, y: 0, width: 100, height: 75 },   // Top-right
      4: { x: 200, y: 75, width: 100, height: 75 },  // Middle-right
      5: { x: 200, y: 150, width: 100, height: 75 }, // Bottom-right
      6: { x: 200, y: 225, width: 100, height: 75 }, // Bottom-far-right
      7: { x: 100, y: 225, width: 100, height: 75 }, // Bottom-center
      8: { x: 0, y: 225, width: 100, height: 75 },   // Bottom-left
      9: { x: 0, y: 150, width: 100, height: 75 },   // Middle-left
      10: { x: 0, y: 75, width: 100, height: 75 },   // Middle-left-2
      11: { x: 100, y: 75, width: 100, height: 75 },  // Center-top
      12: { x: 100, y: 150, width: 100, height: 75 }  // Center-bottom
    };
    
    return positions[adjustedHouse] || positions[1];
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <defs>
          <linearGradient id="eastIndianGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#4c1d95', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#5b21b6', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#6d28d9', stopOpacity: 1}} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="300" height="300" fill="url(#eastIndianGradient)" rx="8" />

        {/* Grid structure - 3x4 layout */}
        {/* Vertical lines */}
        <line x1="100" y1="0" x2="100" y2="300" stroke="#6b46c1" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#6b46c1" strokeWidth="1" />
        
        {/* Horizontal lines */}
        <line x1="0" y1="75" x2="300" y2="75" stroke="#6b46c1" strokeWidth="1" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="#6b46c1" strokeWidth="1" />
        <line x1="0" y1="225" x2="300" y2="225" stroke="#6b46c1" strokeWidth="1" />

        {/* Outer border */}
        <rect x="0" y="0" width="300" height="300" fill="none" stroke="#6b46c1" strokeWidth="2" rx="8" />

        {/* House numbers and planets */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
          const pos = getHouseCoordinates(house);
          const planetsText = getPlanetsInHouse(house);
          const isAscendant = house === ascendant;
          
          return (
            <g key={house}>
              {/* House background highlight for ascendant */}
              {isAscendant && (
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  fill="rgba(255, 215, 0, 0.15)"
                  stroke="rgba(255, 215, 0, 0.4)"
                  strokeWidth="1"
                />
              )}
              
              {/* House number */}
              <text
                x={pos.x + 10}
                y={pos.y + 15}
                fontSize="11"
                fill={isAscendant ? "#ffd700" : "#c4b5fd"}
                fontWeight="bold"
              >
                {house}
              </text>
              
              {/* Planets */}
              <text
                x={pos.x + pos.width/2}
                y={pos.y + pos.height/2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#f3f4f6"
                fontFamily="monospace"
              >
                {planetsText}
              </text>

              {/* Sign name (if available) */}
              {planets.find(p => p.house === house)?.sign && (
                <text
                  x={pos.x + pos.width - 10}
                  y={pos.y + pos.height - 5}
                  textAnchor="end"
                  fontSize="8"
                  fill="#a78bfa"
                >
                  {planets.find(p => p.house === house)?.sign?.substring(0, 3)}
                </text>
              )}
            </g>
          );
        })}

        {/* Chart title */}
        <text
          x="150"
          y="15"
          textAnchor="middle"
          fontSize="12"
          fill="#f3f4f6"
          fontWeight="bold"
        >
          East Indian Chart
        </text>

        {/* Ascendant indicator */}
        {ascendant && (
          <text
            x="10"
            y="290"
            fontSize="10"
            fill="#ffd700"
            fontWeight="bold"
          >
            Ascendant: House {ascendant}
          </text>
        )}
      </svg>
    </div>
  );
};

export default EastIndianChart;