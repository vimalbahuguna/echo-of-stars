import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, User, Users, Eye, EyeOff, Settings, SkipForward, SkipBack, Clock, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface VideoStage {
  name: string;
  startTime: number;
  duration: number;
  instruction: string;
  bodyFocus: string[];
  voiceScript: {
    male: string;
    female: string;
  };
}

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

interface RealLifeModelVideoPlayerProps {
  pranayamaType: string;
  pranayamaData: {
    name: string;
    steps: string[];
    timings: {
      beginner: LevelTimings;
      intermediate: LevelTimings;
      advanced: LevelTimings;
    };
    benefits: string;
    duration: string;
    videoUrl?: string; // URL to the real-life model video
  };
  onSessionComplete?: (duration: number) => void;
}

const RealLifeModelVideoPlayer: React.FC<RealLifeModelVideoPlayerProps> = ({
  pranayamaType,
  pranayamaData,
  onSessionComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const [currentStage, setCurrentStage] = useState<'introduction' | 'preparation' | 'inhale' | 'hold' | 'exhale' | 'pause' | 'completion'>('introduction');
  const [currentRound, setCurrentRound] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Get current level timings
  const currentTimings = pranayamaData.timings[level];
  const totalRounds = currentTimings.rounds;

  // Video stages configuration based on pranayama type and level
  const getVideoStages = useCallback((): VideoStage[] => {
    const baseStages: VideoStage[] = [
      {
        name: 'Introduction',
        startTime: 0,
        duration: currentTimings.introduction,
        instruction: 'Welcome to your pranayama practice',
        bodyFocus: ['mind', 'posture'],
        voiceScript: {
          male: `Welcome to ${pranayamaData.name} practice. As a ${level} practitioner, you'll be guided through each stage with precise timing. Find your comfortable seated position and prepare to begin this transformative breathing journey.`,
          female: `Hello and welcome to your ${pranayamaData.name} session. I'll be guiding you through each stage of this beautiful practice. Take a moment to settle into your comfortable position and let's begin this mindful breathing experience together.`
        }
      },
      {
        name: 'Preparation',
        startTime: currentTimings.introduction,
        duration: currentTimings.preparation,
        instruction: 'Prepare your body and mind',
        bodyFocus: ['spine', 'shoulders', 'hands'],
        voiceScript: {
          male: `Now, let's prepare. Sit with your spine naturally erect, shoulders relaxed. Place your hands in the appropriate mudra position. Take three natural breaths to center yourself.`,
          female: `Let's prepare together. Feel your spine lengthening, shoulders softly dropping. Position your hands mindfully. Take three gentle breaths to connect with your inner stillness.`
        }
      }
    ];

    // Add breathing cycle stages
    for (let round = 1; round <= totalRounds; round++) {
      const roundStartTime = currentTimings.introduction + currentTimings.preparation + 
        (round - 1) * (currentTimings.inhale + (currentTimings.hold || 0) + currentTimings.exhale + currentTimings.pause);

      baseStages.push({
        name: `Round ${round} - Inhale`,
        startTime: roundStartTime,
        duration: currentTimings.inhale,
        instruction: `Inhale slowly and deeply - Round ${round}`,
        bodyFocus: ['lungs', 'chest', 'abdomen'],
        voiceScript: {
          male: `Round ${round}. Breathe in slowly and deeply. Feel the air filling your lungs completely. ${round <= 3 ? 'Focus on the expansion of your chest and abdomen.' : 'Continue with steady, mindful breathing.'}`,
          female: `Round ${round}. Gently inhale, allowing the breath to flow naturally and deeply. Feel the nourishing air entering your body. ${round <= 3 ? 'Notice how your ribcage expands with each breath.' : 'Maintain this beautiful rhythm.'}`
        }
      });

      if (currentTimings.hold && currentTimings.hold > 0) {
        baseStages.push({
          name: `Round ${round} - Hold`,
          startTime: roundStartTime + currentTimings.inhale,
          duration: currentTimings.hold,
          instruction: `Hold the breath comfortably - Round ${round}`,
          bodyFocus: ['core', 'diaphragm'],
          voiceScript: {
            male: `Hold the breath comfortably. Feel the energy circulating through your body. Maintain a relaxed awareness.`,
            female: `Gently retain the breath. Feel the stillness and the life force energy flowing within you. Stay relaxed and centered.`
          }
        });
      }

      baseStages.push({
        name: `Round ${round} - Exhale`,
        startTime: roundStartTime + currentTimings.inhale + (currentTimings.hold || 0),
        duration: currentTimings.exhale,
        instruction: `Exhale slowly and completely - Round ${round}`,
        bodyFocus: ['lungs', 'abdomen', 'core'],
        voiceScript: {
          male: `Now exhale slowly and completely. Release all the air from your lungs. Feel the sense of letting go and relaxation.`,
          female: `Gently release the breath, allowing it to flow out naturally and completely. Feel the beautiful sense of release and peace.`
        }
      });

      if (round < totalRounds) {
        baseStages.push({
          name: `Round ${round} - Pause`,
          startTime: roundStartTime + currentTimings.inhale + (currentTimings.hold || 0) + currentTimings.exhale,
          duration: currentTimings.pause,
          instruction: `Brief pause before next round`,
          bodyFocus: ['mind', 'breath'],
          voiceScript: {
            male: `Take a brief pause. Breathe naturally and prepare for the next round.`,
            female: `A gentle pause. Allow your breath to return to its natural rhythm before we continue.`
          }
        });
      }
    }

    // Add completion stage
    const completionStartTime = currentTimings.introduction + currentTimings.preparation + 
      totalRounds * (currentTimings.inhale + (currentTimings.hold || 0) + currentTimings.exhale + currentTimings.pause) - currentTimings.pause;

    baseStages.push({
      name: 'Completion',
      startTime: completionStartTime,
      duration: currentTimings.completion,
      instruction: 'Integration and completion',
      bodyFocus: ['whole_body', 'mind', 'energy'],
      voiceScript: {
        male: `Excellent work. You have completed your ${pranayamaData.name} practice. Take a few moments to feel the benefits flowing through your entire being. Notice the sense of balance, calm, and vitality.`,
        female: `Beautiful practice. You've completed your ${pranayamaData.name} session with mindfulness and dedication. Take time to integrate these benefits. Feel the harmony and peace within you.`
      }
    });

    return baseStages;
  }, [level, currentTimings, totalRounds, pranayamaData.name]);

  const videoStages = getVideoStages();

  // Find current stage based on session duration
  const getCurrentStage = useCallback((): VideoStage | null => {
    return videoStages.find(stage => 
      sessionDuration >= stage.startTime && 
      sessionDuration < stage.startTime + stage.duration
    ) || null;
  }, [sessionDuration, videoStages]);

  // Voice synthesis function
  const speakInstruction = useCallback((text: string) => {
    if (!text || !isPlaying) return;
    
    // Cancel any ongoing speech before starting new one
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Clear previous speech reference
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current = null;
    }
    
    // Wait a brief moment to ensure cancellation is complete
    setTimeout(() => {
      if (!isPlaying) return; // Check if still playing after timeout
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower for better clarity
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Enhanced voice selection for better instruction delivery
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Natural') || voice.name.includes('Enhanced') || voice.name.includes('Premium'))
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Add event listeners for better timing control
      utterance.onstart = () => {
        speechSynthesisRef.current = utterance;
      };
      
      utterance.onend = () => {
        speechSynthesisRef.current = null;
      };
      
      utterance.onerror = () => {
        speechSynthesisRef.current = null;
      };
      
      // Speak the instruction
      speechSynthesis.speak(utterance);
    }, 100); // Brief delay to ensure clean speech transition
  }, [isPlaying]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionDuration(prev => {
          const newDuration = prev + 1;
          const currentStage = getCurrentStage();
          
          if (currentStage) {
            const stageElapsed = newDuration - currentStage.startTime;
            const progress = (stageElapsed / currentStage.duration) * 100;
            setStageProgress(Math.min(progress, 100));

            // Improved video synchronization with breathing stages
            if (videoRef.current && isVideoLoaded && pranayamaData.videoUrl) {
              const stageName = currentStage.name.toLowerCase();
              let targetVideoTime = 0;
              
              // Map breathing stages to appropriate video timing
              if (stageName.includes('inhale')) {
                // During inhale, show beginning of breathing cycle (0-30% of video)
                const inhaleProgress = stageElapsed / currentStage.duration;
                targetVideoTime = inhaleProgress * 0.3 * (videoRef.current.duration || 10);
              } else if (stageName.includes('hold')) {
                // During hold, pause at peak (30% of video)
                targetVideoTime = 0.3 * (videoRef.current.duration || 10);
              } else if (stageName.includes('exhale')) {
                // During exhale, show release phase (30-60% of video)
                const exhaleProgress = stageElapsed / currentStage.duration;
                targetVideoTime = (0.3 + exhaleProgress * 0.3) * (videoRef.current.duration || 10);
              } else if (stageName.includes('pause')) {
                // During pause, show rest position (60-100% of video)
                const pauseProgress = stageElapsed / currentStage.duration;
                targetVideoTime = (0.6 + pauseProgress * 0.4) * (videoRef.current.duration || 10);
              } else {
                // For introduction, preparation, completion - show neutral position
                targetVideoTime = 0;
              }
              
              // Smooth video seeking - only seek if significantly out of sync
              const currentVideoTime = videoRef.current.currentTime;
              if (Math.abs(currentVideoTime - targetVideoTime) > 1) {
                videoRef.current.currentTime = targetVideoTime;
              }
            }

            // Update current stage state
            const stageName = currentStage.name.toLowerCase();
            if (stageName.includes('introduction')) setCurrentStage('introduction');
            else if (stageName.includes('preparation')) setCurrentStage('preparation');
            else if (stageName.includes('inhale')) setCurrentStage('inhale');
            else if (stageName.includes('hold')) setCurrentStage('hold');
            else if (stageName.includes('exhale')) setCurrentStage('exhale');
            else if (stageName.includes('pause')) setCurrentStage('pause');
            else if (stageName.includes('completion')) setCurrentStage('completion');

            // Update round number
            const roundMatch = currentStage.name.match(/Round (\d+)/);
            if (roundMatch) {
              setCurrentRound(parseInt(roundMatch[1]));
            }

            // Speak instruction at stage start with better timing
            if (stageElapsed === 0 || (stageElapsed === 1 && currentStage.duration > 3)) {
              speakInstruction(currentStage.voiceScript[voiceGender]);
            }
          }

          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, getCurrentStage, speakInstruction, voiceGender, isVideoLoaded, pranayamaData.videoUrl]);

  // Video event handlers
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setVideoError(null);
  };

  const handleVideoError = () => {
    setVideoError('Video failed to load. Using placeholder mode.');
    setIsVideoLoaded(false);
  };

  // Add video play/pause event handlers
  const handleVideoPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleVideoPause = () => {
    // Don't auto-pause the session if video pauses
    // This allows for manual video control without affecting the practice timer
  };

  const handleVideoEnded = () => {
    // If video ends, restart it if session is still playing
    if (isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.warn);
    }
  };

  // Control handlers
  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current && isVideoLoaded) {
      // Sync video to current session time
      videoRef.current.currentTime = sessionDuration;
      videoRef.current.play().catch(error => {
        console.warn('Video autoplay failed:', error);
        // Fallback: video will play when user interacts
      });
    }
    if (sessionDuration === 0) {
      setCurrentStage('introduction');
      setCurrentRound(0);
      setStageProgress(0);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    speechSynthesis.cancel();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setSessionDuration(0);
    setCurrentStage('introduction');
    setCurrentRound(0);
    setStageProgress(0);
    
    // Stop video completely
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      // Force video to stop loading if it's still loading
      videoRef.current.load();
    }
    
    // Cancel all speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Clear any speech synthesis reference
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current = null;
    }
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setCurrentStage('completion');
    onSessionComplete?.(sessionDuration);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check for completion
  useEffect(() => {
    const totalDuration = videoStages[videoStages.length - 1]?.startTime + videoStages[videoStages.length - 1]?.duration;
    if (sessionDuration >= totalDuration && isPlaying) {
      handleComplete();
    }
  }, [sessionDuration, isPlaying, videoStages]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (currentLevel: string): string => {
    switch (currentLevel) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentStageInfo = getCurrentStage();

  return (
    <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{pranayamaData.name} - Real Life Model</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:text-gray-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 flex-wrap">
          <Badge className={`${getLevelColor(level)} text-white`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          <span className="text-sm text-gray-300">
            Duration: {formatTime(sessionDuration)}
          </span>
          <span className="text-sm text-gray-300">
            Round: {currentRound}/{totalRounds}
          </span>
          <span className="text-sm text-gray-300">
            Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showSettings && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium mb-2">Volume</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-gray-200"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
              {pranayamaData.videoUrl && !videoError ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnded}
                  muted={isMuted}
                  playsInline
                  autoPlay={false}
                  loop={true}
                  preload="metadata"
                >
                  <source src={pranayamaData.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-800">
                  <div className="text-center space-y-4">
                    <Video className="w-16 h-16 mx-auto text-white/60" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Real Life Model Video</h3>
                      <p className="text-sm text-gray-300">
                        {videoError || 'Professional instructor demonstrating proper technique'}
                      </p>
                      <div className="text-xs text-gray-400">
                        Video will show: {currentStageInfo?.bodyFocus.join(', ') || 'Full body positioning'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Video overlay with stage information */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{currentStageInfo?.name || 'Preparing...'}</span>
                    <span className="text-xs text-gray-300">{formatTime(sessionDuration)}</span>
                  </div>
                  <Progress value={stageProgress} className="h-2" />
                  <p className="text-xs text-gray-300">{currentStageInfo?.instruction || 'Get ready to begin'}</p>
                </div>
              </div>
            </div>

            {/* Stage Navigation */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                disabled={!isPlaying}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                disabled={!isPlaying}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Controls and Information Section */}
          <div className="space-y-6">
            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isPlaying ? (
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {currentStage === 'completion' ? 'Restart' : 'Start'}
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

            {/* Current Stage Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Current Stage</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stage:</span>
                  <span className="text-sm font-medium">{currentStageInfo?.name || 'Preparing'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus Areas:</span>
                  <span className="text-sm">{currentStageInfo?.bodyFocus.join(', ') || 'Mind & Body'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress:</span>
                  <span className="text-sm">{Math.round(stageProgress)}%</span>
                </div>
              </div>
            </div>

            {/* Practice Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Practice Details ({level})</h4>
              <div className="text-sm space-y-1 text-gray-200">
                <div>Inhale: {currentTimings.inhale}s</div>
                {currentTimings.hold && <div>Hold: {currentTimings.hold}s</div>}
                <div>Exhale: {currentTimings.exhale}s</div>
                <div>Rounds: {totalRounds}</div>
                <div>Total Duration: ~{Math.ceil((videoStages[videoStages.length - 1]?.startTime + videoStages[videoStages.length - 1]?.duration) / 60)} minutes</div>
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

export default RealLifeModelVideoPlayer;