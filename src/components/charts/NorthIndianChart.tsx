import React from 'react';
import { useTranslation } from 'react-i18next';

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  isRetrograde?: boolean;
}

interface NorthIndianChartProps {
  planets: Planet[];
  ascendant?: number;
}

const NorthIndianChart: React.FC<NorthIndianChartProps> = ({ planets, ascendant = 1 }) => {
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

  // North Indian chart house positions (diamond layout)
  // Houses are arranged in a diamond pattern with ascendant at the top
  const getHousePosition = (house: number) => {
    // Adjust house number based on ascendant
    const adjustedHouse = ((house - ascendant + 12) % 12) + 1;
    
    const positions = {
      1: { x: 150, y: 50, width: 100, height: 50 },   // Top
      2: { x: 200, y: 75, width: 75, height: 50 },    // Top-right
      3: { x: 225, y: 125, width: 75, height: 50 },   // Right-top
      4: { x: 200, y: 175, width: 75, height: 50 },   // Right-bottom
      5: { x: 150, y: 200, width: 100, height: 50 },  // Bottom-right
      6: { x: 100, y: 225, width: 100, height: 50 },  // Bottom
      7: { x: 50, y: 200, width: 100, height: 50 },   // Bottom-left
      8: { x: 25, y: 175, width: 75, height: 50 },    // Left-bottom
      9: { x: 0, y: 125, width: 75, height: 50 },     // Left-top
      10: { x: 25, y: 75, width: 75, height: 50 },    // Top-left
      11: { x: 50, y: 50, width: 100, height: 50 },   // Top-left-2
      12: { x: 100, y: 75, width: 75, height: 50 }    // Center-top
    };
    
    return positions[adjustedHouse] || positions[1];
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square relative">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <defs>
          <radialGradient id="northIndianGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#16213e', stopOpacity: 1}} />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="300" height="300" fill="url(#northIndianGradient)" rx="8" />

        {/* Diamond outline */}
        <polygon 
          points="150,25 275,150 150,275 25,150" 
          fill="none" 
          stroke="#4a5568" 
          strokeWidth="2"
        />

        {/* Inner diamond lines */}
        <line x1="150" y1="25" x2="150" y2="275" stroke="#4a5568" strokeWidth="1" />
        <line x1="25" y1="150" x2="275" y2="150" stroke="#4a5568" strokeWidth="1" />
        
        {/* Diagonal lines */}
        <line x1="87.5" y1="87.5" x2="212.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="212.5" y1="87.5" x2="87.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />

        {/* House divisions */}
        <line x1="150" y1="25" x2="87.5" y2="87.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="150" y1="25" x2="212.5" y2="87.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="275" y1="150" x2="212.5" y2="87.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="275" y1="150" x2="212.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="150" y1="275" x2="212.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="150" y1="275" x2="87.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="25" y1="150" x2="87.5" y2="212.5" stroke="#4a5568" strokeWidth="1" />
        <line x1="25" y1="150" x2="87.5" y2="87.5" stroke="#4a5568" strokeWidth="1" />

        {/* House numbers and planets */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
          const pos = getHousePosition(house);
          const planetsText = getPlanetsInHouse(house);
          
          return (
            <g key={house}>
              {/* House number */}
              <text
                x={pos.x}
                y={pos.y - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#a0aec0"
                fontWeight="bold"
              >
                {house}
              </text>
              
              {/* Planets */}
              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="#e2e8f0"
                fontFamily="monospace"
              >
                {planetsText}
              </text>
            </g>
          );
        })}

        {/* Ascendant marker */}
        <circle cx="150" cy="40" r="3" fill="#ffd700" />
        <text
          x="150"
          y="35"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="#ffd700"
          fontWeight="bold"
        >
          ASC
        </text>
      </svg>
    </div>
  );
};

export default NorthIndianChart;