import React from 'react';
import { Sparkles, Stars, Moon, Sun } from 'lucide-react';

interface GoldenLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const GoldenLogo3D: React.FC<GoldenLogo3DProps> = ({ 
  size = 'md', 
  showTagline = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
    xl: 'text-8xl md:text-9xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const logoSizes = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72 md:w-96 md:h-96'
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Animated Cosmic Background Glow */}
      <div className="absolute inset-0 animate-pulse-glow">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Logo Container */}
      <div className="relative group">
        {/* Orbiting Mystical Elements */}
        <div className="absolute inset-0 animate-orbit pointer-events-none">
          <div className={`absolute -top-2 -left-2 ${iconSizes[size]} text-yellow-400 animate-twinkle drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L15 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9 9L12 2Z" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 animate-orbit-reverse pointer-events-none" style={{ animationDelay: '1s' }}>
          <Sparkles className={`absolute -top-4 -right-4 ${iconSizes[size]} text-purple-400 animate-twinkle drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]`} style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute inset-0 animate-orbit pointer-events-none" style={{ animationDelay: '2s' }}>
          <Moon className={`absolute -bottom-2 -left-4 ${iconSizes[size]} text-cyan-300 animate-pulse drop-shadow-[0_0_8px_rgba(103,232,249,0.7)]`} />
        </div>
        <div className="absolute inset-0 animate-orbit-reverse pointer-events-none" style={{ animationDelay: '0.5s' }}>
          <Sun className={`absolute -bottom-4 -right-2 ${iconSizes[size]} text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]`} />
        </div>

        {/* Central Esoteric Symbol Container */}
        <div className={`relative ${logoSizes[size]} flex items-center justify-center transition-all duration-500 group-hover:scale-105`}>
          
          {/* Outermost Hermetic Circle with Alchemical Symbols */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/40 animate-spin-slow"
               style={{
                 boxShadow: '0 0 30px rgba(168,85,247,0.4), inset 0 0 30px rgba(168,85,247,0.2)',
                 filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))'
               }}>
            {/* Alchemical Planetary Symbols */}
            {['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆'].map((symbol, idx) => (
              <div
                key={idx}
                className="absolute text-purple-300 font-bold"
                style={{
                  top: '50%',
                  left: '50%',
                  fontSize: size === 'xl' ? '18px' : size === 'lg' ? '14px' : size === 'md' ? '12px' : '10px',
                  transform: `rotate(${idx * 45}deg) translateX(${size === 'xl' ? '140px' : size === 'lg' ? '100px' : size === 'md' ? '70px' : '40px'}) translateY(-50%)`,
                  textShadow: '0 0 10px rgba(216,180,254,0.8)'
                }}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Second Ring - Flower of Life Pattern */}
          <div className="absolute inset-8 rounded-full border-2 border-cyan-500/60 animate-spin-reverse"
               style={{
                 boxShadow: '0 0 20px rgba(34,211,238,0.5), inset 0 0 20px rgba(34,211,238,0.3)'
               }}>
            {/* Sacred circles forming Flower of Life */}
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
              <div
                key={idx}
                className="absolute w-8 h-8 rounded-full border border-cyan-400/40"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(${size === 'xl' ? '40px' : size === 'lg' ? '30px' : size === 'md' ? '20px' : '15px'}) translateY(-50%)`,
                  boxShadow: '0 0 10px rgba(34,211,238,0.5)'
                }}
              />
            ))}
          </div>

          {/* Third Ring - Merkaba Star */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-12 w-auto h-auto animate-spin-slow"
            style={{ filter: 'drop-shadow(0 0 15px rgba(250,204,21,0.6))' }}
          >
            <defs>
              <linearGradient id="merkaba-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#a78bfa', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {/* Upward Triangle (Merkaba) */}
            <path d="M 100,40 L 60,130 L 140,130 Z" fill="none" stroke="url(#merkaba-gradient)" strokeWidth="2" />
            {/* Downward Triangle (Merkaba) */}
            <path d="M 100,160 L 60,70 L 140,70 Z" fill="none" stroke="url(#merkaba-gradient)" strokeWidth="2" />
          </svg>

          {/* Inner Mystical Eye with Sri Yantra */}
          <div className="absolute inset-16 rounded-full bg-gradient-radial from-amber-400/30 via-purple-500/20 to-transparent animate-pulse-glow"></div>

          {/* Central Sri Yantra Sacred Geometry */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full p-8 transition-transform duration-500 group-hover:rotate-12"
            style={{
              filter: 'drop-shadow(0 0 25px rgba(250,204,21,0.7))'
            }}
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="20%" style={{ stopColor: '#ffed4e', stopOpacity: 1 }} />
                <stop offset="40%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="60%" style={{ stopColor: '#c9a853', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#a77836', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#855624', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="mysticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="emboss">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="6" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.6" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <g transform="translate(100, 100)">
              {/* Sri Yantra - Outer Square with Gates */}
              <rect x="-75" y="-75" width="150" height="150" fill="none" stroke="url(#goldGradient)" strokeWidth="2.5" filter="url(#emboss)" />
              
              {/* Sri Yantra - Outer Circles */}
              <circle cx="0" cy="0" r="70" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2" filter="url(#glow)" />
              <circle cx="0" cy="0" r="65" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#glow)" />
              
              {/* Sri Yantra - Lotus Petals (16 petals) */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 22.5 * Math.PI) / 180;
                const x1 = Math.cos(angle) * 55;
                const y1 = Math.sin(angle) * 55;
                const x2 = Math.cos(angle) * 65;
                const y2 = Math.sin(angle) * 65;
                return (
                  <line
                    key={`petal-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#goldGradient)"
                    strokeWidth="2"
                    filter="url(#emboss)"
                  />
                );
              })}
              
              {/* Sri Yantra - Nine Interlocking Triangles */}
              {/* Upward Triangles (Masculine/Shiva) */}
              <path d="M 0,-45 L -40,35 L 40,35 Z" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2.5" filter="url(#emboss)" className="animate-pulse" />
              <path d="M 0,-35 L -30,25 L 30,25 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="2" filter="url(#emboss)" />
              <path d="M 0,-25 L -20,15 L 20,15 Z" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2" filter="url(#emboss)" />
              <path d="M 0,-15 L -12,8 L 12,8 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#emboss)" />
              
              {/* Downward Triangles (Feminine/Shakti) */}
              <path d="M 0,45 L -40,-35 L 40,-35 Z" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2.5" filter="url(#emboss)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <path d="M 0,35 L -30,-25 L 30,-25 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="2" filter="url(#emboss)" />
              <path d="M 0,25 L -20,-15 L 20,-15 Z" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2" filter="url(#emboss)" />
              <path d="M 0,15 L -12,-8 L 12,-8 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#emboss)" />
              <path d="M 0,8 L -8,-5 L 8,-5 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#emboss)" />
              
              {/* Central Bindu (Point of Creation) */}
              <circle cx="0" cy="0" r="6" fill="url(#goldGradient)" filter="url(#glow)" className="animate-pulse" />
              <circle cx="0" cy="0" r="3" fill="#ffd700" filter="url(#glow)" className="animate-pulse" style={{ animationDelay: '0.25s' }} />
              
              {/* Mystical Third Eye */}
              <g transform="translate(0, -3)">
                {/* Eye outline */}
                <ellipse cx="0" cy="0" rx="18" ry="12" fill="none" stroke="url(#mysticalGradient)" strokeWidth="2" filter="url(#emboss)" />
                {/* Iris */}
                <circle cx="0" cy="0" r="7" fill="url(#mysticalGradient)" filter="url(#glow)" />
                {/* Pupil */}
                <circle cx="0" cy="0" r="4" fill="#1a1a1a" filter="url(#glow)" />
                {/* Light reflection */}
                <circle cx="-2" cy="-2" r="1.5" fill="#ffffff" opacity="0.8" />
              </g>
              
              {/* Om Symbol integrated into design */}
              <text
                x="0"
                y="55"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="url(#goldGradient)"
                filter="url(#emboss)"
                style={{ fontFamily: 'serif' }}
                className="animate-glow-pulse"
              >
                ॐ
              </text>
            </g>
          </svg>

          {/* Rotating Energy Field */}
          <div className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400 animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400 animate-spin-reverse"></div>
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-amber-400 animate-spin-slow"></div>
          </div>

          {/* Glowing Multi-dimensional Aura Effect */}
          <div className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500 blur-2xl bg-gradient-to-r from-purple-500 via-amber-500 to-cyan-500 animate-pulse-glow" style={{ zIndex: -1 }}></div>
        </div>
      </div>

      {/* Tagline */}
      {showTagline && (
        <div className="mt-4 relative z-10">
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
            <Sparkles className="w-4 h-4 text-amber-400 animate-twinkle" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          </div>
          
          <p 
            className="text-xl md:text-2xl font-bold text-center tracking-wide animate-shimmer-text"
            style={{
              background: 'linear-gradient(90deg, #c9a853 0%, #ffd700 25%, #ffed4e 50%, #ffd700 75%, #c9a853 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(250,204,21,0.3)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          >
            ✨ Where Ancient Wisdom Meets Cosmic Intelligence ✨
          </p>
          
          <p 
            className="text-sm md:text-base mt-2 text-center font-semibold"
            style={{
              background: 'linear-gradient(90deg, #b8893f 0%, #e5be6f 50%, #b8893f 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(184,137,63,0.3)'
            }}
          >
            🌟 Astrology • Spiritual Practice • Vedic Academy 🌟
          </p>
        </div>
      )}

      {/* Bottom Decorative Line */}
      {showTagline && (
        <div className="mt-4 flex items-center gap-3 justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400/60 to-yellow-400"></div>
          <Stars className="w-5 h-5 text-amber-400 animate-twinkle" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent via-yellow-400/60 to-yellow-400"></div>
        </div>
      )}
    </div>
  );
};

export default GoldenLogo3D;