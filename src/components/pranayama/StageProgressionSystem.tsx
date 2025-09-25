import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export interface StageDefinition {
  id: string;
  name: string;
  duration: number;
  description: string;
  instructions: {
    male: string;
    female: string;
  };
  bodyFocus: string[];
  breathingPattern?: {
    inhale?: number;
    hold?: number;
    exhale?: number;
  };
  transitionCue?: string;
}

export interface LevelConfiguration {
  beginner: {
    introduction: number;
    preparation: number;
    inhale: number;
    hold?: number;
    exhale: number;
    pause: number;
    rounds: number;
    completion: number;
  };
  intermediate: {
    introduction: number;
    preparation: number;
    inhale: number;
    hold?: number;
    exhale: number;
    pause: number;
    rounds: number;
    completion: number;
  };
  advanced: {
    introduction: number;
    preparation: number;
    inhale: number;
    hold?: number;
    exhale: number;
    pause: number;
    rounds: number;
    completion: number;
  };
}

interface StageProgressionSystemProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelConfig: LevelConfiguration;
  voiceGender: 'male' | 'female';
  isActive: boolean;
  onStageChange: (stage: StageDefinition, progress: number) => void;
  onRoundChange: (round: number) => void;
  onComplete: () => void;
  onVoiceInstruction: (instruction: string) => void;
}

