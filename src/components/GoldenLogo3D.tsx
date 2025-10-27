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

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Animated Cosmic Background Glow */}
      <div className="absolute inset-0 animate-pulse-glow">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Logo Container */}
      <div className="relative group">
        {/* Orbiting Elements */}
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

        {/* 3D Embossed Logo Text */}
        <div className="relative px-8 py-6">
          <h1 
            className={`
              ${sizeClasses[size]}
              font-extrabold 
              text-center
              relative
              golden-embossed-text
              animate-glow-pulse
              tracking-wider
              select-none
              transition-all
              duration-500
              group-hover:scale-105
              cursor-default
            `}
            style={{
              textShadow: `
                0 1px 0 #c99a48,
                0 2px 0 #b8893f,
                0 3px 0 #a77836,
                0 4px 0 #96672d,
                0 5px 0 #855624,
                0 6px 0 #74451b,
                0 7px 0 #633412,
                0 8px 0 #522309,
                0 9px 8px rgba(0,0,0,0.4),
                0 10px 15px rgba(0,0,0,0.3),
                0 15px 25px rgba(0,0,0,0.2),
                0 0 30px rgba(250,204,21,0.5),
                0 0 50px rgba(251,191,36,0.3)
              `,
              background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 20%, #ffd700 40%, #c9a853 60%, #a77836 80%, #855624 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(250,204,21,0.6))'
            }}
          >
            SOS ASTRAL
          </h1>
          
          {/* Embossed Highlight Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 50%)',
              mixBlendMode: 'overlay'
            }}
          />
        </div>

        {/* Glowing Aura Effect */}
        <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500 blur-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 animate-pulse-glow" style={{ zIndex: -1 }}></div>
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