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
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Logo Container */}
      <div className="relative group">
        {/* Orbiting Celestial Elements */}
        <div className="absolute inset-0 animate-orbit pointer-events-none">
          <Stars className={`absolute -top-2 -left-2 ${iconSizes[size]} text-yellow-400 animate-twinkle drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]`} />
        </div>
        <div className="absolute inset-0 animate-orbit-reverse pointer-events-none" style={{ animationDelay: '1s' }}>
          <Sparkles className={`absolute -top-4 -right-4 ${iconSizes[size]} text-amber-400 animate-twinkle drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]`} style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute inset-0 animate-orbit pointer-events-none" style={{ animationDelay: '2s' }}>
          <Moon className={`absolute -bottom-2 -left-4 ${iconSizes[size]} text-orange-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,186,116,0.7)]`} />
        </div>
        <div className="absolute inset-0 animate-orbit-reverse pointer-events-none" style={{ animationDelay: '0.5s' }}>
          <Sun className={`absolute -bottom-4 -right-2 ${iconSizes[size]} text-yellow-500 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.9)]`} />
        </div>

        {/* Central Divine Symbol Container */}
        <div className={`relative ${logoSizes[size]} flex items-center justify-center transition-all duration-500 group-hover:scale-105`}>
          
          {/* Outer Zodiac Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400/40 animate-spin-slow"
               style={{
                 boxShadow: '0 0 30px rgba(250,204,21,0.4), inset 0 0 30px rgba(250,204,21,0.2)',
                 filter: 'drop-shadow(0 0 20px rgba(250,204,21,0.6))'
               }}>
            {/* Zodiac Symbols */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
              <div
                key={idx}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(${size === 'xl' ? '140px' : size === 'lg' ? '100px' : size === 'md' ? '70px' : '40px'}) translateY(-50%)`,
                  boxShadow: '0 0 10px rgba(250,204,21,0.8)'
                }}
              />
            ))}
          </div>

          {/* Middle Ring with Sacred Geometry */}
          <div className="absolute inset-8 rounded-full border-2 border-amber-500/60 animate-spin-reverse"
               style={{
                 boxShadow: '0 0 20px rgba(251,191,36,0.5), inset 0 0 20px rgba(251,191,36,0.3)'
               }}>
          </div>

          {/* Inner Glow Circle */}
          <div className="absolute inset-12 rounded-full bg-gradient-radial from-yellow-400/30 via-amber-500/20 to-transparent animate-pulse-glow"></div>

          {/* Central Om Symbol (Divine) */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full p-12 transition-transform duration-500 group-hover:rotate-12"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(250,204,21,0.8)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
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
              <filter id="emboss">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Om Symbol Path */}
            <path
              d="M 100 40 C 85 40, 75 50, 75 65 C 75 75, 80 82, 90 85 L 85 100 C 82 110, 85 120, 95 120 C 105 120, 110 112, 108 102 L 105 90 C 115 88, 125 80, 125 65 C 125 50, 115 40, 100 40 Z M 130 70 C 135 65, 145 65, 150 70 C 155 75, 155 85, 150 90 C 145 95, 135 95, 130 90 C 125 85, 125 75, 130 70 Z M 60 130 Q 70 125, 85 130 T 110 135 Q 125 138, 140 135 M 80 145 C 80 155, 90 160, 100 160 C 110 160, 120 155, 120 145"
              fill="url(#goldGradient)"
              stroke="#c9a853"
              strokeWidth="2"
              filter="url(#emboss)"
              className="animate-glow-pulse"
            />
            
            {/* Decorative Dots */}
            <circle cx="100" cy="25" r="4" fill="url(#goldGradient)" filter="url(#emboss)" />
            <circle cx="150" cy="55" r="3" fill="url(#goldGradient)" filter="url(#emboss)" />
            <circle cx="50" cy="55" r="3" fill="url(#goldGradient)" filter="url(#emboss)" />
          </svg>

          {/* Lotus Petals Base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3/4 h-8">
            <svg viewBox="0 0 100 20" className="w-full h-full" style={{ filter: 'drop-shadow(0 5px 15px rgba(250,204,21,0.6))' }}>
              <path
                d="M 10,15 Q 20,5 30,15 Q 40,5 50,15 Q 60,5 70,15 Q 80,5 90,15"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Glowing Aura Effect */}
          <div className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500 blur-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 animate-pulse-glow" style={{ zIndex: -1 }}></div>
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