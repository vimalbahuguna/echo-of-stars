import React from 'react';

interface PujaIllustrationProps {
  item: string;
  className?: string;
}

export const PujaIllustrations: React.FC<PujaIllustrationProps> = ({ item, className = "w-16 h-16" }) => {
  const illustrations: Record<string, JSX.Element> = {
    'Sacred Yoni Yantra': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
        <path d="M25 50 Q50 25 75 50 Q50 75 25 50 Z" fill="#FF69B4" stroke="#C71585" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" stroke="#C71585" strokeWidth="1"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B4513">ॐ</text>
      </svg>
    ),
    'Red Flowers': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20,20)">
          <path d="M30 30 Q20 20 10 30 Q20 40 30 30 Z" fill="#DC143C"/>
          <path d="M30 30 Q40 20 50 30 Q40 40 30 30 Z" fill="#DC143C"/>
          <path d="M30 30 Q20 40 10 50 Q20 60 30 50 Z" fill="#DC143C"/>
          <path d="M30 30 Q40 40 50 50 Q40 60 30 50 Z" fill="#DC143C"/>
          <path d="M30 30 Q30 20 30 10 Q30 20 30 30 Z" fill="#DC143C"/>
          <circle cx="30" cy="35" r="5" fill="#FFD700"/>
        </g>
        <g transform="translate(40,40)">
          <path d="M20 20 Q15 15 10 20 Q15 25 20 20 Z" fill="#FF1493"/>
          <path d="M20 20 Q25 15 30 20 Q25 25 20 20 Z" fill="#FF1493"/>
          <path d="M20 20 Q15 25 10 30 Q15 35 20 30 Z" fill="#FF1493"/>
          <path d="M20 20 Q25 25 30 30 Q25 35 20 30 Z" fill="#FF1493"/>
          <circle cx="20" cy="22" r="3" fill="#FFD700"/>
        </g>
      </svg>
    ),
    'Kumkum Powder': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="70" rx="35" ry="15" fill="#8B4513"/>
        <ellipse cx="50" cy="65" rx="30" ry="12" fill="#DC143C"/>
        <path d="M20 65 Q50 45 80 65" fill="#FF4500"/>
        <circle cx="35" cy="60" r="2" fill="#FFD700"/>
        <circle cx="65" cy="62" r="1.5" fill="#FFD700"/>
      </svg>
    ),
    'Turmeric Powder': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="70" rx="35" ry="15" fill="#8B4513"/>
        <ellipse cx="50" cy="65" rx="30" ry="12" fill="#FFD700"/>
        <path d="M20 65 Q50 45 80 65" fill="#FFA500"/>
        <circle cx="40" cy="60" r="2" fill="#FFFF00"/>
        <circle cx="60" cy="62" r="1.5" fill="#FFFF00"/>
      </svg>
    ),
    'Ghee Lamp': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="80" rx="25" ry="8" fill="#B8860B"/>
        <rect x="40" y="60" width="20" height="20" fill="#DAA520" rx="2"/>
        <ellipse cx="50" cy="60" rx="12" ry="4" fill="#FFD700"/>
        <path d="M50 60 L50 45 Q48 40 50 35 Q52 40 50 45 Z" fill="#FF4500"/>
        <ellipse cx="50" cy="35" rx="3" ry="8" fill="#FF6347"/>
        <path d="M47 30 Q50 25 53 30" stroke="#FFD700" strokeWidth="1" fill="none"/>
      </svg>
    ),
    'Incense Sticks': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="30" width="2" height="50" fill="#8B4513"/>
        <rect x="48" y="25" width="2" height="55" fill="#8B4513"/>
        <rect x="51" y="35" width="2" height="45" fill="#8B4513"/>
        <circle cx="46" cy="25" r="2" fill="#654321"/>
        <circle cx="49" cy="20" r="2" fill="#654321"/>
        <circle cx="52" cy="30" r="2" fill="#654321"/>
        <path d="M44 20 Q50 15 56 25" stroke="#D3D3D3" strokeWidth="1" fill="none" opacity="0.7"/>
        <path d="M42 25 Q48 20 54 30" stroke="#D3D3D3" strokeWidth="1" fill="none" opacity="0.5"/>
      </svg>
    ),
    'Sacred Water': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 80 Q30 70 40 70 L60 70 Q70 70 70 80 L70 85 Q70 90 65 90 L35 90 Q30 90 30 85 Z" fill="#4682B4"/>
        <ellipse cx="50" cy="70" rx="15" ry="3" fill="#87CEEB"/>
        <path d="M45 65 Q50 55 55 65" fill="#87CEEB"/>
        <circle cx="48" cy="75" r="2" fill="#B0E0E6" opacity="0.7"/>
        <circle cx="55" cy="78" r="1.5" fill="#B0E0E6" opacity="0.7"/>
        <path d="M35 85 Q50 82 65 85" stroke="#4169E1" strokeWidth="1" fill="none"/>
      </svg>
    ),
    'Fruits': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="45" r="15" fill="#FF8C00"/>
        <path d="M35 30 Q35 25 40 30" stroke="#228B22" strokeWidth="2" fill="none"/>
        <circle cx="65" cy="50" r="12" fill="#FFD700"/>
        <path d="M65 38 Q65 33 70 38" stroke="#228B22" strokeWidth="2" fill="none"/>
        <ellipse cx="50" cy="70" rx="18" ry="12" fill="#FF69B4"/>
        <path d="M50 58 Q50 53 55 58" stroke="#228B22" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Red Cloth': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 30 Q30 25 40 30 Q50 35 60 30 Q70 25 80 30 L80 70 Q70 75 60 70 Q50 65 40 70 Q30 75 20 70 Z" fill="#DC143C"/>
        <path d="M20 35 Q30 30 40 35 Q50 40 60 35 Q70 30 80 35" stroke="#8B0000" strokeWidth="1" fill="none"/>
        <path d="M20 45 Q30 40 40 45 Q50 50 60 45 Q70 40 80 45" stroke="#8B0000" strokeWidth="1" fill="none"/>
        <path d="M20 55 Q30 50 40 55 Q50 60 60 55 Q70 50 80 55" stroke="#8B0000" strokeWidth="1" fill="none"/>
      </svg>
    ),
    'Camphor': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="60" width="30" height="20" fill="#F5F5F5" rx="3"/>
        <path d="M40 60 L45 50 L50 60 L55 50 L60 60" fill="#FFFFFF"/>
        <ellipse cx="50" cy="45" rx="8" ry="15" fill="#E0E0E0"/>
        <path d="M45 35 Q50 25 55 35 Q50 30 45 35" fill="#87CEEB"/>
        <circle cx="48" cy="40" r="1" fill="#4169E1" opacity="0.6"/>
        <circle cx="52" cy="38" r="1" fill="#4169E1" opacity="0.6"/>
      </svg>
    ),
    'Milk': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 80 Q35 70 40 70 L60 70 Q65 70 65 80 L65 85 Q65 90 60 90 L40 90 Q35 90 35 85 Z" fill="#FFFFFF" stroke="#D3D3D3" strokeWidth="1"/>
        <ellipse cx="50" cy="70" rx="12" ry="2" fill="#F8F8FF"/>
        <path d="M42 75 Q50 72 58 75" stroke="#E6E6FA" strokeWidth="1" fill="none"/>
        <circle cx="45" cy="78" r="1" fill="#F0F8FF" opacity="0.8"/>
        <circle cx="55" cy="76" r="1" fill="#F0F8FF" opacity="0.8"/>
      </svg>
    ),
    'Sweets': (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="50" r="12" fill="#DEB887"/>
        <circle cx="60" cy="50" r="10" fill="#F4A460"/>
        <rect x="45" y="65" width="15" height="8" fill="#CD853F" rx="2"/>
        <circle cx="42" cy="48" r="2" fill="#FFD700"/>
        <circle cx="58" cy="52" r="1.5" fill="#FF69B4"/>
        <rect x="47" y="67" width="3" height="4" fill="#8B4513"/>
        <rect x="52" y="67" width="3" height="4" fill="#8B4513"/>
      </svg>
    )
  };

  return illustrations[item] || (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#E0E0E0" stroke="#999" strokeWidth="2"/>
      <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#666">?</text>
    </svg>
  );
};

