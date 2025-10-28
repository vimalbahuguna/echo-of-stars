import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface VedicAcademyLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const VedicAcademyLogo: React.FC<VedicAcademyLogoProps> = ({ 
  className = '', 
  showText = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg`}>
          <GraduationCap className="w-1/2 h-1/2 text-white" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent leading-tight`}>
            SOS Vedic Academy
          </span>
          <span className="text-xs text-muted-foreground italic">Ancient Wisdom • Modern Learning</span>
        </div>
      )}
    </div>
  );
};

export default VedicAcademyLogo;
