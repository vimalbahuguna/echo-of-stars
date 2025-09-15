import React from 'react';

interface Planet {
  name: string;
  house: number;
}

interface VedicChartProps {
  planets: Planet[];
}

const planetAbbreviations: { [key: string]: string } = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
};

const houseColors = [
    '#FFC3A0', '#FFD700', '#C8A2C8', '#87CEEB', '#98FB98', '#F0E68C',
    '#DDA0DD', '#87CEFA', '#F08080', '#90EE90', '#FFB6C1', '#E6E6FA'
];

const VedicChart: React.FC<VedicChartProps> = ({ planets }) => {

  const getPlanetsInHouse = (house: number) => {
    return planets
      .filter((p) => p.house === house)
      .map((p) => planetAbbreviations[p.name] || p.name.substring(0, 2))
      .join(' ');
  };

  const houseCoords = [
    { x: 75, y: 75, number: 1 },
    { x: 225, y: 75, number: 2 },
    { x: 225, y: 225, number: 3 },
    { x: 75, y: 225, number: 4 },
    { x: 150, y: 35, number: 5 },
    { x: 265, y: 150, number: 6 },
    { x: 150, y: 265, number: 7 },
    { x: 35, y: 150, number: 8 },
    { x: 75, y: 150, number: 9 },
    { x: 150, y: 75, number: 10 },
    { x: 225, y: 150, number: 11 },
    { x: 150, y: 225, number: 12 },
  ];

  return (
    <div className="w-full max-w-md mx-auto aspect-square relative">
        <svg viewBox="0 0 300 300" className="w-full h-auto rounded-lg">
            <defs>
                <radialGradient id="vedicGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor: '#4a0e99', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#2a0a5e', stopOpacity: 1}} />
                </radialGradient>
            </defs>

            {/* Outer box */}
            <rect x="0" y="0" width="300" height="300" fill="url(#vedicGradient)" stroke="#D3D3D3" strokeWidth="2" />

            {/* Inner lines */}
            <line x1="0" y1="0" x2="300" y2="300" stroke="#D3D3D3" strokeWidth="2" />
            <line x1="300" y1="0" x2="0" y2="300" stroke="#D3D3D3" strokeWidth="2" />
            <line x1="150" y1="0" x2="0" y2="150" stroke="#D3D3D3" strokeWidth="1" />
            <line x1="150" y1="0" x2="300" y2="150" stroke="#D3D3D3" strokeWidth="1" />
            <line x1="0" y1="150" x2="150" y2="300" stroke="#D3D3D3" strokeWidth="1" />
            <line x1="300" y1="150" x2="150" y2="300" stroke="#D3D3D3" strokeWidth="1" />

            {houseCoords.map(({ x, y, number }) => (
                <React.Fragment key={number}>
                    <text x={x} y={y - 10} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={houseColors[number-1]}>{number}</text>
                    <text x={x} y={y + 10} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#FFFFFF">{getPlanetsInHouse(number)}</text>
                </React.Fragment>
            ))}
        </svg>
    </div>
  );
};

export default VedicChart;