// Step illustrations for the puja sequence
export const StepIllustrations: React.FC<{ step: number; className?: string }> = ({ step, className = "w-24 h-24" }) => {
  const stepIllustrations: Record<number, JSX.Element> = {
    1: ( // Purification
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#E6F3FF" stroke="#4682B4" strokeWidth="2"/>
        <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#87CEEB" opacity="0.7"/>
        <circle cx="45" cy="45" r="3" fill="#FFFFFF"/>
        <circle cx="55" cy="55" r="2" fill="#FFFFFF"/>
        <path d="M40 60 Q50 55 60 60" stroke="#4169E1" strokeWidth="2" fill="none"/>
      </svg>
    ),
    2: ( // Ganesha Prayer
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="45" r="20" fill="#FFB347"/>
        <ellipse cx="35" cy="40" rx="8" ry="15" fill="#FFB347"/>
        <ellipse cx="65" cy="40" rx="8" ry="15" fill="#FFB347"/>
        <circle cx="45" cy="42" r="2" fill="#000"/>
        <circle cx="55" cy="42" r="2" fill="#000"/>
        <path d="M50 50 Q48 55 50 60 Q52 55 50 50" fill="#FFB347"/>
        <path d="M40 70 Q50 65 60 70" stroke="#8B4513" strokeWidth="3" fill="none"/>
        <text x="50" y="85" textAnchor="middle" fontSize="10" fill="#8B4513">ॐ गं</text>
      </svg>
    ),
    3: ( // Sacred Space
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="60" width="60" height="30" fill="#DEB887" stroke="#8B4513" strokeWidth="2"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#FFD700" strokeWidth="3"/>
        <path d="M35 35 L65 35 L65 65 L35 65 Z" fill="none" stroke="#DC143C" strokeWidth="2"/>
        <circle cx="50" cy="50" r="5" fill="#FF69B4"/>
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="#8B4513">Sacred Space</text>
      </svg>
    ),
    4: ( // Breath Meditation
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" fill="#E6F7FF" stroke="#87CEEB" strokeWidth="2"/>
        <path d="M30 50 Q50 30 70 50" stroke="#4682B4" strokeWidth="3" fill="none"/>
        <path d="M70 50 Q50 70 30 50" stroke="#4682B4" strokeWidth="3" fill="none" opacity="0.5"/>
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" stroke="#4682B4" strokeWidth="2"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#4682B4">Pranayama</text>
      </svg>
    ),
    5: ( // Divine Mother Prayer
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="25" fill="#FFE4E1" stroke="#FF69B4" strokeWidth="2"/>
        <path d="M35 35 Q50 20 65 35" fill="#FF1493"/>
        <circle cx="45" cy="38" r="2" fill="#8B0000"/>
        <circle cx="55" cy="38" r="2" fill="#8B0000"/>
        <path d="M45 45 Q50 50 55 45" stroke="#8B0000" strokeWidth="2" fill="none"/>
        <path d="M30 65 Q50 55 70 65 Q50 75 30 65" fill="#FFB6C1"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B0000">Devi Mata</text>
      </svg>
    ),
    6: ( // Sacred Anointing
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="60" rx="30" ry="20" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
        <path d="M40 45 Q50 35 60 45 L55 55 Q50 50 45 55 Z" fill="#FF69B4"/>
        <circle cx="50" cy="50" r="3" fill="#FFFFFF"/>
        <path d="M35 40 Q50 30 65 40" stroke="#FFD700" strokeWidth="2" fill="none"/>
        <circle cx="42" cy="65" r="2" fill="#FFA500"/>
        <circle cx="58" cy="65" r="2" fill="#FFA500"/>
      </svg>
    ),
    7: ( // Flower Offering
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(30,30)">
          <path d="M20 20 Q15 15 10 20 Q15 25 20 20" fill="#DC143C"/>
          <path d="M20 20 Q25 15 30 20 Q25 25 20 20" fill="#DC143C"/>
          <path d="M20 20 Q15 25 10 30 Q15 35 20 30" fill="#DC143C"/>
          <path d="M20 20 Q25 25 30 30 Q25 35 20 30" fill="#DC143C"/>
          <circle cx="20" cy="22" r="3" fill="#FFD700"/>
        </g>
        <path d="M30 70 Q50 60 70 70" stroke="#228B22" strokeWidth="3" fill="none"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B4513">Pushpa Arpana</text>
      </svg>
    ),
    8: ( // Kumkum & Tilaka
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="45" r="20" fill="#FFE4E1"/>
        <rect x="48" y="25" width="4" height="15" fill="#DC143C" rx="2"/>
        <circle cx="50" cy="35" r="3" fill="#FFD700"/>
        <path d="M40 55 Q50 50 60 55" stroke="#DC143C" strokeWidth="3" fill="none"/>
        <circle cx="45" cy="60" r="2" fill="#DC143C"/>
        <circle cx="55" cy="60" r="2" fill="#DC143C"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B4513">Tilaka</text>
      </svg>
    ),
    9: ( // Food Offering
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="70" rx="25" ry="8" fill="#8B4513"/>
        <ellipse cx="50" cy="65" rx="20" ry="6" fill="#DEB887"/>
        <circle cx="45" cy="60" r="5" fill="#F4A460"/>
        <circle cx="55" cy="60" r="4" fill="#CD853F"/>
        <rect x="47" y="55" width="6" height="3" fill="#FFD700" rx="1"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B4513">Naivedya</text>
      </svg>
    ),
    10: ( // Aarti & Prayer
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="75" rx="20" ry="6" fill="#B8860B"/>
        <rect x="45" y="60" width="10" height="15" fill="#DAA520" rx="2"/>
        <path d="M50 60 L50 45 Q48 40 50 35 Q52 40 50 45" fill="#FF4500"/>
        <ellipse cx="50" cy="35" rx="4" ry="10" fill="#FF6347"/>
        <path d="M46 30 Q50 25 54 30" stroke="#FFD700" strokeWidth="2" fill="none"/>
        <circle cx="35" cy="50" r="15" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,5"/>
        <text x="50" y="90" textAnchor="middle" fontSize="8" fill="#8B4513">Aarti</text>
      </svg>
    ),
    11: ( // Silent Meditation
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" fill="#F0F8FF" stroke="#4682B4" strokeWidth="2"/>
        <path d="M35 45 Q50 30 65 45" fill="none" stroke="#87CEEB" strokeWidth="2"/>
        <path d="M35 55 Q50 70 65 55" fill="none" stroke="#87CEEB" strokeWidth="2"/>
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" stroke="#4682B4" strokeWidth="2"/>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#4682B4">Mauna Dhyana</text>
      </svg>
    ),
    12: ( // Gratitude & Closing
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="#FFE4B5" stroke="#DAA520" strokeWidth="2"/>
        <path d="M40 45 L45 50 L60 35" stroke="#228B22" strokeWidth="3" fill="none"/>
        <path d="M35 60 Q50 55 65 60" stroke="#FF69B4" strokeWidth="2" fill="none"/>
        <text x="50" y="25" textAnchor="middle" fontSize="10" fill="#8B4513">ॐ शांति</text>
        <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8B4513">Samapti</text>
      </svg>
    )
  };

  return stepIllustrations[step] || (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#E0E0E0" stroke="#999" strokeWidth="2"/>
      <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#666">{step}</text>
    </svg>
  );
};