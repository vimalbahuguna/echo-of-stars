import React from 'react';
import { useTranslation } from 'react-i18next';

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  isRetrograde?: boolean;
}

interface SouthIndianChartProps {
  planets: Planet[];
  ascendant?: number;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ planets, ascendant = 1 }) => {
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

  // South Indian chart uses fixed house positions
  // Houses are numbered 1-12 in a specific pattern
  const getHouseCoordinates = (house: number) => {
    const positions = {
      1: { x: 225, y: 75, row: 0, col: 3 },   // Top-right
      2: { x: 150, y: 75, row: 0, col: 2 },   // Top-center-right
      3: { x: 75, y: 75, row: 0, col: 1 },    // Top-center-left
      4: { x: 0, y: 75, row: 0, col: 0 },     // Top-left
      5: { x: 0, y: 150, row: 1, col: 0 },    // Middle-left
      6: { x: 0, y: 225, row: 2, col: 0 },    // Bottom-left
      7: { x: 75, y: 225, row: 2, col: 1 },   // Bottom-center-left
      8: { x: 150, y: 225, row: 2, col: 2 },  // Bottom-center-right
      9: { x: 225, y: 225, row: 2, col: 3 },  // Bottom-right
      10: { x: 225, y: 150, row: 1, col: 3 }, // Middle-right
      11: { x: 150, y: 150, row: 1, col: 2 }, // Center-right
      12: { x: 75, y: 150, row: 1, col: 1 }   // Center-left
    };
    
    return positions[house] || positions[1];
  };

  const cellSize = 75;

  return (
    <div className="w-full max-w-md mx-auto aspect-square relative">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <defs>
          <linearGradient id="southIndianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#2d3748', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#1a202c', stopOpacity: 1}} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="300" height="300" fill="url(#southIndianGradient)" rx="8" />

        {/* Grid lines */}
        {/* Vertical lines */}
        <line x1="75" y1="0" x2="75" y2="300" stroke="#4a5568" strokeWidth="1" />
        <line x1="150" y1="0" x2="150" y2="300" stroke="#4a5568" strokeWidth="1" />
        <line x1="225" y1="0" x2="225" y2="300" stroke="#4a5568" strokeWidth="1" />
        
        {/* Horizontal lines */}
        <line x1="0" y1="75" x2="300" y2="75" stroke="#4a5568" strokeWidth="1" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="#4a5568" strokeWidth="1" />
        <line x1="0" y1="225" x2="300" y2="225" stroke="#4a5568" strokeWidth="1" />

        {/* Outer border */}
        <rect x="0" y="0" width="300" height="300" fill="none" stroke="#4a5568" strokeWidth="2" rx="8" />

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
                  x={pos.col * cellSize}
                  y={pos.row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="rgba(255, 215, 0, 0.1)"
                  stroke="rgba(255, 215, 0, 0.3)"
                  strokeWidth="1"
                />
              )}
              
              {/* House number */}
              <text
                x={pos.x + cellSize/2}
                y={pos.y + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={isAscendant ? "#ffd700" : "#a0aec0"}
                fontWeight="bold"
              >
                {house}
              </text>
              
              {/* Planets */}
              <text
                x={pos.x + cellSize/2}
                y={pos.y + 45}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#e2e8f0"
                fontFamily="monospace"
              >
                {planetsText}
              </text>

              {/* Sign name (if available) */}
              {planets.find(p => p.house === house)?.sign && (
                <text
                  x={pos.x + cellSize/2}
                  y={pos.y + 60}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="#9ca3af"
                >
                  {planets.find(p => p.house === house)?.sign?.substring(0, 3)}
                </text>
              )}
            </g>
          );
        })}

        {/* Ascendant indicator */}
        {ascendant && (
          <text
            x="10"
            y="20"
            fontSize="10"
            fill="#ffd700"
            fontWeight="bold"
          >
            ASC: {ascendant}
          </text>
        )}
      </svg>
    </div>
  );
};

export default SouthIndianChart;