const StageProgressionSystem: React.FC<StageProgressionSystemProps> = ({
  pranayamaType,
  level,
  levelConfig,
  voiceGender,
  isActive,
  onStageChange,
  onRoundChange,
  onComplete,
  onVoiceInstruction
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [stageElapsedTime, setStageElapsedTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentLevelConfig = levelConfig[level];

  // Generate stage definitions based on pranayama type and level
  const generateStages = useCallback((): StageDefinition[] => {
    const stages: StageDefinition[] = [];

    // Introduction stage
    stages.push({
      id: 'introduction',
      name: 'Introduction',
      duration: currentLevelConfig.introduction,
      description: `Welcome to ${pranayamaType} practice`,
      instructions: {
        male: `Welcome to ${pranayamaType} practice. As a ${level} practitioner, you'll follow a structured sequence designed for your experience level. Find your comfortable seated position with spine erect and shoulders relaxed. We'll begin with ${currentLevelConfig.rounds} rounds of mindful breathing.`,
        female: `Hello and welcome to your ${pranayamaType} session. I'm here to guide you through this beautiful practice tailored for ${level} level. Take a moment to settle into your comfortable position. We'll be practicing ${currentLevelConfig.rounds} complete rounds together.`
      },
      bodyFocus: ['posture', 'mind', 'breath_awareness'],
      transitionCue: 'Now let\'s prepare for the breathing practice'
    });

    // Preparation stage
    stages.push({
      id: 'preparation',
      name: 'Preparation',
      duration: currentLevelConfig.preparation,
      description: 'Prepare your body and mind for practice',
      instructions: {
        male: `Let's prepare. Sit with your spine naturally straight, shoulders soft and relaxed. ${pranayamaType === 'Anulom Vilom' ? 'Form Vishnu mudra with your right hand - curl your index and middle fingers, keeping thumb and ring finger active.' : 'Place your hands in the appropriate mudra position.'} Take three natural breaths to center yourself.`,
        female: `Time to prepare mindfully. Feel your spine lengthening, creating space between each vertebra. ${pranayamaType === 'Anulom Vilom' ? 'Gently form Vishnu mudra - let your index and middle fingers rest while your thumb and ring finger remain ready.' : 'Position your hands with awareness and intention.'} Let's take three centering breaths together.`
      },
      bodyFocus: ['spine', 'shoulders', 'hands', 'mudra'],
      transitionCue: 'Now we begin the breathing rounds'
    });

    // Generate breathing rounds
    for (let round = 1; round <= currentLevelConfig.rounds; round++) {
      // Inhale stage
      stages.push({
        id: `round_${round}_inhale`,
        name: `Round ${round} - Inhale`,
        duration: currentLevelConfig.inhale,
        description: `Inhale phase of round ${round}`,
        instructions: {
          male: `Round ${round}. ${round === 1 ? 'Begin with a' : 'Continue with'} slow, deep inhalation. ${pranayamaType === 'Anulom Vilom' ? (round % 2 === 1 ? 'Close your right nostril, breathe in through the left.' : 'Close your left nostril, breathe in through the right.') : 'Fill your lungs completely and mindfully.'} ${round <= 3 ? 'Feel the expansion in your chest and abdomen.' : 'Maintain steady, conscious breathing.'}`,
          female: `Round ${round}. ${round === 1 ? 'Let\'s begin with a' : 'Continue with'} gentle, deep breath in. ${pranayamaType === 'Anulom Vilom' ? (round % 2 === 1 ? 'Softly close your right nostril and breathe through your left.' : 'Gently close your left nostril and breathe through your right.') : 'Allow the breath to flow naturally and completely into your lungs.'} ${round <= 3 ? 'Notice how your ribcage expands with each breath.' : 'Beautiful, keep this mindful rhythm.'}`
        },
        bodyFocus: ['lungs', 'chest', 'abdomen', 'nostrils'],
        breathingPattern: {
          inhale: currentLevelConfig.inhale
        },
        transitionCue: currentLevelConfig.hold ? 'Now hold the breath' : 'Now exhale slowly'
      });

      // Hold stage (if applicable)
      if (currentLevelConfig.hold && currentLevelConfig.hold > 0) {
        stages.push({
          id: `round_${round}_hold`,
          name: `Round ${round} - Hold`,
          duration: currentLevelConfig.hold,
          description: `Retention phase of round ${round}`,
          instructions: {
            male: `Hold the breath comfortably. ${pranayamaType === 'Anulom Vilom' ? 'Keep both nostrils closed gently.' : 'Feel the energy circulating through your body.'} Don't strain - maintain a relaxed awareness. ${round === 1 ? 'This retention helps balance your nervous system.' : 'Continue with steady, comfortable retention.'}`,
            female: `Gently retain the breath. ${pranayamaType === 'Anulom Vilom' ? 'Both nostrils remain softly closed.' : 'Feel the life force energy flowing within you.'} Stay relaxed and centered. ${round === 1 ? 'This pause allows the breath\'s benefits to integrate.' : 'Maintain this peaceful stillness.'}`
          },
          bodyFocus: ['core', 'diaphragm', 'energy_centers'],
          breathingPattern: {
            hold: currentLevelConfig.hold
          },
          transitionCue: 'Now release the breath'
        });
      }

      // Exhale stage
      stages.push({
        id: `round_${round}_exhale`,
        name: `Round ${round} - Exhale`,
        duration: currentLevelConfig.exhale,
        description: `Exhale phase of round ${round}`,
        instructions: {
          male: `Now exhale slowly and completely. ${pranayamaType === 'Anulom Vilom' ? (round % 2 === 1 ? 'Release through the right nostril, left remains closed.' : 'Release through the left nostril, right remains closed.') : 'Let all the air flow out naturally.'} ${round === 1 ? 'Feel the sense of letting go and relaxation.' : 'Continue with this mindful release.'} Empty your lungs completely.`,
          female: `Gently release the breath. ${pranayamaType === 'Anulom Vilom' ? (round % 2 === 1 ? 'Let it flow through your right nostril while left stays closed.' : 'Allow it to flow through your left nostril while right stays closed.') : 'Let the breath flow out naturally and completely.'} ${round === 1 ? 'Feel the beautiful sense of release and peace.' : 'Maintain this gentle, complete exhalation.'} Allow your lungs to empty fully.`
        },
        bodyFocus: ['lungs', 'abdomen', 'core', 'nostrils'],
        breathingPattern: {
          exhale: currentLevelConfig.exhale
        },
        transitionCue: round < currentLevelConfig.rounds ? 'Brief pause before next round' : 'Preparing for completion'
      });

      // Pause stage (except after last round)
      if (round < currentLevelConfig.rounds) {
        stages.push({
          id: `round_${round}_pause`,
          name: `Round ${round} - Pause`,
          duration: currentLevelConfig.pause,
          description: `Rest between rounds ${round} and ${round + 1}`,
          instructions: {
            male: `Take a brief pause. ${pranayamaType === 'Anulom Vilom' ? 'Release your hand mudra and' : ''} Breathe naturally for a moment. ${round === 1 ? 'Notice any sensations or changes in your body and mind.' : 'Prepare mentally for the next round.'} ${Math.ceil(currentLevelConfig.rounds / 2) === round ? 'You\'re doing great - halfway through!' : ''}`,
            female: `A gentle pause now. ${pranayamaType === 'Anulom Vilom' ? 'Let your hand rest and' : ''} Allow your breath to return to its natural rhythm. ${round === 1 ? 'Take a moment to feel any shifts in your energy or awareness.' : 'Use this time to center yourself for the next round.'} ${Math.ceil(currentLevelConfig.rounds / 2) === round ? 'Wonderful progress - you\'re halfway there!' : ''}`
          },
          bodyFocus: ['mind', 'natural_breath', 'awareness'],
          transitionCue: `Preparing for round ${round + 1}`
        });
      }
    }

    // Completion stage
    stages.push({
      id: 'completion',
      name: 'Completion',
      duration: currentLevelConfig.completion,
      description: 'Integration and completion of practice',
      instructions: {
        male: `Excellent work. You have completed your ${pranayamaType} practice with ${currentLevelConfig.rounds} full rounds. Take these moments to feel the benefits flowing through your entire being. Notice the sense of balance, calm, and vitality. ${level === 'beginner' ? 'As you continue practicing, these benefits will deepen.' : level === 'intermediate' ? 'Your consistent practice is building greater awareness and control.' : 'Your advanced practice demonstrates mastery and deep understanding.'} Carry this peace with you.`,
        female: `Beautiful practice. You've completed your ${pranayamaType} session with mindfulness and dedication through all ${currentLevelConfig.rounds} rounds. Take time to integrate these benefits. Feel the harmony and peace within you. ${level === 'beginner' ? 'Each practice session builds your foundation stronger.' : level === 'intermediate' ? 'Your growing skill brings deeper transformation.' : 'Your advanced practice reflects true mastery of this ancient technique.'} Honor this moment of completion.`
      },
      bodyFocus: ['whole_body', 'mind', 'energy_integration'],
      transitionCue: 'Practice complete'
    });

    return stages;
  }, [pranayamaType, level, currentLevelConfig]);

  const stages = generateStages();
  const currentStage = stages[currentStageIndex];
  const totalStages = stages.length;

  // Calculate total practice duration
  const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && currentStage) {
      interval = setInterval(() => {
        setStageElapsedTime(prev => {
          const newElapsed = prev + 1;
          setTotalElapsedTime(totalPrev => totalPrev + 1);

          // Calculate progress percentage
          const progress = (newElapsed / currentStage.duration) * 100;
          
          // Notify parent component of stage change
          onStageChange(currentStage, Math.min(progress, 100));

          // Update round number for breathing stages
          const roundMatch = currentStage.id.match(/round_(\d+)/);
          if (roundMatch) {
            const roundNum = parseInt(roundMatch[1]);
            if (roundNum !== currentRound) {
              setCurrentRound(roundNum);
              onRoundChange(roundNum);
            }
          }

          // Speak instruction at stage start
          if (newElapsed === 1) {
            onVoiceInstruction(currentStage.instructions[voiceGender]);
          }

          // Transition to next stage
          if (newElapsed >= currentStage.duration) {
            if (currentStageIndex < totalStages - 1) {
              setCurrentStageIndex(prev => prev + 1);
              setStageElapsedTime(0);
              
              // Speak transition cue if available
              if (currentStage.transitionCue) {
                setTimeout(() => {
                  onVoiceInstruction(currentStage.transitionCue!);
                }, 500);
              }
            } else {
              // Practice complete
              onComplete();
            }
            return 0;
          }

          return newElapsed;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, currentStage, currentStageIndex, totalStages, voiceGender, onStageChange, onRoundChange, onComplete, onVoiceInstruction, currentRound]);

  // Control functions
  const skipToNextStage = () => {
    if (currentStageIndex < totalStages - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setStageElapsedTime(0);
    }
  };

  const skipToPreviousStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
      setStageElapsedTime(0);
    }
  };

  const resetProgression = () => {
    setCurrentStageIndex(0);
    setCurrentRound(0);
    setStageElapsedTime(0);
    setTotalElapsedTime(0);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Format time helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate overall progress
  const overallProgress = (totalElapsedTime / totalDuration) * 100;
  const stageProgress = currentStage ? (stageElapsedTime / currentStage.duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Practice Progress</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-white/30 text-white">
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
            <span className="text-sm text-gray-300">
              {formatTime(totalElapsedTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>
        <Progress value={overallProgress} className="h-2 mb-2" />
        <div className="text-xs text-gray-300">
          Stage {currentStageIndex + 1} of {totalStages} • Round {currentRound} of {currentLevelConfig.rounds}
        </div>
      </div>

      {/* Current Stage */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{currentStage?.name || 'Preparing...'}</h4>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {formatTime(stageElapsedTime)} / {formatTime(currentStage?.duration || 0)}
            </span>
          </div>
        </div>
        <Progress value={stageProgress} className="h-2 mb-2" />
        <p className="text-sm text-gray-300 mb-2">{currentStage?.description}</p>
        
        {/* Body Focus Areas */}
        {currentStage?.bodyFocus && (
          <div className="flex flex-wrap gap-1 mb-2">
            {currentStage.bodyFocus.map((focus, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {focus.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        )}

        {/* Breathing Pattern */}
        {currentStage?.breathingPattern && (
          <div className="text-xs text-gray-400 space-x-4">
            {currentStage.breathingPattern.inhale && (
              <span>Inhale: {currentStage.breathingPattern.inhale}s</span>
            )}
            {currentStage.breathingPattern.hold && (
              <span>Hold: {currentStage.breathingPattern.hold}s</span>
            )}
            {currentStage.breathingPattern.exhale && (
              <span>Exhale: {currentStage.breathingPattern.exhale}s</span>
            )}
          </div>
        )}
      </div>

      {/* Stage Navigation Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={skipToPreviousStage}
          disabled={currentStageIndex === 0}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={togglePause}
          disabled={!isActive}
          className="border-white/30 text-white hover:bg-white/10"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={skipToNextStage}
          disabled={currentStageIndex === totalStages - 1}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetProgression}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StageProgressionSystem;