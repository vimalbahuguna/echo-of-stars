import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, User, Users, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface EnhancedAudioPlayerProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  phase: 'introduction' | 'inhale' | 'hold' | 'exhale' | 'pause' | 'completion';
  voiceGender: 'male' | 'female';
  isActive: boolean;
  cycleCount?: number;
  bodyPartFocus?: string;
  onVoiceGenderChange: (gender: 'male' | 'female') => void;
  onSoundCue?: (soundType: string, instruction: string) => void;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  pranayamaType,
  level,
  phase,
  voiceGender,
  isActive,
  cycleCount = 0,
  bodyPartFocus = '',
  onVoiceGenderChange,
  onSoundCue
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [soundCue, setSoundCue] = useState<{ type: string; instruction: string } | null>(null);

  // Enhanced voice instruction scripts with detailed guidance
  const getEnhancedVoiceScript = (type: string, currentPhase: string, currentLevel: string): string => {
    const levelIntensity = {
      beginner: { pace: 'slowly and gently', intensity: 'comfortable', duration: 'short' },
      intermediate: { pace: 'at a steady rhythm', intensity: 'moderate', duration: 'medium' },
      advanced: { pace: 'with controlled precision', intensity: 'deep and powerful', duration: 'extended' }
    };

    const currentIntensity = levelIntensity[currentLevel as keyof typeof levelIntensity];

    const scripts = {
      'Anulom Vilom': {
        introduction: {
          male: `Welcome to Anulom Vilom, the Alternate Nostril Breathing practice. This ancient technique balances your nervous system and harmonizes the left and right hemispheres of your brain. 
                 For ${currentLevel} level, we'll practice ${currentIntensity.pace} with ${currentIntensity.intensity} breathing. 
                 Sit comfortably with your spine erect. Use your right thumb to close your right nostril and your ring finger to close your left nostril. 
                 Place your index and middle fingers on your forehead between your eyebrows. Let's begin this balancing journey.`,
          female: `Hello and welcome to your Anulom Vilom practice. This beautiful breathing technique will create perfect balance in your energy system. 
                   As a ${currentLevel} practitioner, focus on ${currentIntensity.pace} movements with ${currentIntensity.intensity} awareness. 
                   Find your comfortable seated position with your back naturally straight. Prepare your right hand in Vishnu mudra - thumb and ring finger ready to alternate nostril closure. 
                   Feel the gentle touch on your forehead as you rest your fingers. Let's create harmony together.`
        },
        inhale: {
          male: `Breathe in ${currentIntensity.pace} through your left nostril. Feel the cool, fresh air entering your system. 
                 Focus on your ${bodyPartFocus || 'chest'} expanding naturally. Count mentally as you inhale. 
                 ${currentLevel === 'advanced' ? 'Visualize the prana energy flowing up your left energy channel.' : 'Simply observe the breath flowing in.'}`,
          female: `Gently inhale through your left nostril. Allow the breath to flow ${currentIntensity.pace} and naturally. 
                   Feel your ${bodyPartFocus || 'ribcage'} opening like a flower blooming. 
                   ${currentLevel === 'beginner' ? 'Don\'t strain, just breathe comfortably.' : 'Maintain steady awareness of the breath\'s journey.'}`
        },
        hold: {
          male: `Close both nostrils and hold your breath ${currentIntensity.pace}. Feel the energy distributing throughout your body. 
                 Keep your ${bodyPartFocus || 'chest'} gently expanded. No strain, just comfortable retention. 
                 ${currentLevel === 'advanced' ? 'Feel the prana energy balancing between ida and pingala nadis.' : 'Simply hold with ease.'}`,
          female: `Gently retain the breath with both nostrils closed. Feel the peaceful stillness within. 
                   Your ${bodyPartFocus || 'heart center'} holds this precious energy. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Sense the energy balancing in your subtle body.' : 'Just rest in this comfortable pause.'}`
        },
        exhale: {
          male: `Release through your right nostril ${currentIntensity.pace}. Feel the warm air leaving your body. 
                 Allow your ${bodyPartFocus || 'abdomen'} to gently contract. Complete the exhalation fully. 
                 ${currentLevel === 'advanced' ? 'Visualize any tension or negativity leaving with the breath.' : 'Simply let the breath flow out naturally.'}`,
          female: `Exhale through your right nostril with gentle control. Feel the warm, cleansing breath flowing out. 
                   Your ${bodyPartFocus || 'belly'} naturally draws inward. 
                   ${currentLevel === 'beginner' ? 'Let it happen naturally without force.' : 'Feel the complete release and purification.'}`
        },
        completion: {
          male: `Excellent work completing your Anulom Vilom practice. You've completed ${cycleCount} cycles of this balancing technique. 
                 Notice the sense of equilibrium in your nervous system. Feel the harmony between your left and right brain hemispheres. 
                 Take a moment to appreciate the balance you've created within yourself.`,
          female: `Beautiful practice! You've gracefully completed ${cycleCount} rounds of Anulom Vilom. 
                   Feel the wonderful balance flowing through your entire being. Notice how calm and centered you feel. 
                   This harmony will stay with you throughout your day. Well done on this nurturing practice.`
        }
      },
      'Kapalbhati': {
        introduction: {
          male: `Welcome to Kapalbhati, the Skull Shining Breath. This powerful cleansing technique will energize your entire system and clear your mind. 
                 For ${currentLevel} level, we'll practice with ${currentIntensity.intensity} contractions ${currentIntensity.pace}. 
                 Sit tall with your spine erect. Place your hands on your knees. Focus on sharp, active exhalations and passive inhalations. 
                 This practice will kindle your inner fire and awaken your core energy.`,
          female: `Greetings, and welcome to Kapalbhati pranayama. This energizing breath will illuminate your mind and strengthen your core. 
                   As a ${currentLevel}, you'll work with ${currentIntensity.intensity} movements, breathing ${currentIntensity.pace}. 
                   Sit with confidence and strength. Feel your connection to the earth through your sitting bones. 
                   Prepare to awaken your inner radiance through this powerful cleansing breath.`
        },
        inhale: {
          male: `Allow natural, passive inhalation. Your ${bodyPartFocus || 'diaphragm'} relaxes and air flows in automatically. 
                 Don't force the inhalation - it happens naturally after each exhalation. 
                 ${currentLevel === 'advanced' ? 'Feel the prana naturally filling your lungs.' : 'Simply let the breath come in on its own.'}`,
          female: `Let the inhalation happen naturally and effortlessly. Your ${bodyPartFocus || 'belly'} gently expands as air flows in. 
                   This is the passive phase - no effort needed. 
                   ${currentLevel === 'beginner' ? 'Trust your body\'s natural breathing reflex.' : 'Feel the automatic filling of your lungs.'}`
        },
        exhale: {
          male: `Sharp, forceful exhalation! Contract your ${bodyPartFocus || 'abdominal muscles'} strongly. 
                 Pull your navel in towards your spine with ${currentIntensity.intensity} force. 
                 ${currentLevel === 'advanced' ? 'Feel the fire element activating in your solar plexus.' : 'Focus on the strong abdominal contraction.'} 
                 Make the sound "HA" as you exhale forcefully.`,
          female: `Strong, active exhalation! Draw your ${bodyPartFocus || 'navel'} in sharply towards your spine. 
                   Feel the power in your core as you exhale with ${currentIntensity.intensity} energy. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Sense the cleansing fire in your belly.' : 'Focus on the quick, sharp movement.'} 
                   Let out a natural "HA" sound with each exhalation.`
        },
        completion: {
          male: `Outstanding! You've completed ${cycleCount} rounds of Kapalbhati. Feel the energy and clarity flowing through your system. 
                 Notice the warmth in your ${bodyPartFocus || 'solar plexus'} and the alertness in your mind. 
                 Your digestive fire is kindled and your nervous system is energized. Take a moment to feel this inner radiance.`,
          female: `Wonderful work! You've powerfully completed ${cycleCount} cycles of this energizing practice. 
                   Feel the beautiful vitality and mental clarity you've cultivated. Notice the strength in your core and the brightness in your mind. 
                   You've awakened your inner fire and cleansed your entire system. Magnificent practice!`
        }
      },
      'Bhastrika': {
        introduction: {
          male: `Welcome to Bhastrika, the Bellows Breath. Like the bellows of a blacksmith's forge, this practice will generate tremendous heat and energy. 
                 For ${currentLevel} level, we'll breathe with ${currentIntensity.intensity} force ${currentIntensity.pace}. 
                 Sit strong and stable. This is vigorous breathing that will awaken your inner fire and charge your entire system with prana. 
                 Prepare for powerful, rhythmic breathing that will transform your energy.`,
          female: `Hello, welcome to Bhastrika pranayama. This dynamic technique will kindle your inner fire like a powerful bellows. 
                   As a ${currentLevel} practitioner, you'll breathe with ${currentIntensity.intensity} energy ${currentIntensity.pace}. 
                   Sit with strength and determination. Feel your connection to your inner power. 
                   This vigorous practice will awaken every cell in your body and fill you with vital energy.`
        },
        inhale: {
          male: `Deep, forceful inhalation! Fill your ${bodyPartFocus || 'lungs'} completely with ${currentIntensity.intensity} power. 
                 Expand your chest and ribcage fully. Breathe in with the strength of a warrior. 
                 ${currentLevel === 'advanced' ? 'Feel the prana charging every cell of your body.' : 'Focus on the complete, powerful inhalation.'} 
                 Make a strong "SO" sound as you inhale.`,
          female: `Strong, complete inhalation! Fill your ${bodyPartFocus || 'entire torso'} with powerful breath. 
                   Feel your ribcage expanding in all directions with ${currentIntensity.intensity} energy. 
                   ${currentLevel === 'beginner' ? 'Breathe in with confidence and strength.' : 'Channel the force of nature into your breath.'} 
                   Let the natural "SO" sound accompany your inhalation.`
        },
        exhale: {
          male: `Powerful exhalation! Empty your ${bodyPartFocus || 'lungs'} completely with ${currentIntensity.intensity} force. 
                 Contract your abdominal muscles and push all the air out. Breathe out like a bellows expelling air. 
                 ${currentLevel === 'advanced' ? 'Feel the fire element blazing in your core.' : 'Focus on the complete, forceful exhalation.'} 
                 Make a strong "HUM" sound as you exhale.`,
          female: `Vigorous, complete exhalation! Empty your ${bodyPartFocus || 'chest'} with powerful control. 
                   Feel your core muscles working with ${currentIntensity.intensity} strength. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Sense the transformative fire within you.' : 'Focus on the strong, complete out-breath.'} 
                   Allow the natural "HUM" sound to emerge.`
        },
        completion: {
          male: `Excellent! You've completed ${cycleCount} powerful rounds of Bhastrika. Feel the tremendous energy and heat you've generated. 
                 Notice the warmth throughout your body and the incredible alertness in your mind. 
                 Your inner fire is blazing and your entire system is charged with vital energy. Rest in this powerful state you've created.`,
          female: `Magnificent practice! You've successfully completed ${cycleCount} rounds of this transformative technique. 
                   Feel the incredible power and energy flowing through every part of your being. 
                   Notice the heat, the vitality, and the mental clarity you've awakened. You've truly kindled your inner fire. Beautiful work!`
        }
      },
      'Bhramari': {
        introduction: {
          male: `Welcome to Bhramari, the Humming Bee Breath. This soothing practice creates healing vibrations that calm your nervous system. 
                 For ${currentLevel} level, we'll create ${currentIntensity.intensity} humming sounds ${currentIntensity.pace}. 
                 Sit comfortably and place your thumbs in your ears, index fingers above your eyebrows, and remaining fingers over your closed eyes. 
                 The humming sound will create therapeutic vibrations throughout your head and body.`,
          female: `Hello and welcome to Bhramari pranayama. This beautiful humming breath will soothe your mind like the gentle buzz of a bee. 
                   As a ${currentLevel}, you'll create ${currentIntensity.intensity} vibrations ${currentIntensity.pace}. 
                   Find your comfortable position and prepare your hands in Shanmukhi mudra - thumbs in ears, fingers gently covering your eyes. 
                   Let's create healing sound vibrations that will calm your entire nervous system.`
        },
        inhale: {
          male: `Breathe in quietly through your nose. Fill your ${bodyPartFocus || 'chest'} ${currentIntensity.pace}. 
                 Prepare your throat and vocal cords for the humming sound. 
                 ${currentLevel === 'advanced' ? 'Feel the incoming prana preparing to create healing vibrations.' : 'Simply breathe in naturally and prepare to hum.'}`,
          female: `Gently inhale through your nose. Allow your ${bodyPartFocus || 'lungs'} to fill naturally. 
                   Prepare your voice for the soothing humming sound to come. 
                   ${currentLevel === 'beginner' ? 'Just breathe in comfortably and get ready to hum.' : 'Feel the breath preparing to become healing sound.'}`
        },
        exhale: {
          male: `Create the humming sound "MMMM" as you exhale. Feel the vibrations in your ${bodyPartFocus || 'head'} and skull. 
                 Make the sound ${currentIntensity.pace} with ${currentIntensity.intensity} resonance. 
                 ${currentLevel === 'advanced' ? 'Feel the sound waves massaging your brain and nervous system.' : 'Focus on creating a steady, pleasant humming sound.'} 
                 Let the vibrations soothe your entire being.`,
          female: `Hum gently as you exhale - "MMMM". Feel the beautiful vibrations in your ${bodyPartFocus || 'skull'} and brain. 
                   Create the sound ${currentIntensity.pace} with ${currentIntensity.intensity} resonance. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Let the healing vibrations massage every cell in your head.' : 'Enjoy the soothing, bee-like humming sound.'} 
                   Feel the calming effect spreading through your body.`
        },
        completion: {
          male: `Wonderful! You've completed ${cycleCount} rounds of Bhramari. Feel the deep calm and peace in your nervous system. 
                 Notice how quiet and still your mind has become. The healing vibrations have soothed your entire being. 
                 Your stress has melted away and you're filled with tranquil energy. Rest in this beautiful state of inner peace.`,
          female: `Beautiful practice! You've created ${cycleCount} rounds of healing sound vibrations. 
                   Feel the profound peace and stillness that has settled in your mind and body. 
                   Notice how calm and centered you feel. The therapeutic humming has brought you into perfect harmony. Wonderful work!`
        }
      },
      'Ujjayi': {
        introduction: {
          male: `Welcome to Ujjayi, the Victorious Breath. This powerful technique creates a soothing ocean-like sound that calms your mind. 
                 For ${currentLevel} level, we'll breathe with ${currentIntensity.intensity} throat constriction ${currentIntensity.pace}. 
                 Sit tall and prepare to slightly constrict your throat, creating the sound of ocean waves. 
                 This breath will bring you into a meditative state and regulate your nervous system.`,
          female: `Greetings, and welcome to Ujjayi pranayama. This victorious breath will create beautiful ocean sounds that soothe your soul. 
                   As a ${currentLevel}, you'll practice with ${currentIntensity.intensity} throat engagement ${currentIntensity.pace}. 
                   Sit with grace and prepare to create the gentle sound of waves. 
                   This calming breath will bring you deep peace and inner strength.`
        },
        inhale: {
          male: `Constrict your ${bodyPartFocus || 'throat'} slightly and breathe in ${currentIntensity.pace}. 
                 Create the soft "SA" sound as air passes through your partially closed glottis. 
                 ${currentLevel === 'advanced' ? 'Feel the prana being refined and purified by the throat constriction.' : 'Focus on creating the gentle ocean-like sound.'} 
                 Let the sound be soothing and rhythmic.`,
          female: `Gently narrow your ${bodyPartFocus || 'throat'} and inhale with the soft ocean sound. 
                   Create the beautiful "SA" sound ${currentIntensity.pace} as you breathe in. 
                   ${currentLevel === 'beginner' ? 'Don\'t strain - just create a gentle whisper-like sound.' : 'Feel the breath becoming refined and meditative.'} 
                   Let the sound be like gentle waves on the shore.`
        },
        exhale: {
          male: `Maintain the throat constriction and exhale with the "HA" sound. 
                 Feel the controlled release of breath through your ${bodyPartFocus || 'throat'}. 
                 ${currentLevel === 'advanced' ? 'Sense the calming effect on your nervous system with each exhalation.' : 'Focus on the steady, ocean-like sound.'} 
                 Let each exhale bring deeper relaxation.`,
          female: `Keep the gentle throat constriction and exhale with the soothing "HA" sound. 
                   Feel the peaceful release through your ${bodyPartFocus || 'vocal cords'}. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Let each breath wave wash away tension and stress.' : 'Simply enjoy the calming ocean sound.'} 
                   Feel yourself sinking into deeper tranquility.`
        },
        completion: {
          male: `Excellent! You've completed ${cycleCount} rounds of Ujjayi breathing. Feel the deep calm and centeredness in your being. 
                 Notice how the ocean-like sounds have brought you into a meditative state. 
                 Your nervous system is balanced and your mind is peaceful. You've cultivated the victorious breath within you.`,
          female: `Wonderful practice! You've created ${cycleCount} beautiful waves of Ujjayi breath. 
                   Feel the profound peace and inner strength you've developed. 
                   Notice how calm and meditative you feel. The victorious breath has brought you into perfect harmony with yourself. Beautiful work!`
        }
      },
      'Sitali': {
        introduction: {
          male: `Welcome to Sitali, the Cooling Breath. This refreshing technique will cool your body and calm your mind. 
                 For ${currentLevel} level, we'll practice with ${currentIntensity.intensity} cooling ${currentIntensity.pace}. 
                 Curl your tongue into a tube shape and prepare to inhale cool air through it. 
                 This practice is perfect for reducing heat and bringing tranquility to your system.`,
          female: `Hello and welcome to Sitali pranayama. This cooling breath will refresh your entire being like a gentle breeze. 
                   As a ${currentLevel}, you'll breathe with ${currentIntensity.intensity} cooling effect ${currentIntensity.pace}. 
                   Prepare your tongue by curling it into a beautiful tube. 
                   Let's create a cooling oasis within your body and mind.`
        },
        inhale: {
          male: `Curl your ${bodyPartFocus || 'tongue'} into a tube and inhale cool air through it ${currentIntensity.pace}. 
                 Feel the refreshing coolness entering your body. 
                 ${currentLevel === 'advanced' ? 'Visualize the cooling prana spreading throughout your system.' : 'Simply enjoy the cool, refreshing sensation.'} 
                 Let the coolness flow down into your chest and belly.`,
          female: `Create a tube with your ${bodyPartFocus || 'tongue'} and draw in the cooling breath. 
                   Feel the delicious coolness flowing into your body ${currentIntensity.pace}. 
                   ${currentLevel === 'beginner' ? 'Just enjoy the natural cooling effect.' : 'Feel the cooling energy spreading through every cell.'} 
                   Let this refreshing breath cool you from within.`
        },
        exhale: {
          male: `Close your mouth and exhale through your ${bodyPartFocus || 'nose'} ${currentIntensity.pace}. 
                 Feel the cooling effect spreading throughout your body. 
                 ${currentLevel === 'advanced' ? 'Sense the heat and tension leaving your system with each exhalation.' : 'Simply breathe out naturally through your nose.'} 
                 Let the coolness permeate your entire being.`,
          female: `Gently close your mouth and exhale through your ${bodyPartFocus || 'nostrils'}. 
                   Feel the cooling sensation spreading through your whole body. 
                   ${currentLevel === 'intermediate' || currentLevel === 'advanced' ? 'Let the cooling breath wash away any heat or agitation.' : 'Simply enjoy the natural cooling effect.'} 
                   Feel yourself becoming refreshed and calm.`
        },
        completion: {
          male: `Excellent! You've completed ${cycleCount} rounds of Sitali breathing. Feel the cool, refreshing energy throughout your body. 
                 Notice how calm and cool you feel, both physically and mentally. 
                 The cooling breath has brought you perfect tranquility and refreshment. Your system is balanced and peaceful.`,
          female: `Beautiful practice! You've created ${cycleCount} waves of cooling breath. 
                   Feel the wonderful refreshment and calm that has settled in your body and mind. 
                   Notice how cool and peaceful you feel. You've created a perfect oasis of tranquility within yourself. Lovely work!`
        }
      }
    };

    return scripts[type as keyof typeof scripts]?.[currentPhase as keyof typeof scripts[keyof typeof scripts]]?.[voiceGender as keyof typeof scripts[keyof typeof scripts][keyof typeof scripts[keyof typeof scripts]]] || 
           `Focus on your ${currentPhase} phase with ${currentIntensity.pace} breathing.`;
  };

  // Sound instruction cues for specific Pranayama techniques
  const getSoundInstructions = (type: string, currentPhase: string) => {
    const soundInstructions: Record<string, Record<string, { type: string; instruction: string }>> = {
      'Kapalbhati': {
        exhale: { type: 'HA', instruction: 'Make a sharp "HA" sound with each forceful exhalation' }
      },
      'Bhastrika': {
        inhale: { type: 'SO', instruction: 'Create a strong "SO" sound as you inhale powerfully' },
        exhale: { type: 'HUM', instruction: 'Make a forceful "HUM" sound as you exhale completely' }
      },
      'Bhramari': {
        exhale: { type: 'MMMM', instruction: 'Hum with a gentle "MMMM" sound, like a bee buzzing' }
      },
      'Ujjayi': {
        inhale: { type: 'SA', instruction: 'Create a soft "SA" sound by gently constricting your throat' },
        exhale: { type: 'HA', instruction: 'Make a gentle "HA" sound with controlled throat constriction' }
      }
    };

    return soundInstructions[type]?.[currentPhase] || null;
  };

  // Effect to stop speech when component becomes inactive
  useEffect(() => {
    if (!isActive) {
      // Stop any ongoing speech when the component becomes inactive
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        setIsLoading(false);
      }
      return;
    }

    const script = getEnhancedVoiceScript(pranayamaType, phase, level);
    setCurrentInstruction(script);

    // Get sound instructions if applicable
    const soundInstruction = getSoundInstructions(pranayamaType, phase);
    if (soundInstruction) {
      setSoundCue(soundInstruction);
      onSoundCue?.(soundInstruction.type, soundInstruction.instruction);
    } else {
      setSoundCue(null);
    }

    // Text-to-speech synthesis
    if ('speechSynthesis' in window && script) {
      setIsLoading(true);
      
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.volume = isMuted ? 0 : volume;
      utterance.rate = level === 'beginner' ? 0.8 : level === 'intermediate' ? 0.9 : 1.0;
      utterance.pitch = voiceGender === 'female' ? 1.2 : 0.8;

      // Try to select appropriate voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voiceGender === 'female' ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') : 
         voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'))
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsLoading(false);
      utterance.onerror = () => setIsLoading(false);

      speechSynthesis.speak(utterance);
    }
  }, [pranayamaType, phase, level, voiceGender, isActive, volume, isMuted, bodyPartFocus, onSoundCue]);

  // Cleanup effect to stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Audio Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="flex items-center space-x-1"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>
          
          <div className="flex items-center space-x-2 min-w-[120px]">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={voiceGender === 'male' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onVoiceGenderChange('male')}
            className="flex items-center space-x-1"
          >
            <User className="w-4 h-4" />
            <span className="text-xs">Male</span>
          </Button>
          
          <Button
            variant={voiceGender === 'female' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onVoiceGenderChange('female')}
            className="flex items-center space-x-1"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs">Female</span>
          </Button>
        </div>
      </div>

      {/* Current Instruction Display */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
          </Badge>
          {isLoading && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="animate-spin w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
              <span>Speaking...</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed">
          {currentInstruction}
        </p>
      </div>

      {/* Sound Cue Display */}
      {soundCue && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Sound Cue: {soundCue.type}
            </Badge>
          </div>
          <p className="text-sm text-blue-700">
            {soundCue.instruction}
          </p>
        </div>
      )}

      {/* Body Part Focus */}
      {bodyPartFocus && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="text-xs font-medium text-green-800 mb-1">
            Focus Area: {bodyPartFocus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      )}

      {/* Stop Speech Button */}
      {isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={stopSpeech}
          className="w-full flex items-center justify-center space-x-1"
        >
          <Pause className="w-4 h-4" />
          <span>Stop Speech</span>
        </Button>
      )}
    </div>
  );
};

export default EnhancedAudioPlayer;