import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FemaleBodyAnimationProps {
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  phase: 'inhale' | 'hold' | 'exhale' | 'pause' | 'introduction' | 'completion';
  isActive: boolean;
  onBodyPartFocus?: (bodyPart: string, instruction: string) => void;
}

const FemaleBodyAnimation: React.FC<FemaleBodyAnimationProps> = ({
  type,
  level,
  phase,
  isActive,
  onBodyPartFocus
}) => {
  const [focusedBodyPart, setFocusedBodyPart] = useState<string>('');
  const [breathingIntensity, setBreathingIntensity] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const bodyPartInstructions = getBodyPartInstructions(type, phase, level);
    setFocusedBodyPart(bodyPartInstructions.bodyPart);
    onBodyPartFocus?.(bodyPartInstructions.bodyPart, bodyPartInstructions.instruction);

    // Animate breathing intensity based on phase
    switch (phase) {
      case 'inhale':
        setBreathingIntensity(1);
        break;
      case 'hold':
        setBreathingIntensity(0.8);
        break;
      case 'exhale':
        setBreathingIntensity(0.2);
        break;
      case 'pause':
        setBreathingIntensity(0.5);
        break;
      default:
        setBreathingIntensity(0.5);
    }
  }, [type, phase, level, isActive, onBodyPartFocus]);

  const getBodyPartInstructions = (pranayamaType: string, currentPhase: string, currentLevel: string) => {
    const instructions: Record<string, Record<string, { bodyPart: string; instruction: string }>> = {
      'Anulom Vilom': {
        inhale: { bodyPart: 'left-nostril', instruction: 'Focus on your left nostril. Feel the cool air entering slowly and steadily.' },
        hold: { bodyPart: 'chest', instruction: 'Feel your chest gently expanded. Hold the breath comfortably without strain.' },
        exhale: { bodyPart: 'right-nostril', instruction: 'Release through your right nostril. Feel the warm air leaving your body.' },
        pause: { bodyPart: 'heart', instruction: 'Rest in the natural pause. Feel the balance in your heart center.' }
      },
      'Kapalbhati': {
        inhale: { bodyPart: 'diaphragm', instruction: 'Allow natural inhalation. Your diaphragm moves down gently.' },
        exhale: { bodyPart: 'abdomen', instruction: 'Contract your abdominal muscles sharply. Feel the navel pull in towards the spine.' },
        pause: { bodyPart: 'solar-plexus', instruction: 'Feel the energy building in your solar plexus. Prepare for the next round.' }
      },
      'Bhastrika': {
        inhale: { bodyPart: 'lungs', instruction: 'Fill your lungs completely. Feel your ribcage expanding in all directions.' },
        exhale: { bodyPart: 'abdomen', instruction: 'Forceful exhalation from your core. Feel the power from your abdominal muscles.' },
        pause: { bodyPart: 'spine', instruction: 'Feel the energy rising along your spine. Maintain your strong posture.' }
      },
      'Nadi Shodhana': {
        inhale: { bodyPart: 'active-nostril', instruction: 'Breathe through the open nostril. Feel the prana entering your system.' },
        hold: { bodyPart: 'third-eye', instruction: 'Hold the breath at your third eye center. Feel the energy balancing.' },
        exhale: { bodyPart: 'opposite-nostril', instruction: 'Release through the opposite nostril. Feel the energy flowing across.' },
        pause: { bodyPart: 'brain', instruction: 'Feel the balance between the left and right hemispheres of your brain.' }
      },
      'Bhramari': {
        inhale: { bodyPart: 'throat', instruction: 'Breathe in through your throat. Prepare for the humming sound.' },
        exhale: { bodyPart: 'head', instruction: 'Create the humming sound. Feel the vibrations in your head and skull.' },
        pause: { bodyPart: 'ears', instruction: 'Listen to the inner sound. Feel the resonance in your ears.' }
      },
      'Ujjayi': {
        inhale: { bodyPart: 'throat', instruction: 'Constrict your throat slightly. Create the ocean-like sound on inhalation.' },
        exhale: { bodyPart: 'throat', instruction: 'Maintain the throat constriction. Feel the soothing sound on exhalation.' },
        pause: { bodyPart: 'heart', instruction: 'Feel the calming effect on your nervous system and heart.' }
      },
      'Sitali': {
        inhale: { bodyPart: 'tongue', instruction: 'Curl your tongue into a tube. Feel the cool air entering through your tongue.' },
        exhale: { bodyPart: 'nose', instruction: 'Close your mouth and exhale through your nose. Feel the cooling effect.' },
        pause: { bodyPart: 'body', instruction: 'Feel the cooling sensation spreading throughout your entire body.' }
      },
      'Sitkari': {
        inhale: { bodyPart: 'teeth', instruction: 'Part your lips slightly. Inhale through the gap between your teeth.' },
        exhale: { bodyPart: 'nose', instruction: 'Close your mouth and exhale through your nose. Feel the cooling breath.' },
        pause: { bodyPart: 'mouth', instruction: 'Feel the refreshing sensation in your mouth and throat.' }
      },
      'Surya Bhedana': {
        inhale: { bodyPart: 'right-nostril', instruction: 'Breathe in through your right nostril. Feel the warming solar energy.' },
        exhale: { bodyPart: 'left-nostril', instruction: 'Exhale through your left nostril. Balance the solar energy with lunar cooling.' },
        pause: { bodyPart: 'solar-plexus', instruction: 'Feel the warmth and energy in your solar plexus region.' }
      },
      'Chandra Bhedana': {
        inhale: { bodyPart: 'left-nostril', instruction: 'Breathe in through your left nostril. Feel the cooling lunar energy.' },
        exhale: { bodyPart: 'right-nostril', instruction: 'Exhale through your right nostril. Balance the lunar energy with solar warmth.' },
        pause: { bodyPart: 'heart', instruction: 'Feel the cooling, calming effect in your heart center.' }
      }
    };

    return instructions[pranayamaType]?.[currentPhase] || 
           { bodyPart: 'chest', instruction: 'Focus on your natural breath and maintain awareness.' };
  };

  const getBodyPartColor = (bodyPart: string) => {
    if (!isActive) return '#e2e8f0';
    
    const colors: Record<string, string> = {
      'left-nostril': '#3b82f6',
      'right-nostril': '#ef4444',
      'chest': '#10b981',
      'abdomen': '#f59e0b',
      'diaphragm': '#8b5cf6',
      'lungs': '#06b6d4',
      'heart': '#ec4899',
      'throat': '#6366f1',
      'third-eye': '#7c3aed',
      'brain': '#a855f7',
      'spine': '#059669',
      'solar-plexus': '#f59e0b',
      'active-nostril': '#3b82f6',
      'opposite-nostril': '#ef4444',
      'head': '#8b5cf6',
      'ears': '#6366f1',
      'tongue': '#ec4899',
      'teeth': '#f3f4f6',
      'nose': '#64748b',
      'mouth': '#f472b6',
      'body': '#10b981'
    };

    return focusedBodyPart === bodyPart ? colors[bodyPart] || '#3b82f6' : '#e2e8f0';
  };

  const getBreathingAnimation = () => {
    const baseScale = 1;
    const breathScale = 1 + (breathingIntensity * 0.1);
    
    return {
      scale: breathScale,
      transition: {
        duration: phase === 'inhale' ? 3 : phase === 'exhale' ? 4 : 1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg p-4">
      <motion.div
        className="relative"
        animate={getBreathingAnimation()}
      >
        <svg
          width="300"
          height="500"
          viewBox="0 0 300 500"
          className="drop-shadow-lg"
        >
          {/* Female Body Outline */}
          <motion.path
            d="M150 50 C140 45, 130 50, 125 60 C120 70, 125 80, 130 85 L135 90 C140 95, 145 100, 150 105 C155 100, 160 95, 165 90 L170 85 C175 80, 180 70, 175 60 C170 50, 160 45, 150 50 Z"
            fill={getBodyPartColor('head')}
            stroke="#374151"
            strokeWidth="2"
            animate={{
              fill: getBodyPartColor('head'),
              scale: focusedBodyPart === 'head' ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Neck */}
          <motion.rect
            x="145"
            y="105"
            width="10"
            height="20"
            fill={getBodyPartColor('throat')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('throat'),
              scale: focusedBodyPart === 'throat' ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Shoulders and Arms */}
          <motion.ellipse
            cx="150"
            cy="140"
            rx="60"
            ry="15"
            fill={getBodyPartColor('chest')}
            stroke="#374151"
            strokeWidth="2"
            animate={{
              fill: getBodyPartColor('chest'),
              ry: focusedBodyPart === 'chest' ? 18 : 15
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Chest/Lungs Area */}
          <motion.ellipse
            cx="150"
            cy="170"
            rx="45"
            ry="35"
            fill={getBodyPartColor('lungs')}
            stroke="#374151"
            strokeWidth="2"
            animate={{
              fill: getBodyPartColor('lungs'),
              rx: focusedBodyPart === 'lungs' ? 50 : 45,
              ry: focusedBodyPart === 'lungs' ? 40 : 35
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Heart Center */}
          <motion.circle
            cx="145"
            cy="165"
            r="8"
            fill={getBodyPartColor('heart')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('heart'),
              r: focusedBodyPart === 'heart' ? 12 : 8,
              opacity: focusedBodyPart === 'heart' ? 1 : 0.7
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Diaphragm */}
          <motion.ellipse
            cx="150"
            cy="205"
            rx="40"
            ry="8"
            fill={getBodyPartColor('diaphragm')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('diaphragm'),
              ry: focusedBodyPart === 'diaphragm' ? 12 : 8,
              cy: phase === 'inhale' ? 210 : phase === 'exhale' ? 200 : 205
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Abdomen */}
          <motion.ellipse
            cx="150"
            cy="250"
            rx="35"
            ry="40"
            fill={getBodyPartColor('abdomen')}
            stroke="#374151"
            strokeWidth="2"
            animate={{
              fill: getBodyPartColor('abdomen'),
              rx: focusedBodyPart === 'abdomen' ? 40 : 35,
              ry: phase === 'exhale' && (type === 'Kapalbhati' || type === 'Bhastrika') ? 35 : 40
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Solar Plexus */}
          <motion.circle
            cx="150"
            cy="220"
            r="6"
            fill={getBodyPartColor('solar-plexus')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('solar-plexus'),
              r: focusedBodyPart === 'solar-plexus' ? 10 : 6,
              opacity: focusedBodyPart === 'solar-plexus' ? 1 : 0.6
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Spine */}
          <motion.line
            x1="150"
            y1="125"
            x2="150"
            y2="290"
            stroke={getBodyPartColor('spine')}
            strokeWidth={focusedBodyPart === 'spine' ? "4" : "2"}
            animate={{
              stroke: getBodyPartColor('spine'),
              opacity: focusedBodyPart === 'spine' ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Nostrils */}
          <motion.circle
            cx="145"
            cy="75"
            r="3"
            fill={getBodyPartColor('left-nostril')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('left-nostril'),
              r: focusedBodyPart === 'left-nostril' || focusedBodyPart === 'active-nostril' ? 5 : 3,
              opacity: focusedBodyPart === 'left-nostril' || focusedBodyPart === 'active-nostril' ? 1 : 0.7
            }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.circle
            cx="155"
            cy="75"
            r="3"
            fill={getBodyPartColor('right-nostril')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('right-nostril'),
              r: focusedBodyPart === 'right-nostril' || focusedBodyPart === 'opposite-nostril' ? 5 : 3,
              opacity: focusedBodyPart === 'right-nostril' || focusedBodyPart === 'opposite-nostril' ? 1 : 0.7
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Third Eye */}
          <motion.circle
            cx="150"
            cy="60"
            r="4"
            fill={getBodyPartColor('third-eye')}
            stroke="#374151"
            strokeWidth="1"
            animate={{
              fill: getBodyPartColor('third-eye'),
              r: focusedBodyPart === 'third-eye' ? 7 : 4,
              opacity: focusedBodyPart === 'third-eye' ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Legs */}
          <motion.ellipse
            cx="135"
            cy="350"
            rx="15"
            ry="60"
            fill="#f1f5f9"
            stroke="#374151"
            strokeWidth="2"
          />
          
          <motion.ellipse
            cx="165"
            cy="350"
            rx="15"
            ry="60"
            fill="#f1f5f9"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Breathing Flow Visualization */}
          <AnimatePresence>
            {isActive && phase === 'inhale' && (
              <motion.circle
                cx="150"
                cy="75"
                r="2"
                fill="#3b82f6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0],
                  cy: [75, 170, 250]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {isActive && phase === 'exhale' && (
              <motion.circle
                cx="150"
                cy="250"
                r="2"
                fill="#ef4444"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0],
                  cy: [250, 170, 75]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
      
      {/* Body Part Focus Indicator */}
      <motion.div
        className="mt-4 p-3 bg-white rounded-lg shadow-md max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-sm font-medium text-gray-700 mb-1">
          Focus Area: {focusedBodyPart.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="text-xs text-gray-500">
          {getBodyPartInstructions(type, phase, level).instruction}
        </div>
      </motion.div>
      
      {/* Breathing Phase Indicator */}
      <motion.div
        className="mt-2 px-4 py-2 rounded-full text-sm font-medium"
        animate={{
          backgroundColor: phase === 'inhale' ? '#dbeafe' : 
                          phase === 'hold' ? '#fef3c7' : 
                          phase === 'exhale' ? '#fee2e2' : '#f3f4f6',
          color: phase === 'inhale' ? '#1e40af' : 
                 phase === 'hold' ? '#92400e' : 
                 phase === 'exhale' ? '#dc2626' : '#374151'
        }}
        transition={{ duration: 0.3 }}
      >
        {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
      </motion.div>
    </div>
  );
};

export default FemaleBodyAnimation;