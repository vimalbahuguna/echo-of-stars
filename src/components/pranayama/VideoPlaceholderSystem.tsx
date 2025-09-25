import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Camera, Film, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlaceholderProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  currentStage: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSeek?: (time: number) => void;
  showControls?: boolean;
  className?: string;
}

interface PlaceholderContent {
  title: string;
  description: string;
  modelPose: string;
  visualCues: string[];
  stageSpecificGuidance: string;
  backgroundGradient: string;
}

const VideoPlaceholderSystem: React.FC<VideoPlaceholderProps> = ({
  pranayamaType,
  level,
  currentStage,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onSeek,
  showControls = true,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState(false);

  // Generate placeholder content based on pranayama type and stage
  const getPlaceholderContent = (): PlaceholderContent => {
    const stageKey = currentStage.toLowerCase().replace(/round_\d+_/, '');
    
    const contentMap: Record<string, Record<string, PlaceholderContent>> = {
      'Anulom Vilom': {
        introduction: {
          title: 'Anulom Vilom Introduction',
          description: 'Female model demonstrates proper seated posture and hand positioning for alternate nostril breathing',
          modelPose: 'Seated in comfortable cross-legged position with spine erect, right hand in Vishnu mudra',
          visualCues: ['Proper spinal alignment', 'Relaxed shoulders', 'Vishnu mudra formation', 'Peaceful facial expression'],
          stageSpecificGuidance: 'Model shows initial setup and breathing preparation',
          backgroundGradient: 'from-blue-400 via-purple-500 to-pink-500'
        },
        preparation: {
          title: 'Hand Position Setup',
          description: 'Detailed demonstration of Vishnu mudra and nostril control technique',
          modelPose: 'Close-up of right hand forming Vishnu mudra, positioned near nose',
          visualCues: ['Index and middle fingers folded', 'Thumb and ring finger active', 'Gentle touch near nostrils', 'Relaxed wrist position'],
          stageSpecificGuidance: 'Model demonstrates precise finger positioning and gentle nostril contact',
          backgroundGradient: 'from-green-400 via-blue-500 to-purple-600'
        },
        inhale: {
          title: 'Left Nostril Inhalation',
          description: 'Model demonstrates controlled inhalation through left nostril',
          modelPose: 'Right thumb gently closing right nostril, breathing in through left nostril',
          visualCues: ['Thumb sealing right nostril', 'Chest expansion', 'Abdominal rise', 'Calm facial expression'],
          stageSpecificGuidance: 'Model shows smooth, controlled inhalation with proper nostril closure',
          backgroundGradient: 'from-cyan-400 via-blue-500 to-indigo-600'
        },
        hold: {
          title: 'Breath Retention',
          description: 'Model demonstrates comfortable breath retention with both nostrils closed',
          modelPose: 'Both nostrils gently closed, maintaining breath retention without strain',
          visualCues: ['Both nostrils sealed', 'Stable posture', 'Relaxed face', 'No visible tension'],
          stageSpecificGuidance: 'Model maintains comfortable retention, showing no signs of strain or discomfort',
          backgroundGradient: 'from-purple-400 via-pink-500 to-red-500'
        },
        exhale: {
          title: 'Right Nostril Exhalation',
          description: 'Model demonstrates controlled exhalation through right nostril',
          modelPose: 'Ring finger closing left nostril, exhaling through right nostril',
          visualCues: ['Ring finger sealing left nostril', 'Controlled exhalation', 'Chest deflation', 'Peaceful expression'],
          stageSpecificGuidance: 'Model shows smooth, complete exhalation with proper nostril switching',
          backgroundGradient: 'from-orange-400 via-red-500 to-pink-600'
        },
        pause: {
          title: 'Natural Breathing Pause',
          description: 'Model returns to natural breathing between rounds',
          modelPose: 'Hand resting on knee, breathing naturally and observing effects',
          visualCues: ['Relaxed hand position', 'Natural breath rhythm', 'Mindful awareness', 'Serene expression'],
          stageSpecificGuidance: 'Model demonstrates mindful pause and integration of practice effects',
          backgroundGradient: 'from-teal-400 via-green-500 to-blue-600'
        },
        completion: {
          title: 'Practice Completion',
          description: 'Model concludes practice with gratitude and integration',
          modelPose: 'Hands in prayer position at heart center, eyes closed in gratitude',
          visualCues: ['Prayer mudra at heart', 'Closed eyes', 'Grateful expression', 'Centered posture'],
          stageSpecificGuidance: 'Model shows completion ritual and integration of practice benefits',
          backgroundGradient: 'from-gold-400 via-yellow-500 to-orange-600'
        }
      },
      'Kapalbhati': {
        introduction: {
          title: 'Kapalbhati Introduction',
          description: 'Female model demonstrates proper posture for skull-shining breath practice',
          modelPose: 'Strong seated position with hands on knees, spine erect and core engaged',
          visualCues: ['Firm seated posture', 'Hands on knees', 'Engaged core', 'Alert expression'],
          stageSpecificGuidance: 'Model shows preparation for dynamic breathing practice',
          backgroundGradient: 'from-red-400 via-orange-500 to-yellow-600'
        },
        preparation: {
          title: 'Core Engagement Setup',
          description: 'Model demonstrates proper core activation and breathing preparation',
          modelPose: 'Seated with hands on abdomen, demonstrating core awareness',
          visualCues: ['Hands on lower abdomen', 'Core muscle engagement', 'Steady breathing', 'Focused attention'],
          stageSpecificGuidance: 'Model shows how to engage abdominal muscles for forceful exhalations',
          backgroundGradient: 'from-orange-400 via-red-500 to-pink-600'
        },
        exhale: {
          title: 'Forceful Exhalations',
          description: 'Model demonstrates rapid, forceful exhalations with abdominal contractions',
          modelPose: 'Dynamic abdominal contractions with sharp exhalations through nose',
          visualCues: ['Sharp abdominal contractions', 'Forceful nasal exhalations', 'Rhythmic movement', 'Concentrated focus'],
          stageSpecificGuidance: 'Model shows the bellows-like action of rapid, powerful breathing',
          backgroundGradient: 'from-yellow-400 via-orange-500 to-red-600'
        },
        pause: {
          title: 'Recovery and Integration',
          description: 'Model demonstrates rest period with natural breathing',
          modelPose: 'Relaxed posture with natural breathing, observing internal heat',
          visualCues: ['Relaxed abdominal muscles', 'Natural breath rhythm', 'Awareness of warmth', 'Peaceful expression'],
          stageSpecificGuidance: 'Model shows recovery phase and awareness of generated heat and energy',
          backgroundGradient: 'from-green-400 via-teal-500 to-blue-600'
        },
        completion: {
          title: 'Energized Completion',
          description: 'Model concludes with awareness of increased energy and clarity',
          modelPose: 'Upright posture with hands in mudra, radiating energy and alertness',
          visualCues: ['Energized posture', 'Bright expression', 'Mudra position', 'Radiant presence'],
          stageSpecificGuidance: 'Model demonstrates the energized state achieved through practice',
          backgroundGradient: 'from-gold-400 via-yellow-500 to-orange-600'
        }
      },
      'Bhastrika': {
        introduction: {
          title: 'Bhastrika Introduction',
          description: 'Female model demonstrates powerful seated position for bellows breathing',
          modelPose: 'Strong, grounded seat with spine erect, preparing for dynamic practice',
          visualCues: ['Powerful seated posture', 'Grounded base', 'Strong spine', 'Determined expression'],
          stageSpecificGuidance: 'Model shows preparation for the most dynamic pranayama practice',
          backgroundGradient: 'from-red-500 via-orange-600 to-yellow-700'
        },
        inhale: {
          title: 'Forceful Inhalations',
          description: 'Model demonstrates powerful, complete inhalations',
          modelPose: 'Full chest and abdominal expansion with forceful inhalation',
          visualCues: ['Maximum chest expansion', 'Full abdominal rise', 'Powerful inhalation', 'Engaged muscles'],
          stageSpecificGuidance: 'Model shows the bellows-like inhalation with full body engagement',
          backgroundGradient: 'from-blue-500 via-purple-600 to-indigo-700'
        },
        exhale: {
          title: 'Forceful Exhalations',
          description: 'Model demonstrates powerful, complete exhalations',
          modelPose: 'Strong abdominal contraction with forceful exhalation',
          visualCues: ['Powerful abdominal contraction', 'Complete chest deflation', 'Forceful exhalation', 'Controlled power'],
          stageSpecificGuidance: 'Model shows the dynamic exhalation phase of bellows breathing',
          backgroundGradient: 'from-orange-500 via-red-600 to-pink-700'
        },
        pause: {
          title: 'Power Integration',
          description: 'Model demonstrates integration of generated energy and heat',
          modelPose: 'Still, powerful posture with awareness of internal fire',
          visualCues: ['Strong, still posture', 'Internal awareness', 'Generated heat', 'Powerful presence'],
          stageSpecificGuidance: 'Model shows integration of the powerful energy created through practice',
          backgroundGradient: 'from-purple-500 via-pink-600 to-red-700'
        },
        completion: {
          title: 'Dynamic Completion',
          description: 'Model concludes with full awareness of generated power and vitality',
          modelPose: 'Radiant, powerful posture with hands in strength mudra',
          visualCues: ['Radiant energy', 'Powerful presence', 'Strength mudra', 'Vital expression'],
          stageSpecificGuidance: 'Model demonstrates the powerful, energized state from bellows breathing',
          backgroundGradient: 'from-gold-500 via-orange-600 to-red-700'
        }
      }
    };

    const typeContent = contentMap[pranayamaType] || contentMap['Anulom Vilom'];
    return typeContent[stageKey] || typeContent['introduction'];
  };

  const placeholderContent = getPlaceholderContent();

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate level-specific styling
  const getLevelStyling = () => {
    switch (level) {
      case 'beginner':
        return {
          border: 'border-green-400',
          badge: 'bg-green-500',
          intensity: 'Gentle & Supportive'
        };
      case 'intermediate':
        return {
          border: 'border-yellow-400',
          badge: 'bg-yellow-500',
          intensity: 'Balanced & Focused'
        };
      case 'advanced':
        return {
          border: 'border-red-400',
          badge: 'bg-red-500',
          intensity: 'Intense & Refined'
        };
      default:
        return {
          border: 'border-blue-400',
          badge: 'bg-blue-500',
          intensity: 'Adaptive'
        };
    }
  };

  const levelStyling = getLevelStyling();

  return (
    <Card 
      className={`relative overflow-hidden ${levelStyling.border} border-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        {/* Video Placeholder Background */}
        <div className={`relative h-64 md:h-80 bg-gradient-to-br ${placeholderContent.backgroundGradient} flex items-center justify-center`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className={`w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>

          {/* Model Representation */}
          <div className="relative z-10 text-center text-white">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <User className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">{placeholderContent.title}</h3>
              <p className="text-sm opacity-90 max-w-md mx-auto">{placeholderContent.description}</p>
            </div>

            {/* Level Badge */}
            <Badge className={`${levelStyling.badge} text-white mb-2`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} - {levelStyling.intensity}
            </Badge>

            {/* Play/Pause Button */}
            <Button
              onClick={onPlayPause}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
          </div>

          {/* Stage-Specific Visual Cues */}
          {isHovered && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-xs">
              <h4 className="font-semibold mb-2">Model Demonstration:</h4>
              <p className="mb-2">{placeholderContent.modelPose}</p>
              <div className="space-y-1">
                {placeholderContent.visualCues.map((cue, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    <span>{cue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Loading Indicator */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
              <Film className="w-4 h-4 animate-spin" />
              <span>Video Content Loading...</span>
            </div>
          )}
        </div>

        {/* Video Controls */}
        {showControls && (
          <div className="bg-black/80 text-white p-4 space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={(progress / duration) * 100} 
                className="w-full h-2 bg-white/20"
              />
              <div className="flex justify-between text-xs text-gray-300">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onPlayPause}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowModelDetails(!showModelDetails)}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                  title="Download video (coming soon)"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Model Details Panel */}
            {showModelDetails && (
              <div className="bg-white/10 rounded-lg p-3 space-y-2 text-sm">
                <h4 className="font-semibold">Stage Guidance:</h4>
                <p className="text-gray-300">{placeholderContent.stageSpecificGuidance}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <h5 className="font-medium text-xs text-gray-400 uppercase">Pranayama Type</h5>
                    <p>{pranayamaType}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-gray-400 uppercase">Current Stage</h5>
                    <p>{currentStage.replace(/_/g, ' ').replace(/round \d+ /, '')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coming Soon Overlay */}
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Video Content Coming Soon
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlaceholderSystem;