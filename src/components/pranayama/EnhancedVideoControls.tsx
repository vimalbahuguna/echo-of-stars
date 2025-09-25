import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Settings, 
  Clock, 
  Target,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  BookOpen,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface StageInfo {
  name: string;
  duration: number;
  description: string;
  keyPoints: string[];
}

interface EnhancedVideoControlsProps {
  // Playback State
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  
  // Pranayama Context
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  currentStage: string;
  currentRound: number;
  totalRounds: number;
  stageProgress: number;
  
  // Stage Navigation
  stages: StageInfo[];
  currentStageIndex: number;
  
  // Control Callbacks
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onStageNavigation: (stageIndex: number) => void;
  onSpeedChange: (speed: number) => void;
  onLevelChange?: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  
  // Optional Props
  showAdvancedControls?: boolean;
  showStageNavigation?: boolean;
  showTimingInfo?: boolean;
  className?: string;
}

const EnhancedVideoControls: React.FC<EnhancedVideoControlsProps> = ({
  isPlaying,
  isPaused,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  pranayamaType,
  level,
  currentStage,
  currentRound,
  totalRounds,
  stageProgress,
  stages,
  currentStageIndex,
  onPlay,
  onPause,
  onStop,
  onReset,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onStageNavigation,
  onSpeedChange,
  onLevelChange,
  showAdvancedControls = true,
  showStageNavigation = true,
  showTimingInfo = true,
  className = ""
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [showStageDetails, setShowStageDetails] = useState(false);
  const [seekPreview, setSeekPreview] = useState<number | null>(null);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get level-specific timing adjustments
  const getLevelTimingMultiplier = (): number => {
    switch (level) {
      case 'beginner': return 1.3; // 30% slower
      case 'intermediate': return 1.0; // Normal speed
      case 'advanced': return 0.8; // 20% faster
      default: return 1.0;
    }
  };

  // Calculate adjusted duration based on level
  const getAdjustedDuration = (baseDuration: number): number => {
    return baseDuration * getLevelTimingMultiplier();
  };

  // Get current stage info
  const getCurrentStageInfo = (): StageInfo | null => {
    return stages[currentStageIndex] || null;
  };

  // Handle playback speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    onSpeedChange(speed);
  };

  // Handle stage navigation
  const navigateToStage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStageIndex > 0) {
      onStageNavigation(currentStageIndex - 1);
    } else if (direction === 'next' && currentStageIndex < stages.length - 1) {
      onStageNavigation(currentStageIndex + 1);
    }
  };

  // Handle seek with preview
  const handleSeekStart = (value: number[]) => {
    setSeekPreview(value[0]);
  };

  const handleSeekEnd = (value: number[]) => {
    onSeek(value[0]);
    setSeekPreview(null);
  };

  // Get level styling
  const getLevelStyling = () => {
    switch (level) {
      case 'beginner':
        return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-400' };
      case 'intermediate':
        return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-400' };
      case 'advanced':
        return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-400' };
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-400' };
    }
  };

  const levelStyling = getLevelStyling();
  const currentStageInfo = getCurrentStageInfo();

  return (
    <Card className={`bg-black/90 text-white border-gray-700 ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Progress Bar with Stage Markers */}
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={(currentTime / duration) * 100} 
              className="w-full h-3 bg-gray-700"
            />
            
            {/* Stage Markers */}
            {showStageNavigation && stages.map((stage, index) => {
              const stagePosition = (stages.slice(0, index + 1).reduce((acc, s) => acc + s.duration, 0) / duration) * 100;
              return (
                <div
                  key={index}
                  className={`absolute top-0 w-1 h-3 bg-white/60 cursor-pointer hover:bg-white transition-colors ${
                    index === currentStageIndex ? 'bg-blue-400' : ''
                  }`}
                  style={{ left: `${stagePosition}%` }}
                  onClick={() => onStageNavigation(index)}
                  title={stage.name}
                />
              );
            })}
            
            {/* Seek Preview */}
            {seekPreview !== null && (
              <div
                className="absolute top-0 w-1 h-3 bg-yellow-400"
                style={{ left: `${(seekPreview / duration) * 100}%` }}
              />
            )}
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-sm text-gray-300">
            <span>{formatTime(seekPreview || currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onReset}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
              title="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => navigateToStage('prev')}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
              disabled={currentStageIndex === 0}
              title="Previous stage"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={isPlaying ? onPause : onPlay}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              onClick={() => navigateToStage('next')}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
              disabled={currentStageIndex === stages.length - 1}
              title="Next stage"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onStop}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume and Settings */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onMuteToggle}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <Button
              onClick={onFullscreenToggle}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stage Information */}
        {showStageNavigation && currentStageInfo && (
          <div className={`${levelStyling.bg} ${levelStyling.border} border rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge className={`${levelStyling.color} bg-transparent border-current`}>
                  Stage {currentStageIndex + 1} of {stages.length}
                </Badge>
                <h4 className="font-semibold">{currentStageInfo.name}</h4>
              </div>
              
              <Button
                onClick={() => setShowStageDetails(!showStageDetails)}
                size="sm"
                variant="ghost"
                className="text-white hover:text-gray-200"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-300 mb-2">{currentStageInfo.description}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Timer className="w-3 h-3" />
                <span>Duration: {formatTime(getAdjustedDuration(currentStageInfo.duration))}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>Round: {currentRound} of {totalRounds}</span>
              </div>
            </div>
            
            {/* Stage Progress */}
            <div className="mt-2">
              <Progress value={stageProgress} className="h-1 bg-gray-600" />
            </div>
            
            {/* Stage Details */}
            {showStageDetails && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <h5 className="font-medium mb-2">Key Points:</h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  {currentStageInfo.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Advanced Settings Panel */}
        {showSettings && showAdvancedControls && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold mb-3">Advanced Controls</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Playback Speed */}
              <div>
                <label className="block text-sm font-medium mb-2">Playback Speed</label>
                <Select 
                  value={playbackSpeed.toString()} 
                  onValueChange={(value) => handleSpeedChange(parseFloat(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Level Adjustment */}
              {onLevelChange && (
                <div>
                  <label className="block text-sm font-medium mb-2">Practice Level</label>
                  <Select value={level} onValueChange={onLevelChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Slower)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Normal)</SelectItem>
                      <SelectItem value="advanced">Advanced (Faster)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Timing Information */}
            {showTimingInfo && (
              <div className="bg-gray-700 rounded-lg p-3">
                <h5 className="font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Timing Information
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Base Duration:</span>
                    <div className="font-mono">{formatTime(duration / getLevelTimingMultiplier())}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Adjusted Duration:</span>
                    <div className="font-mono">{formatTime(duration)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Speed Multiplier:</span>
                    <div className="font-mono">{getLevelTimingMultiplier()}x</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Playback Speed:</span>
                    <div className="font-mono">{playbackSpeed}x</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Information */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{pranayamaType}</span>
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            <span className={levelStyling.color}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>Remaining: {formatTime(duration - currentTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVideoControls;