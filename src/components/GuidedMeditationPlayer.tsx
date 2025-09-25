import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MeditationStep {
  id: number;
  instruction: string;
  duration: number; // in seconds
  voiceText: string;
  illustration?: string;
  breathingPattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
}

interface MeditationTechnique {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  totalDuration: number;
  steps: MeditationStep[];
}

interface GuidedMeditationPlayerProps {
  technique: MeditationTechnique;
  onComplete?: () => void;
  onClose?: () => void;
}

export const GuidedMeditationPlayer: React.FC<GuidedMeditationPlayerProps> = ({
  technique,
  onComplete,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showIllustrations, setShowIllustrations] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const currentStep = technique.steps[currentStepIndex];
  const isLastStep = currentStepIndex === technique.steps.length - 1;

  // Text-to-Speech functionality
  const speakInstruction = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.volume = isMuted ? 0 : volume;
    utterance.pitch = 0.9;
    utterance.lang = 'en-US';

    // Try to use a calm, soothing voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Moira') ||
      voice.name.toLowerCase().includes('female')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, volume, isMuted, playbackSpeed]);

  // Timer functionality
  useEffect(() => {
    if (isPlaying && currentStep) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const stepDuration = currentStep.duration / playbackSpeed;
        const progress = Math.min((elapsed / stepDuration) * 100, 100);
        
        setStepProgress(progress);
        
        // Calculate total progress
        const completedSteps = technique.steps.slice(0, currentStepIndex);
        const completedDuration = completedSteps.reduce((sum, step) => sum + step.duration, 0);
        const currentStepElapsed = (elapsed / playbackSpeed);
        const totalElapsed = completedDuration + currentStepElapsed;
        const totalDuration = technique.steps.reduce((sum, step) => sum + step.duration, 0);
        setTotalProgress((totalElapsed / totalDuration) * 100);

        // Auto-advance to next step
        if (progress >= 100) {
          if (isLastStep) {
            setIsPlaying(false);
            onComplete?.();
          } else {
            nextStep();
          }
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (isPlaying) {
        pausedTimeRef.current = (Date.now() - startTimeRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, playbackSpeed, isLastStep, onComplete]);

  // Speak instruction when step changes
  useEffect(() => {
    if (currentStep && isPlaying) {
      speakInstruction(currentStep.voiceText);
    }
  }, [currentStepIndex, speakInstruction, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentStep) {
      speakInstruction(currentStep.voiceText);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const nextStep = () => {
    if (currentStepIndex < technique.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setStepProgress(0);
      pausedTimeRef.current = 0;
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setStepProgress(0);
      pausedTimeRef.current = 0;
    }
  };

  const resetMeditation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
    setTotalProgress(0);
    pausedTimeRef.current = 0;
    window.speechSynthesis.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-purple-800">
                {technique.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-blue-600">
                  {technique.category}
                </Badge>
                <Badge className={getDifficultyColor(technique.difficulty)}>
                  {technique.difficulty}
                </Badge>
                <span className="text-sm text-gray-600">
                  {formatTime(technique.totalDuration)}
                </span>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
          <p className="text-gray-600 mt-2">{technique.description}</p>
        </CardHeader>
      </Card>

      {/* Main Player */}
      <Card>
        <CardContent className="p-6">
          {/* Progress Indicators */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStepIndex + 1} of {technique.steps.length}</span>
                <span>{Math.round(stepProgress)}%</span>
              </div>
              <Progress value={stepProgress} className="h-2" />
            </div>
          </div>

          {/* Current Step Display */}
          {currentStep && (
            <div className="text-center space-y-4 mb-6">
              <h3 className="text-xl font-semibold text-purple-700">
                Step {currentStepIndex + 1}
              </h3>
              
              {/* Illustration Placeholder */}
              {showIllustrations && (
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-purple-200">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-purple-300 rounded-full flex items-center justify-center">
                      <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-600 font-medium">
                      Meditation Visualization
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {currentStep.instruction}
                </p>
              </div>

              {/* Breathing Pattern Display */}
              {currentStep.breathingPattern && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Breathing Pattern:</h4>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">Inhale</div>
                      <div>{currentStep.breathingPattern.inhale}s</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">Hold</div>
                      <div>{currentStep.breathingPattern.hold}s</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">Exhale</div>
                      <div>{currentStep.breathingPattern.exhale}s</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">Pause</div>
                      <div>{currentStep.breathingPattern.pause}s</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                Duration: {formatTime(currentStep.duration)}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={previousStep}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlayPause}
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={nextStep}
              disabled={isLastStep}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetMeditation}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Volume Control */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  Volume
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(value) => {
                      setVolume(value[0] / 100);
                      setIsMuted(value[0] === 0);
                    }}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Playback Speed */}
              <div className="space-y-2">
                <Label>Playback Speed: {playbackSpeed}x</Label>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={(value) => setPlaybackSpeed(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              {/* Voice Narration Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
                <Label htmlFor="voice-enabled">Voice Narration</Label>
              </div>

              {/* Illustrations Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-illustrations"
                  checked={showIllustrations}
                  onCheckedChange={setShowIllustrations}
                />
                <Label htmlFor="show-illustrations" className="flex items-center gap-2">
                  {showIllustrations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Show Illustrations
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Meditation Steps Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {technique.steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  index === currentStepIndex
                    ? 'bg-purple-100 border-purple-300'
                    : index < currentStepIndex
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => {
                  setCurrentStepIndex(index);
                  setStepProgress(0);
                  pausedTimeRef.current = 0;
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === currentStepIndex
                        ? 'bg-purple-600 text-white'
                        : index < currentStepIndex
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{step.instruction.substring(0, 50)}...</span>
                  </div>
                  <span className="text-sm text-gray-600">{formatTime(step.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};