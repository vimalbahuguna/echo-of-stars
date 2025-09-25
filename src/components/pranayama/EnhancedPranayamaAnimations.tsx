import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedPranayamaAnimationsProps {
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'pause';
  timings: {
    inhale: number;
    hold?: number;
    exhale: number;
    rounds?: string;
    totalDuration?: string;
  };
  cycleCount: number;
}

const EnhancedPranayamaAnimations: React.FC<EnhancedPranayamaAnimationsProps> = ({
  type,
  level,
  isActive,
  currentPhase,
  timings,
  cycleCount
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate particles for enhanced visual effects
    const particleCount = level === 'beginner' ? 6 : level === 'intermediate' ? 8 : 12;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: 50 + 35 * Math.cos((i * Math.PI * 2) / particleCount),
      y: 50 + 35 * Math.sin((i * Math.PI * 2) / particleCount),
      delay: i * 0.1
    }));
    setParticles(newParticles);
  }, [level]);

  const getAnimationConfig = () => {
    const configs = {
      'Anulom Vilom': {
        colors: {
          inhale: 'from-blue-500 via-indigo-400 to-purple-500',
          hold: 'from-purple-500 via-pink-400 to-rose-500',
          exhale: 'from-orange-500 via-amber-400 to-yellow-500',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: currentPhase === 'inhale' ? 'bg-blue-400' : currentPhase === 'exhale' ? 'bg-orange-400' : 'bg-purple-400',
        specialEffect: 'nostril-flow'
      },
      'Kapalbhati': {
        colors: {
          inhale: 'from-emerald-400 to-teal-500',
          hold: 'from-teal-500 to-cyan-500',
          exhale: 'from-red-500 via-orange-500 to-yellow-500',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: currentPhase === 'exhale' ? 'bg-red-500' : 'bg-emerald-400',
        specialEffect: 'rapid-pulse'
      },
      'Bhastrika': {
        colors: {
          inhale: 'from-red-600 via-orange-500 to-yellow-400',
          hold: 'from-yellow-400 via-amber-500 to-orange-600',
          exhale: 'from-orange-600 via-red-500 to-pink-500',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-red-500',
        specialEffect: 'fire-bellows'
      },
      'Bhramari': {
        colors: {
          inhale: 'from-yellow-400 via-amber-400 to-orange-400',
          hold: 'from-orange-400 via-yellow-500 to-amber-500',
          exhale: 'from-amber-500 via-yellow-400 to-orange-400',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-yellow-400',
        specialEffect: 'humming-vibration'
      },
      'Ujjayi': {
        colors: {
          inhale: 'from-blue-600 via-indigo-500 to-purple-600',
          hold: 'from-purple-600 via-indigo-500 to-blue-600',
          exhale: 'from-blue-600 via-cyan-500 to-teal-600',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-blue-500',
        specialEffect: 'ocean-wave'
      },
      'Sitali': {
        colors: {
          inhale: 'from-cyan-400 via-blue-300 to-indigo-400',
          hold: 'from-indigo-400 via-blue-300 to-cyan-400',
          exhale: 'from-blue-300 via-cyan-300 to-teal-300',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-cyan-400',
        specialEffect: 'cooling-mist'
      },
      'Sitkari': {
        colors: {
          inhale: 'from-teal-400 via-cyan-300 to-blue-400',
          hold: 'from-blue-400 via-cyan-300 to-teal-400',
          exhale: 'from-cyan-300 via-teal-300 to-green-300',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-teal-400',
        specialEffect: 'hissing-cool'
      },
      'Nadi Shodhana': {
        colors: {
          inhale: 'from-violet-500 via-purple-400 to-indigo-500',
          hold: 'from-indigo-500 via-blue-400 to-cyan-500',
          exhale: 'from-cyan-500 via-teal-400 to-emerald-500',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: currentPhase === 'inhale' ? 'bg-violet-400' : 'bg-emerald-400',
        specialEffect: 'channel-purification'
      },
      'Surya Bhedana': {
        colors: {
          inhale: 'from-red-500 via-orange-400 to-yellow-500',
          hold: 'from-yellow-500 via-orange-400 to-red-500',
          exhale: 'from-orange-400 via-amber-400 to-yellow-400',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-orange-500',
        specialEffect: 'solar-energy'
      },
      'Chandra Bhedana': {
        colors: {
          inhale: 'from-blue-400 via-indigo-300 to-purple-400',
          hold: 'from-purple-400 via-indigo-300 to-blue-400',
          exhale: 'from-indigo-300 via-blue-300 to-cyan-300',
          pause: 'from-gray-400 to-slate-500'
        },
        particleColor: 'bg-blue-400',
        specialEffect: 'lunar-energy'
      }
    };

    return configs[type as keyof typeof configs] || configs['Anulom Vilom'];
  };

  const config = getAnimationConfig();

  const renderSpecialEffects = () => {
    switch (config.specialEffect) {
      case 'nostril-flow':
        return (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
            <motion.div
              className="w-4 h-12 rounded-full bg-gradient-to-b from-blue-400 to-transparent"
              animate={{
                opacity: currentPhase === 'inhale' && cycleCount % 2 === 0 ? 1 : 0.3,
                scaleY: currentPhase === 'inhale' && cycleCount % 2 === 0 ? 1.5 : 1
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="w-4 h-12 rounded-full bg-gradient-to-b from-orange-400 to-transparent"
              animate={{
                opacity: currentPhase === 'exhale' && cycleCount % 2 === 1 ? 1 : 0.3,
                scaleY: currentPhase === 'exhale' && cycleCount % 2 === 1 ? 1.5 : 1
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        );

      case 'rapid-pulse':
        return (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{
              scale: currentPhase === 'exhale' ? [1, 1.3, 1] : 1,
              opacity: currentPhase === 'exhale' ? [0.8, 0.3, 0.8] : 0.5
            }}
            transition={{
              duration: currentPhase === 'exhale' ? 0.3 : 1,
              repeat: currentPhase === 'exhale' ? Infinity : 0
            }}
          />
        );

      case 'fire-bellows':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-red-500 rounded-full"
                style={{
                  left: `${50 + 25 * Math.cos((i * Math.PI * 2) / 6)}%`,
                  top: `${50 + 25 * Math.sin((i * Math.PI * 2) / 6)}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );

      case 'humming-vibration':
        return (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: currentPhase === 'exhale' ? 
                ['0 0 20px rgba(251, 191, 36, 0.5)', '0 0 40px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 0.5)'] :
                '0 0 10px rgba(251, 191, 36, 0.3)'
            }}
            transition={{
              duration: 0.5,
              repeat: currentPhase === 'exhale' ? Infinity : 0
            }}
          />
        );

      case 'ocean-wave':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: timings.inhale + timings.exhale,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        );

      case 'cooling-mist':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-300 rounded-full opacity-60"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.6, 0.2, 0.6],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'solar-energy':
        return (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: currentPhase === 'inhale' ? 
                'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)' :
                'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)'
            }}
            transition={{ duration: 0.5 }}
          />
        );

      case 'lunar-energy':
        return (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: currentPhase === 'inhale' ? 
                'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)' :
                'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)'
            }}
            transition={{ duration: 0.5 }}
          />
        );

      default:
        return null;
    }
  };

  const renderEnhancedParticles = () => {
    if (!isActive) return null;

    return (
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-3 h-3 rounded-full ${config.particleColor} shadow-lg`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: currentPhase === 'inhale' ? [0, 1.2, 0.8] : currentPhase === 'exhale' ? [0.8, 0.4, 0] : [0.6, 0.8, 0.6],
              opacity: currentPhase === 'pause' ? 0.3 : [0.7, 1, 0.7],
              rotate: [0, 180, 360],
              boxShadow: [
                '0 0 10px rgba(255, 255, 255, 0.5)',
                '0 0 20px rgba(255, 255, 255, 0.8)',
                '0 0 10px rgba(255, 255, 255, 0.5)'
              ]
            }}
            transition={{
              duration: currentPhase === 'inhale' ? timings.inhale : 
                        currentPhase === 'hold' ? timings.hold || 1 :
                        currentPhase === 'exhale' ? timings.exhale : 1,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            exit={{ scale: 0, opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    );
  };

  const renderPhaseIndicator = () => {
    const phaseColors = {
      inhale: 'text-blue-400',
      hold: 'text-purple-400',
      exhale: 'text-orange-400',
      pause: 'text-gray-400'
    };

    return (
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      >
        <div className={`text-lg font-bold ${phaseColors[currentPhase]} drop-shadow-lg`}>
          {currentPhase.toUpperCase()}
        </div>
        <div className="text-sm text-gray-300 mt-1">
          {type}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {renderSpecialEffects()}
      {renderEnhancedParticles()}
      {renderPhaseIndicator()}
      
      {/* Breathing rhythm visualization */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2"
        animate={{ opacity: isActive ? 1 : 0.3 }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-8 bg-gradient-to-t from-gray-400 to-white rounded-full"
            animate={{
              scaleY: currentPhase === 'inhale' && i < 2 ? 1.5 :
                     currentPhase === 'hold' && i === 2 ? 1.5 :
                     currentPhase === 'exhale' && i === 3 ? 1.5 : 1,
              opacity: currentPhase === 'inhale' && i < 2 ? 1 :
                      currentPhase === 'hold' && i === 2 ? 1 :
                      currentPhase === 'exhale' && i === 3 ? 1 : 0.4
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default EnhancedPranayamaAnimations;