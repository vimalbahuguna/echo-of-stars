import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, User, Volume2, Settings, Info } from 'lucide-react';

// Import our custom components
import RealLifeModelVideoPlayer from './RealLifeModelVideoPlayer';
import StageProgressionSystem, { LevelConfiguration } from './StageProgressionSystem';
import EnhancedVoiceInstructionSystem from './EnhancedVoiceInstructionSystem';
import VideoPlaceholderSystem from './VideoPlaceholderSystem';
import EnhancedVideoControls from './EnhancedVideoControls';

interface LevelTimings {
  introduction: number;
  preparation: number;
  inhale: number;
  hold?: number;
  exhale: number;
  pause: number;
  rounds: number;
  completion: number;
}

interface StageInfo {
  name: string;
  duration: number;
  description: string;
  keyPoints: string[];
}

interface IntegratedRealLifeModelPlayerProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  pranayamaData?: {
    name: string;
    image: string;
    videoUrl?: string;
    steps: string[];
    timings: {
      beginner: { [key: string]: any };
      intermediate: { [key: string]: any };
      advanced: { [key: string]: any };
    };
    benefits: string;
    duration: string;
  };
  onSessionComplete?: (duration: number) => void;
  onSessionStop?: () => void;
  className?: string;
}

const IntegratedRealLifeModelPlayer: React.FC<IntegratedRealLifeModelPlayerProps> = ({
  pranayamaType,
  level,
  pranayamaData,
  onSessionComplete,
  onSessionStop,
  className = ""
}) => {
  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Pranayama State
  const [currentStage, setCurrentStage] = useState('introduction');
  const [currentRound, setCurrentRound] = useState(1);
  const [stageElapsedTime, setStageElapsedTime] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Voice and UI State
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [activeTab, setActiveTab] = useState('video');

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Create session object from props
  const session = {
    id: `${pranayamaType}-${level}-${Date.now()}`,
    type: pranayamaType,
    level: level,
    duration: level === 'beginner' ? 300 : level === 'intermediate' ? 600 : 900, // 5, 10, or 15 minutes
    rounds: level === 'beginner' ? 5 : level === 'intermediate' ? 10 : 15,
    description: `${pranayamaType} practice session for ${level} level`
  };

  // Generate stage information based on pranayama type and level
  const generateStages = useCallback((): StageInfo[] => {
    const baseStages = {
      'Anulom Vilom': [
        {
          name: 'Introduction',
          duration: 30,
          description: 'Welcome and setup instructions',
          keyPoints: ['Proper seated posture', 'Hand positioning', 'Breathing preparation']
        },
        {
          name: 'Preparation',
          duration: 45,
          description: 'Vishnu mudra formation and nostril control',
          keyPoints: ['Form Vishnu mudra', 'Practice nostril closure', 'Center yourself']
        },
        {
          name: 'Practice Rounds',
          duration: session.duration * 0.8, // 80% of total time for practice
          description: 'Alternate nostril breathing cycles',
          keyPoints: ['Left nostril inhalation', 'Breath retention', 'Right nostril exhalation', 'Reverse pattern']
        },
        {
          name: 'Completion',
          duration: 30,
          description: 'Integration and closing',
          keyPoints: ['Return to natural breathing', 'Observe effects', 'Gratitude practice']
        }
      ],
      'Kapalbhati': [
        {
          name: 'Introduction',
          duration: 30,
          description: 'Welcome and technique overview',
          keyPoints: ['Seated posture', 'Abdominal focus', 'Breathing rhythm']
        },
        {
          name: 'Preparation',
          duration: 60,
          description: 'Warm-up and technique practice',
          keyPoints: ['Gentle abdominal contractions', 'Natural inhalation', 'Rhythmic practice']
        },
        {
          name: 'Practice Rounds',
          duration: session.duration * 0.75,
          description: 'Skull shining breath cycles',
          keyPoints: ['Sharp exhalations', 'Passive inhalations', 'Steady rhythm', 'Rest between rounds']
        },
        {
          name: 'Completion',
          duration: 45,
          description: 'Cool down and integration',
          keyPoints: ['Return to normal breathing', 'Feel the energy', 'Meditation']
        }
      ]
    };

    return baseStages[session.type as keyof typeof baseStages] || baseStages['Anulom Vilom'];
  }, [session.type, session.duration]);

  const stages = generateStages();

  // Level configuration for StageProgressionSystem
  const levelConfig: LevelConfiguration = {
    beginner: {
      introduction: 30,
      preparation: 45,
      inhale: 4,
      hold: 0,
      exhale: 4,
      pause: 2,
      rounds: 5,
      completion: 30
    },
    intermediate: {
      introduction: 30,
      preparation: 60,
      inhale: 6,
      hold: 2,
      exhale: 6,
      pause: 2,
      rounds: 10,
      completion: 45
    },
    advanced: {
      introduction: 30,
      preparation: 60,
      inhale: 8,
      hold: 4,
      exhale: 8,
      pause: 2,
      rounds: 15,
      completion: 60
    }
  };

  // Timer and progression logic
  useEffect(() => {
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        setStageElapsedTime(prev => prev + 1);
        
        // Check if current stage is complete
        const currentStageData = stages[currentStageIndex];
        if (currentStageData && stageElapsedTime >= currentStageData.duration) {
          if (currentStageIndex < stages.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
            setStageElapsedTime(0);
          } else {
            // Session complete
            setIsPlaying(false);
            onSessionComplete?.(currentTime);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, stageElapsedTime, currentStageIndex, stages, currentTime, onSessionComplete]);

  // Control handlers
  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setStageElapsedTime(0);
    setCurrentStageIndex(0);
    setCurrentRound(1);
    onSessionStop?.();
  };

  const handleStageNavigation = (stageIndex: number) => {
    if (stageIndex >= 0 && stageIndex < stages.length) {
      setCurrentStageIndex(stageIndex);
      setStageElapsedTime(0);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStageData = stages[currentStageIndex];
  const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
  const overallProgress = (currentTime / totalDuration) * 100;

  return (
    <div ref={playerRef} className={`w-full max-w-6xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {session.type} Practice
            </h2>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {session.level.charAt(0).toUpperCase() + session.level.slice(1)}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Round {currentRound}/{session.rounds}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </Badge>
            </div>
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-semibold">
              {currentStageData?.name || 'Loading...'}
            </div>
            <div className="text-sm opacity-80">
              Stage {currentStageIndex + 1} of {stages.length}
            </div>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-1">
            <span>Session Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-4">
            {/* Video Player */}
            <RealLifeModelVideoPlayer
              pranayamaType={session.type}
              pranayamaData={pranayamaData ? {
                name: pranayamaData.name,
                steps: pranayamaData.steps,
                timings: {
                  beginner: pranayamaData.timings.beginner as LevelTimings,
                  intermediate: pranayamaData.timings.intermediate as LevelTimings,
                  advanced: pranayamaData.timings.advanced as LevelTimings
                },
                benefits: pranayamaData.benefits,
                duration: pranayamaData.duration,
                videoUrl: pranayamaData.videoUrl
              } : {
                name: session.type,
                steps: currentStageData?.keyPoints || [],
                timings: {
                  beginner: { introduction: 30, preparation: 45, inhale: 4, exhale: 6, pause: 2, rounds: 5, completion: 30 },
                  intermediate: { introduction: 30, preparation: 45, inhale: 6, hold: 2, exhale: 8, pause: 2, rounds: 10, completion: 30 },
                  advanced: { introduction: 30, preparation: 45, inhale: 8, hold: 4, exhale: 12, pause: 2, rounds: 15, completion: 30 }
                },
                benefits: currentStageData?.description || 'Pranayama practice benefits',
                duration: `${Math.ceil(session.duration / 60)} minutes`
              }}
              onSessionComplete={onSessionComplete}
            />
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            {/* Voice Instruction System */}
            <EnhancedVoiceInstructionSystem
              pranayamaType={session.type}
              level={session.level}
              currentStage={currentStageData?.name || 'introduction'}
              stageElapsedTime={stageElapsedTime}
              currentRound={currentRound}
              totalRounds={session.rounds}
              voiceGender={voiceGender}
              volume={volume}
              isMuted={isMuted}
              isActive={isPlaying}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
              onVoiceGenderChange={setVoiceGender}
            />
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            {/* Enhanced Video Controls */}
            <EnhancedVideoControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              currentTime={currentTime}
              duration={totalDuration}
              volume={isMuted ? 0 : volume}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              pranayamaType={session.type}
              level={session.level}
              currentStage={currentStageData?.name || 'introduction'}
              currentRound={currentRound}
              totalRounds={session.rounds}
              stageProgress={stageProgress}
              stages={stages}
              currentStageIndex={currentStageIndex}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onReset={handleStop}
              onSeek={(time) => setCurrentTime(time)}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
              onFullscreenToggle={toggleFullscreen}
              onStageNavigation={handleStageNavigation}
              onSpeedChange={handleSpeedChange}
            />
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            {/* Stage Progression System */}
            <StageProgressionSystem
              pranayamaType={session.type}
              level={session.level}
              levelConfig={levelConfig}
              voiceGender={voiceGender}
              isActive={isPlaying}
              onStageChange={(stage, progress) => {
                setStageProgress(progress);
              }}
              onRoundChange={(round) => {
                setCurrentRound(round);
              }}
              onComplete={() => {
                setIsPlaying(false);
                onSessionComplete?.(currentTime);
              }}
              onVoiceInstruction={(instruction) => {
                // Handle voice instruction if needed
                console.log('Voice instruction:', instruction);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegratedRealLifeModelPlayer;