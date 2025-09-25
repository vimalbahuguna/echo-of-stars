import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FemaleBodyAnimation from './FemaleBodyAnimation';
import EnhancedPranayamaAnimations from './EnhancedPranayamaAnimations';

interface BreathingAnimationProps {
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  timings: {
    inhale: number;
    hold?: number;
    exhale: number;
    rounds?: string;
    totalDuration?: string;
  };
  onPhaseChange?: (phase: 'inhale' | 'hold' | 'exhale' | 'pause') => void;
  showFemaleBody?: boolean;
}

const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  type,
  level,
  isActive,
  timings,
  onPhaseChange,
  showFemaleBody = true
}) => {
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
  const [cycleCount, setCycleCount] = useState(0);
  const [bodyPartFocus, setBodyPartFocus] = useState<{ bodyPart: string; instruction: string }>({ bodyPart: '', instruction: '' });

  useEffect(() => {
    if (!isActive) {
      setCurrentPhase('pause');
      setCycleCount(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    
    const runCycle = () => {
      // Inhale phase
      setCurrentPhase('inhale');
      onPhaseChange?.('inhale');
      
      timeoutId = setTimeout(() => {
        // Hold phase (if applicable)
        if (timings.hold && timings.hold > 0) {
          setCurrentPhase('hold');
          onPhaseChange?.('hold');
          
          timeoutId = setTimeout(() => {
            // Exhale phase
            setCurrentPhase('exhale');
            onPhaseChange?.('exhale');
            
            timeoutId = setTimeout(() => {
              setCycleCount(prev => prev + 1);
              // Small pause between cycles
              setCurrentPhase('pause');
              onPhaseChange?.('pause');
              
              timeoutId = setTimeout(() => {
                runCycle();
              }, 500);
            }, timings.exhale * 1000);
          }, timings.hold * 1000);
        } else {
          // Direct to exhale if no hold
          setCurrentPhase('exhale');
          onPhaseChange?.('exhale');
          
          timeoutId = setTimeout(() => {
            setCycleCount(prev => prev + 1);
            setCurrentPhase('pause');
            onPhaseChange?.('pause');
            
            timeoutId = setTimeout(() => {
              runCycle();
            }, 500);
          }, timings.exhale * 1000);
        }
      }, timings.inhale * 1000);
    };

    runCycle();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, timings, onPhaseChange]);

  const getAnimationVariants = () => {
    const baseScale = 0.8;
    const maxScale = 1.8;
    
    switch (type) {
      case 'Anulom Vilom':
      case 'Nadi Shodhana':
      case 'Surya Bhedana':
      case 'Chandra Bhedana':
        return {
          inhale: { 
            scale: maxScale, 
            rotate: 0,
            filter: 'brightness(1.3) saturate(1.4) hue-rotate(0deg)',
            boxShadow: '0 0 70px rgba(59, 130, 246, 0.7), 0 0 140px rgba(59, 130, 246, 0.4)'
          },
          hold: { 
            scale: maxScale, 
            rotate: 180,
            filter: 'brightness(1.5) saturate(1.6) hue-rotate(90deg)',
            boxShadow: '0 0 90px rgba(147, 51, 234, 0.8), 0 0 180px rgba(147, 51, 234, 0.5)'
          },
          exhale: { 
            scale: baseScale + 0.3, 
            rotate: 360,
            filter: 'brightness(1.2) saturate(1.3) hue-rotate(180deg)',
            boxShadow: '0 0 50px rgba(249, 115, 22, 0.6), 0 0 100px rgba(249, 115, 22, 0.3)'
          },
          pause: { 
            scale: baseScale + 0.3, 
            rotate: 360,
            filter: 'brightness(1.0) saturate(1.1) hue-rotate(270deg)',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)'
          }
        };
      
      case 'Kapalbhati':
        return {
          inhale: { 
            scale: baseScale + 0.7, 
            rotate: 0,
            filter: 'brightness(1.2) saturate(1.3)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.6)'
          },
          hold: { 
            scale: baseScale + 0.7, 
            rotate: 0,
            filter: 'brightness(1.2) saturate(1.3)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.6)'
          },
          exhale: { 
            scale: maxScale + 0.2, 
            rotate: 0,
            filter: 'brightness(1.4) saturate(1.5) hue-rotate(45deg)',
            boxShadow: '0 0 80px rgba(249, 115, 22, 0.8), 0 0 160px rgba(249, 115, 22, 0.5)'
          },
          pause: { 
            scale: baseScale + 0.1, 
            rotate: 0,
            filter: 'brightness(1.1) saturate(1.2)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)'
          }
        };
      
      case 'Bhastrika':
        return {
          inhale: { 
            scale: maxScale + 0.2, 
            rotate: 5,
            filter: 'brightness(1.4) saturate(1.5) hue-rotate(15deg)',
            boxShadow: '0 0 100px rgba(239, 68, 68, 0.7), 0 0 200px rgba(239, 68, 68, 0.4)'
          },
          hold: { 
            scale: maxScale + 0.2, 
            rotate: 0,
            filter: 'brightness(1.6) saturate(1.7) hue-rotate(30deg)',
            boxShadow: '0 0 120px rgba(239, 68, 68, 0.8), 0 0 240px rgba(239, 68, 68, 0.5)'
          },
          exhale: { 
            scale: baseScale - 0.2, 
            rotate: -5,
            filter: 'brightness(1.3) saturate(1.4) hue-rotate(45deg)',
            boxShadow: '0 0 80px rgba(249, 115, 22, 0.7), 0 0 160px rgba(249, 115, 22, 0.4)'
          },
          pause: { 
            scale: baseScale, 
            rotate: 0,
            filter: 'brightness(1.0) saturate(1.1)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)'
          }
        };
      
      case 'Bhramari':
        return {
          inhale: { 
            scale: maxScale - 0.2, 
            rotate: [0, 10, -10, 0],
            filter: 'brightness(1.3) saturate(1.4) hue-rotate(60deg)',
            boxShadow: '0 0 70px rgba(251, 191, 36, 0.7), 0 0 140px rgba(251, 191, 36, 0.4)'
          },
          hold: { 
            scale: maxScale - 0.2, 
            rotate: [0, 5, -5, 0],
            filter: 'brightness(1.5) saturate(1.6) hue-rotate(75deg)',
            boxShadow: '0 0 90px rgba(251, 191, 36, 0.8), 0 0 180px rgba(251, 191, 36, 0.5)'
          },
          exhale: { 
            scale: baseScale + 0.4, 
            rotate: [0, -10, 10, 0],
            filter: 'brightness(1.2) saturate(1.3) hue-rotate(90deg)',
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)'
          },
          pause: { 
            scale: baseScale + 0.4, 
            rotate: 0,
            filter: 'brightness(1.0) saturate(1.1) hue-rotate(105deg)',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.5), 0 0 80px rgba(251, 191, 36, 0.3)'
          }
        };
      
      case 'Ujjayi':
        return {
          inhale: { 
            scale: maxScale - 0.1, 
            opacity: [0.7, 1, 0.7],
            filter: 'brightness(1.3) saturate(1.4) hue-rotate(200deg)',
            boxShadow: '0 0 80px rgba(6, 182, 212, 0.7), 0 0 160px rgba(6, 182, 212, 0.4)'
          },
          hold: { 
            scale: maxScale - 0.1, 
            opacity: 1,
            filter: 'brightness(1.5) saturate(1.6) hue-rotate(220deg)',
            boxShadow: '0 0 100px rgba(6, 182, 212, 0.8), 0 0 200px rgba(6, 182, 212, 0.5)'
          },
          exhale: { 
            scale: baseScale + 0.5, 
            opacity: [1, 0.7, 1],
            filter: 'brightness(1.2) saturate(1.3) hue-rotate(240deg)',
            boxShadow: '0 0 70px rgba(6, 182, 212, 0.6), 0 0 140px rgba(6, 182, 212, 0.3)'
          },
          pause: { 
            scale: baseScale + 0.4, 
            opacity: 0.7,
            filter: 'brightness(1.0) saturate(1.1) hue-rotate(260deg)',
            boxShadow: '0 0 50px rgba(6, 182, 212, 0.5), 0 0 100px rgba(6, 182, 212, 0.3)'
          }
        };
      
      default:
        return {
          inhale: { 
            scale: maxScale, 
            rotate: 0,
            filter: 'brightness(1.2) saturate(1.3) hue-rotate(0deg) blur(0px)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.6), 0 0 120px rgba(59, 130, 246, 0.3)'
          },
          hold: { 
            scale: maxScale, 
            rotate: 0,
            filter: 'brightness(1.4) saturate(1.5) hue-rotate(45deg) blur(0px)',
            boxShadow: '0 0 80px rgba(147, 51, 234, 0.7), 0 0 160px rgba(147, 51, 234, 0.4)'
          },
          exhale: { 
            scale: baseScale + 0.2, 
            rotate: 0,
            filter: 'brightness(1.1) saturate(1.2) hue-rotate(90deg) blur(1px)',
            boxShadow: '0 0 40px rgba(249, 115, 22, 0.5), 0 0 80px rgba(249, 115, 22, 0.2)'
          },
          pause: { 
            scale: baseScale + 0.2, 
            rotate: 0,
            filter: 'brightness(0.9) saturate(1.0) hue-rotate(120deg) blur(2px)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)'
          }
        };
    }
  };

  const variants = getAnimationVariants();
  const currentVariant = variants[currentPhase];

  const getTransitionDuration = () => {
    switch (currentPhase) {
      case 'inhale':
        return timings.inhale;
      case 'hold':
        return timings.hold || 0;
      case 'exhale':
        return timings.exhale;
      default:
        return 0.5;
    }
  };

  const getBreathingCircleColor = () => {
    const pranayamaColors = {
      'Nadi Shodhana': {
        inhale: 'from-blue-600 via-indigo-500 to-blue-400',
        hold: 'from-purple-600 via-violet-500 to-purple-400',
        exhale: 'from-orange-600 via-amber-500 to-orange-400',
        pause: 'from-green-600 via-emerald-500 to-green-400'
      },
      'Anulom Vilom': {
        inhale: 'from-blue-600 via-indigo-500 to-blue-400',
        hold: 'from-purple-600 via-violet-500 to-purple-400',
        exhale: 'from-orange-600 via-amber-500 to-orange-400',
        pause: 'from-green-600 via-emerald-500 to-green-400'
      },
      'Kapalbhati': {
        inhale: 'from-sky-600 via-blue-500 to-sky-400',
        hold: 'from-sky-600 via-blue-500 to-sky-400',
        exhale: 'from-red-600 via-orange-500 to-red-400',
        pause: 'from-teal-600 via-cyan-500 to-teal-400'
      },
      'Bhastrika': {
        inhale: 'from-red-600 via-rose-500 to-red-400',
        hold: 'from-red-700 via-rose-600 to-red-500',
        exhale: 'from-orange-600 via-amber-500 to-orange-400',
        pause: 'from-emerald-600 via-green-500 to-emerald-400'
      },
      'Bhramari': {
        inhale: 'from-yellow-600 via-amber-500 to-yellow-400',
        hold: 'from-yellow-700 via-amber-600 to-yellow-500',
        exhale: 'from-yellow-600 via-amber-500 to-yellow-400',
        pause: 'from-yellow-500 via-amber-400 to-yellow-300'
      },
      'Ujjayi': {
        inhale: 'from-cyan-600 via-teal-500 to-cyan-400',
        hold: 'from-cyan-700 via-teal-600 to-cyan-500',
        exhale: 'from-cyan-600 via-teal-500 to-cyan-400',
        pause: 'from-cyan-500 via-teal-400 to-cyan-300'
      }
    };

    const typeColors = pranayamaColors[type as keyof typeof pranayamaColors];
    if (typeColors) {
      return typeColors[currentPhase as keyof typeof typeColors];
    }

    // Default colors
    switch (currentPhase) {
      case 'inhale':
        return 'from-blue-500 via-cyan-400 to-blue-300';
      case 'hold':
        return 'from-purple-500 via-pink-400 to-purple-300';
      case 'exhale':
        return 'from-orange-500 via-red-400 to-orange-300';
      default:
        return 'from-green-500 via-emerald-400 to-green-300';
    }
  };

  const renderNostrils = () => {
    if (!['Anulom Vilom', 'Nadi Shodhana', 'Surya Bhedana', 'Chandra Bhedana'].includes(type)) {
      return null;
    }

    const leftActive = type === 'Chandra Bhedana' || 
                     (type === 'Anulom Vilom' && cycleCount % 2 === 0) ||
                     (type === 'Nadi Shodhana' && currentPhase === 'inhale');
    
    const rightActive = type === 'Surya Bhedana' || 
                       (type === 'Anulom Vilom' && cycleCount % 2 === 1) ||
                       (type === 'Nadi Shodhana' && currentPhase === 'exhale');

    return (
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-12">
        <motion.div
          className={`w-6 h-6 rounded-full ${leftActive ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gradient-to-br from-gray-400 to-gray-300'} shadow-lg`}
          animate={{ 
            scale: leftActive ? 1.4 : 0.9, 
            opacity: leftActive ? 1 : 0.4,
            boxShadow: leftActive ? '0 0 20px rgba(59, 130, 246, 0.6)' : '0 0 5px rgba(107, 114, 128, 0.3)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <motion.div
          className={`w-6 h-6 rounded-full ${rightActive ? 'bg-gradient-to-br from-orange-500 to-red-400' : 'bg-gradient-to-br from-gray-400 to-gray-300'} shadow-lg`}
          animate={{ 
            scale: rightActive ? 1.4 : 0.9, 
            opacity: rightActive ? 1 : 0.4,
            boxShadow: rightActive ? '0 0 20px rgba(249, 115, 22, 0.6)' : '0 0 5px rgba(107, 114, 128, 0.3)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    );
  };

  // Enhanced aura rings system
  const renderAuraRings = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className={`absolute rounded-full border-2 bg-gradient-to-r ${getBreathingCircleColor()} opacity-30`}
            style={{
              width: `${200 + ring * 60}px`,
              height: `${200 + ring * 60}px`,
            }}
            animate={{
              rotate: currentPhase === 'inhale' ? 360 : currentPhase === 'hold' ? 180 : currentPhase === 'exhale' ? -360 : 0,
              scale: currentPhase === 'inhale' ? 1.2 : currentPhase === 'hold' ? 1.1 : currentPhase === 'exhale' ? 0.9 : 0.8,
              opacity: currentPhase === 'inhale' ? 0.6 : currentPhase === 'hold' ? 0.8 : currentPhase === 'exhale' ? 0.4 : 0.2
            }}
            transition={{
              duration: getTransitionDuration(),
              ease: "easeInOut",
              delay: ring * 0.1
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center overflow-hidden">
      {/* Enhanced gradient background */}
      <div className={`absolute inset-0 bg-gradient-radial ${getBreathingCircleColor()} opacity-20 blur-3xl`} />
      
      {/* Aura rings system */}
      {renderAuraRings()}
      
      {renderNostrils()}
      
      <motion.div
        className={`relative w-56 h-56 rounded-full bg-gradient-conic ${getBreathingCircleColor()} shadow-2xl flex items-center justify-center overflow-hidden`}
        animate={currentVariant}
        transition={{
          duration: getTransitionDuration(),
          ease: "easeInOut",
          repeat: Array.isArray(currentVariant.rotate) ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {/* Inner glow effect */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${getBreathingCircleColor()} opacity-60 blur-sm`} />
        
        {/* Enhanced Pranayama Animations Overlay */}
        <EnhancedPranayamaAnimations
          type={type}
          level={level}
          isActive={isActive}
          currentPhase={currentPhase}
          timings={timings}
          cycleCount={cycleCount}
        />
        
        <motion.div
          className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10"
          animate={{ 
            scale: currentPhase === 'inhale' ? 1.3 : currentPhase === 'exhale' ? 0.7 : 1 
          }}
          transition={{ duration: getTransitionDuration(), ease: "easeInOut" }}
        >
          <div className="text-white font-bold text-xl capitalize drop-shadow-2xl">
            {currentPhase}
          </div>
        </motion.div>
        
        {/* Center highlight */}
        <div className="absolute inset-1/4 rounded-full bg-white/20 backdrop-blur-sm" />
      </motion.div>

      {/* Enhanced particle system */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 20;
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full shadow-lg"
              style={{
                left: '50%',
                top: '50%',
                background: currentPhase === 'inhale' ? 'linear-gradient(45deg, #3b82f6, #06b6d4)' :
                           currentPhase === 'hold' ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' :
                           currentPhase === 'exhale' ? 'linear-gradient(45deg, #f97316, #ef4444)' :
                           'linear-gradient(45deg, #10b981, #059669)'
              }}
              animate={{
                x: currentPhase === 'inhale' ? x * 0.9 : currentPhase === 'hold' ? x * 1.1 : currentPhase === 'exhale' ? x * 0.7 : x * 0.5,
                y: currentPhase === 'inhale' ? y * 0.9 : currentPhase === 'hold' ? y * 1.1 : currentPhase === 'exhale' ? y * 0.7 : y * 0.5,
                scale: currentPhase === 'inhale' ? [0.6, 1.4, 0.9] : currentPhase === 'hold' ? [0.9, 1.2, 0.9] : currentPhase === 'exhale' ? [0.9, 0.5, 0.7] : [0.7, 0.4, 0.5],
                opacity: currentPhase === 'inhale' ? [0.4, 1.0, 0.7] : currentPhase === 'hold' ? [0.7, 1.0, 0.8] : currentPhase === 'exhale' ? [0.8, 0.5, 0.6] : [0.6, 0.3, 0.4],
                rotate: [0, 180, 360],
                boxShadow: currentPhase === 'inhale' ? '0 0 20px rgba(59, 130, 246, 0.7)' :
                          currentPhase === 'hold' ? '0 0 25px rgba(139, 92, 246, 0.8)' :
                          currentPhase === 'exhale' ? '0 0 15px rgba(249, 115, 22, 0.6)' :
                          '0 0 10px rgba(16, 185, 129, 0.5)'
              }}
              transition={{
                duration: getTransitionDuration(),
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Enhanced breathing particles for additional visual effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{
                  left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 16)}%`,
                  top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 16)}%`,
                  background: `linear-gradient(45deg, ${getBreathingCircleColor().replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`
                }}
                animate={{
                  scale: [0, 2.0, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 720],
                  boxShadow: [
                    '0 0 8px rgba(59, 130, 246, 0.4)',
                    '0 0 25px rgba(59, 130, 246, 0.9)',
                    '0 0 8px rgba(59, 130, 246, 0.4)'
                  ]
                }}
                transition={{
                  duration: getTransitionDuration(),
                  repeat: Infinity,
                  delay: i * 0.06,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced phase indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <motion.div
          className={`px-8 py-4 bg-gradient-to-r ${getBreathingCircleColor()} backdrop-blur-md rounded-full text-white text-xl font-bold shadow-2xl border border-white/20`}
          key={currentPhase}
          initial={{ opacity: 0, y: 30, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.1)'
          }}
        >
          {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </motion.div>
      </div>

      {/* Enhanced cycle counter */}
      <div className="absolute top-8 right-8">
        <motion.div
          className={`px-6 py-3 bg-gradient-to-r ${getBreathingCircleColor()} backdrop-blur-md rounded-full text-white text-lg font-bold shadow-xl border border-white/20`}
          key={cycleCount}
          initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          <motion.span
            animate={{ 
              textShadow: '0 0 15px rgba(255, 255, 255, 0.9)' 
            }}
            transition={{ duration: 0.4 }}
          >
            Cycle: {cycleCount}
          </motion.span>
        </motion.div>
      </div>

      {/* Female Body Animation */}
      {showFemaleBody && (
        <div className="absolute inset-0 flex items-center justify-center">
          <FemaleBodyAnimation
            type={type}
            level={level}
            phase={currentPhase}
            isActive={isActive}
            onBodyPartFocus={(bodyPart, instruction) => {
              setBodyPartFocus({ bodyPart, instruction });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BreathingAnimation;