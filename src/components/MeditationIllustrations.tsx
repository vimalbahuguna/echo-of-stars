import React from 'react';

interface MeditationIllustrationsProps {
  technique: string;
  step?: number;
  className?: string;
}

export const MeditationIllustrations: React.FC<MeditationIllustrationsProps> = ({
  technique,
  step = 0,
  className = "w-48 h-48"
}) => {
  const getIllustration = () => {
    const baseClass = `${className} mx-auto`;
    
    switch (technique.toLowerCase()) {
      case 'breath awareness':
      case 'natural breathing':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="breathGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </radialGradient>
              <animate id="breatheIn" attributeName="r" values="30;50;30" dur="4s" repeatCount="indefinite" />
            </defs>
            
            {/* Body outline */}
            <ellipse cx="100" cy="120" rx="40" ry="60" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
            
            {/* Breathing circle */}
            <circle cx="100" cy="100" r="30" fill="url(#breathGradient)" opacity="0.7">
              <animate attributeName="r" values="25;45;25" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
            </circle>
            
            {/* Breath flow lines */}
            <path d="M 100 70 Q 85 50 70 40" stroke="#0EA5E9" strokeWidth="2" fill="none" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M 100 70 Q 115 50 130 40" stroke="#0EA5E9" strokeWidth="2" fill="none" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
            </path>
            
            {/* Meditation posture */}
            <circle cx="100" cy="40" r="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 85 55 Q 100 45 115 55" stroke="#F59E0B" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'witness consciousness':
      case 'awareness meditation':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="awarenessGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
            </defs>
            
            {/* Consciousness layers */}
            <circle cx="100" cy="100" r="80" fill="#FEF3C7" opacity="0.3" />
            <circle cx="100" cy="100" r="60" fill="#FDE68A" opacity="0.4" />
            <circle cx="100" cy="100" r="40" fill="#FBBF24" opacity="0.5" />
            
            {/* Central awareness */}
            <circle cx="100" cy="100" r="20" fill="url(#awarenessGradient)">
              <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite" />
            </circle>
            
            {/* Witnessing eye */}
            <ellipse cx="100" cy="100" rx="12" ry="8" fill="#FFFFFF" />
            <circle cx="100" cy="100" r="6" fill="#1F2937" />
            <circle cx="102" cy="98" r="2" fill="#FFFFFF" />
            
            {/* Thought bubbles being observed */}
            <circle cx="60" cy="60" r="8" fill="#E5E7EB" opacity="0.7">
              <animate attributeName="cy" values="60;40;60" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="70" r="6" fill="#E5E7EB" opacity="0.7">
              <animate attributeName="cy" values="70;50;70" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="140" r="7" fill="#E5E7EB" opacity="0.7">
              <animate attributeName="cy" values="140;160;140" dur="6s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      case 'chakra meditation':
      case 'energy work':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chakraGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="16%" stopColor="#3B82F6" />
                <stop offset="33%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="66%" stopColor="#F59E0B" />
                <stop offset="83%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            
            {/* Body outline */}
            <ellipse cx="100" cy="120" rx="30" ry="70" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            
            {/* Chakra points */}
            <circle cx="100" cy="60" r="6" fill="#8B5CF6" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="75" r="6" fill="#3B82F6" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="90" r="6" fill="#06B6D4" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="105" r="6" fill="#10B981" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="120" r="6" fill="#F59E0B" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="135" r="6" fill="#F97316" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="150" r="6" fill="#EF4444" opacity="0.8">
              <animate attributeName="r" values="4;8;4" dur="3.2s" repeatCount="indefinite" />
            </circle>
            
            {/* Energy flow */}
            <line x1="100" y1="50" x2="100" y2="160" stroke="url(#chakraGradient)" strokeWidth="3" opacity="0.6" />
          </svg>
        );

      case 'mantra meditation':
      case 'sound meditation':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="soundGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
            </defs>
            
            {/* Sound waves */}
            <circle cx="100" cy="100" r="20" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" values="20;60;20" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="30" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6">
              <animate attributeName="r" values="30;70;30" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.4">
              <animate attributeName="r" values="40;80;40" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            
            {/* Central figure */}
            <circle cx="100" cy="80" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <ellipse cx="100" cy="110" rx="25" ry="40" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            
            {/* Om symbol */}
            <text x="100" y="105" textAnchor="middle" fontSize="16" fill="#F59E0B" fontWeight="bold">ॐ</text>
            
            {/* Mouth indicating chanting */}
            <ellipse cx="100" cy="85" rx="3" ry="2" fill="#F59E0B" />
          </svg>
        );

      case 'visualization':
      case 'light meditation':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="lightGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
            </defs>
            
            {/* Light rays */}
            <g transform="translate(100,100)">
              <line x1="0" y1="-60" x2="0" y2="-80" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="42" y1="-42" x2="56" y2="-56" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="60" y1="0" x2="80" y2="0" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="42" y1="42" x2="56" y2="56" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="60" x2="0" y2="80" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="-42" y1="42" x2="-56" y2="56" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="-60" y1="0" x2="-80" y2="0" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="-42" y1="-42" x2="-56" y2="-56" stroke="#FBBF24" strokeWidth="3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="8s" repeatCount="indefinite" />
              </line>
            </g>
            
            {/* Central light */}
            <circle cx="100" cy="100" r="30" fill="url(#lightGradient)" opacity="0.9">
              <animate attributeName="r" values="25;35;25" dur="4s" repeatCount="indefinite" />
            </circle>
            
            {/* Meditating figure */}
            <circle cx="100" cy="90" r="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
            <ellipse cx="100" cy="110" rx="15" ry="20" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />
          </svg>
        );

      case 'walking meditation':
      case 'movement meditation':
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Path */}
            <path d="M 30 170 Q 100 120 170 170" stroke="#10B981" strokeWidth="4" fill="none" opacity="0.6" />
            <path d="M 30 170 Q 100 120 170 170" stroke="#10B981" strokeWidth="2" fill="none" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
            </path>
            
            {/* Walking figure */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="30,170;100,145;170,170;100,145;30,170" dur="8s" repeatCount="indefinite" />
              
              {/* Head */}
              <circle cx="0" cy="-25" r="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
              
              {/* Body */}
              <ellipse cx="0" cy="-5" rx="6" ry="15" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />
              
              {/* Arms */}
              <line x1="-6" y1="-10" x2="-12" y2="0" stroke="#64748B" strokeWidth="2">
                <animate attributeName="x2" values="-12;-8;-12" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="6" y1="-10" x2="12" y2="0" stroke="#64748B" strokeWidth="2">
                <animate attributeName="x2" values="12;8;12" dur="1s" repeatCount="indefinite" />
              </line>
              
              {/* Legs */}
              <line x1="0" y1="10" x2="-5" y2="20" stroke="#64748B" strokeWidth="2">
                <animate attributeName="x2" values="-5;5;-5" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="10" x2="5" y2="20" stroke="#64748B" strokeWidth="2">
                <animate attributeName="x2" values="5;-5;5" dur="1s" repeatCount="indefinite" />
              </line>
            </g>
            
            {/* Mindfulness indicators */}
            <circle cx="50" cy="50" r="3" fill="#10B981" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="60" r="3" fill="#10B981" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="40" r="3" fill="#10B981" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      default:
        return (
          <svg className={baseClass} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="defaultGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F3E8FF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </radialGradient>
            </defs>
            
            {/* Lotus position */}
            <ellipse cx="100" cy="130" rx="40" ry="20" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            <ellipse cx="100" cy="110" rx="25" ry="35" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            
            {/* Meditation aura */}
            <circle cx="100" cy="100" r="60" fill="url(#defaultGradient)" opacity="0.3">
              <animate attributeName="r" values="55;65;55" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            
            {/* Third eye */}
            <circle cx="100" cy="65" r="3" fill="#8B5CF6" opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            
            {/* Arms in mudra position */}
            <ellipse cx="75" cy="100" rx="8" ry="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
            <ellipse cx="125" cy="100" rx="8" ry="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
          </svg>
        );
    }
  };

  return (
    <div className="flex justify-center items-center">
      {getIllustration()}
    </div>
  );
};