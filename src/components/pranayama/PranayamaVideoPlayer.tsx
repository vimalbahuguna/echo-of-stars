import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, User, Users, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreathingAnimation from './BreathingAnimation';
import EnhancedAudioPlayer from './EnhancedAudioPlayer';

interface PranayamaVideoPlayerProps {
  pranayamaType: string;
  pranayamaData: {
    name: string;
    steps: string[];
    timings: {
      beginner: { inhale: number; hold?: number; exhale: number; rounds?: string; totalDuration?: string };
      intermediate: { inhale: number; hold?: number; exhale: number; rounds?: string; totalDuration?: string };
      advanced: { inhale: number; hold?: number; exhale: number; rounds?: string; totalDuration?: string };
    };
    benefits: string;
    duration: string;
  };
  onSessionComplete?: (duration: number) => void;
}

const PranayamaVideoPlayer: React.FC<PranayamaVideoPlayerProps> = ({
  pranayamaType,
  pranayamaData,
  onSessionComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(true); // Start playing automatically
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const [currentPhase, setCurrentPhase] = useState<'introduction' | 'inhale' | 'hold' | 'exhale' | 'pause' | 'completion'>('inhale'); // Start with inhale phase
  const [sessionDuration, setSessionDuration] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showFemaleBody, setShowFemaleBody] = useState(true);
  const [bodyPartFocus, setBodyPartFocus] = useState('');
  const [soundCue, setSoundCue] = useState<{ type: string; instruction: string } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTimings = pranayamaData.timings[level];
  const maxRounds = parseInt(currentTimings.rounds?.split('-')[1] || '10');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (cycleCount >= maxRounds && isPlaying) {
      handleComplete();
    }
  }, [cycleCount, maxRounds, isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      setCurrentPhase('introduction');
      setSessionDuration(0);
      setCycleCount(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentPhase('introduction');
    setSessionDuration(0);
    setCycleCount(0);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setCurrentPhase('completion');
    onSessionComplete?.(sessionDuration);
  };

  const handlePhaseChange = (phase: 'inhale' | 'hold' | 'exhale' | 'pause') => {
    setCurrentPhase(phase);
    
    // Update cycle count when completing a full cycle
    if (phase === 'pause') {
      setCycleCount(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (currentLevel: string): string => {
    switch (currentLevel) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPhaseDescription = (): string => {
    switch (currentPhase) {
      case 'introduction':
        return 'Listen to the introduction and prepare for practice';
      case 'inhale':
        return `Inhale for ${currentTimings.inhale} seconds`;
      case 'hold':
        return `Hold breath for ${currentTimings.hold || 0} seconds`;
      case 'exhale':
        return `Exhale for ${currentTimings.exhale} seconds`;
      case 'pause':
        return 'Brief pause between cycles';
      case 'completion':
        return 'Session completed - well done!';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{pranayamaData.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:text-gray-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className={`${getLevelColor(level)} text-white`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          <span className="text-sm text-gray-300">
            Duration: {formatTime(sessionDuration)}
          </span>
          <span className="text-sm text-gray-300">
            Cycles: {cycleCount}/{maxRounds}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showSettings && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select value={level} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setLevel(value)}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Voice Gender</label>
                <Select value={voiceGender} onValueChange={(value: 'male' | 'female') => setVoiceGender(value)}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body Animation</label>
                <Button
                  variant={showFemaleBody ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFemaleBody(!showFemaleBody)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {showFemaleBody ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{showFemaleBody ? 'Hide' : 'Show'} Female Body</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Animation Section */}
          <div className="flex flex-col items-center space-y-4">
            <BreathingAnimation
              type={pranayamaType}
              level={level}
              isActive={isPlaying && currentPhase !== 'introduction' && currentPhase !== 'completion'}
              timings={currentTimings}
              showFemaleBody={showFemaleBody}
              onPhaseChange={handlePhaseChange}
            />
            
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                {getPhaseDescription()}
              </div>
              <div className="text-sm text-gray-300">
                {currentPhase === 'introduction' && 'Get ready to begin your practice'}
                {currentPhase === 'completion' && 'Take a moment to feel the benefits'}
              </div>
            </div>
          </div>

          {/* Audio and Controls Section */}
          <div className="space-y-6">
            <EnhancedAudioPlayer
              pranayamaType={pranayamaType}
              level={level}
              phase={currentPhase}
              voiceGender={voiceGender}
              isActive={isPlaying}
              cycleCount={cycleCount}
              bodyPartFocus={bodyPartFocus}
              onVoiceGenderChange={setVoiceGender}
              onSoundCue={(soundType, instruction) => setSoundCue({ type: soundType, instruction })}
            />

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isPlaying ? (
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {currentPhase === 'completion' ? 'Restart' : 'Start'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleStop}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>

              <Button
                onClick={() => {
                  handleStop();
                  setTimeout(handlePlay, 100);
                }}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Practice Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Practice Details</h4>
              <div className="text-sm space-y-1 text-gray-200">
                <div>Inhale: {currentTimings.inhale}s</div>
                {currentTimings.hold && <div>Hold: {currentTimings.hold}s</div>}
                <div>Exhale: {currentTimings.exhale}s</div>
                <div>Target Rounds: {currentTimings.rounds}</div>
                <div>Estimated Duration: {currentTimings.totalDuration}</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Benefits</h4>
              <p className="text-sm text-gray-200">{pranayamaData.benefits}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PranayamaVideoPlayer;