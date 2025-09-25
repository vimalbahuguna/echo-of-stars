import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  phase: 'introduction' | 'inhale' | 'hold' | 'exhale' | 'pause' | 'completion';
  voiceGender: 'male' | 'female';
  isActive: boolean;
  onVoiceGenderChange: (gender: 'male' | 'female') => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  pranayamaType,
  level,
  phase,
  voiceGender,
  isActive,
  onVoiceGenderChange
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Voice instruction scripts for each pranayama type and phase
  const getVoiceScript = (type: string, currentPhase: string, currentLevel: string): string => {
    const scripts = {
      'Anulom Vilom': {
        introduction: {
          male: "Welcome to Anulom Vilom, also known as Alternate Nostril Breathing. This practice balances the nervous system and brings harmony to your mind and body. Sit comfortably with your spine straight.",
          female: "Hello, and welcome to Anulom Vilom practice. This beautiful breathing technique will help balance your energy channels. Find a comfortable seated position with your back straight and shoulders relaxed."
        },
        inhale: {
          male: "Breathe in slowly through your left nostril",
          female: "Gently inhale through your left nostril"
        },
        hold: {
          male: "Hold your breath comfortably",
          female: "Retain the breath with ease"
        },
        exhale: {
          male: "Exhale slowly through your right nostril",
          female: "Release the breath through your right nostril"
        },
        completion: {
          male: "Excellent work. You have completed your Anulom Vilom practice. Take a moment to feel the balance and calm in your system.",
          female: "Beautiful practice. Notice the sense of balance and tranquility flowing through your entire being. Well done."
        }
      },
      'Kapalbhati': {
        introduction: {
          male: "Welcome to Kapalbhati, the skull shining breath. This energizing practice will cleanse your respiratory system and awaken your inner fire. Sit tall and prepare for active breathing.",
          female: "Greetings, and welcome to Kapalbhati pranayama. This powerful technique will energize your body and clear your mind. Sit with confidence and strength."
        },
        inhale: {
          male: "Passive inhalation",
          female: "Allow natural inhalation"
        },
        exhale: {
          male: "Sharp, forceful exhalation",
          female: "Strong, active exhalation"
        },
        completion: {
          male: "Outstanding! Your Kapalbhati practice is complete. Feel the energy and clarity flowing through your system.",
          female: "Wonderful work! You've completed this energizing practice. Notice the vitality and mental clarity you've cultivated."
        }
      },
      'Bhastrika': {
        introduction: {
          male: "Welcome to Bhastrika, the bellows breath. This powerful technique will generate heat and energy in your body. Prepare for vigorous breathing with control and awareness.",
          female: "Hello, welcome to Bhastrika pranayama. Like the bellows of a blacksmith, this practice will kindle your inner fire. Sit strong and ready."
        },
        inhale: {
          male: "Deep, forceful inhalation",
          female: "Strong, complete inhalation"
        },
        exhale: {
          male: "Powerful exhalation",
          female: "Vigorous, complete exhalation"
        },
        completion: {
          male: "Excellent! Your Bhastrika practice is finished. Feel the warmth and energy you've generated throughout your body.",
          female: "Magnificent practice! You've successfully completed Bhastrika. Sense the powerful energy and heat you've created within."
        }
      },
      'Nadi Shodhana': {
        introduction: {
          male: "Welcome to Nadi Shodhana, the channel purification breath. This practice will cleanse your energy pathways and bring deep balance to your system.",
          female: "Greetings, and welcome to Nadi Shodhana. This purifying breath will clear your energy channels and create beautiful harmony within you."
        },
        inhale: {
          male: "Inhale through the open nostril",
          female: "Breathe in through the active nostril"
        },
        hold: {
          male: "Retain the breath gently",
          female: "Hold the breath with comfort"
        },
        exhale: {
          male: "Exhale through the opposite nostril",
          female: "Release through the other nostril"
        },
        completion: {
          male: "Perfect! Your Nadi Shodhana practice is complete. Feel the purification and balance in your energy channels.",
          female: "Beautiful work! You've completed this purifying practice. Notice how clear and balanced your energy feels now."
        }
      },
      'Bhramari': {
        introduction: {
          male: "Welcome to Bhramari, the humming bee breath. This soothing practice will calm your mind and nervous system through the vibration of sound.",
          female: "Hello, welcome to Bhramari pranayama. Like the gentle humming of a bee, this practice will bring deep peace and tranquility to your mind."
        },
        inhale: {
          male: "Breathe in quietly",
          female: "Gentle inhalation"
        },
        exhale: {
          male: "Exhale with a humming sound",
          female: "Hum softly as you exhale"
        },
        completion: {
          male: "Wonderful! Your Bhramari practice is complete. Feel the deep calm and peace that the vibrations have created within you.",
          female: "Lovely practice! You've finished your humming bee breath. Notice the profound stillness and serenity in your mind."
        }
      },
      'Ujjayi': {
        introduction: {
          male: "Welcome to Ujjayi, the victorious breath. This ocean-like breathing will create heat, focus, and inner strength throughout your practice.",
          female: "Greetings, and welcome to Ujjayi pranayama. This powerful breath sounds like ocean waves and will build your inner fire and concentration."
        },
        inhale: {
          male: "Deep inhalation with throat constriction",
          female: "Breathe in with gentle throat engagement"
        },
        exhale: {
          male: "Controlled exhalation with sound",
          female: "Exhale with the ocean-like sound"
        },
        completion: {
          male: "Excellent! Your Ujjayi practice is complete. Feel the heat, strength, and focus you've built through this victorious breath.",
          female: "Wonderful work! You've mastered this victorious breath. Notice the inner fire and mental clarity you've cultivated."
        }
      }
    };

    const typeScripts = scripts[type as keyof typeof scripts];
    if (!typeScripts) return '';

    const phaseScripts = typeScripts[currentPhase as keyof typeof typeScripts];
    if (!phaseScripts) return '';

    return phaseScripts[voiceGender] || '';
  };

  // Text-to-speech synthesis
  const speakText = (text: string) => {
    if (!text || !isActive) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice based on gender preference
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voiceGender === 'female' 
        ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') || voice.name.toLowerCase().includes('samantha')
        : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man') || voice.name.toLowerCase().includes('daniel')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = level === 'beginner' ? 0.8 : level === 'intermediate' ? 0.9 : 1.0;
    utterance.pitch = voiceGender === 'female' ? 1.2 : 0.8;
    utterance.volume = isMuted ? 0 : volume;

    setIsLoading(true);
    utterance.onend = () => setIsLoading(false);
    utterance.onerror = () => setIsLoading(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isActive) {
      // Stop any ongoing speech when component becomes inactive
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsLoading(false);
      }
      return;
    }

    if (phase !== 'pause') {
      const script = getVoiceScript(pranayamaType, phase, level);
      if (script) {
        // Small delay to ensure smooth transitions
        const timer = setTimeout(() => {
          speakText(script);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, isActive, pranayamaType, level, voiceGender]);

  // Cleanup effect to stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && volume === 0) {
      setVolume(0.7);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Voice Guidance</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={voiceGender === 'male' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onVoiceGenderChange('male')}
            className="text-xs"
          >
            <User className="w-3 h-3 mr-1" />
            Male
          </Button>
          <Button
            variant={voiceGender === 'female' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onVoiceGenderChange('female')}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            Female
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="text-white hover:text-gray-200"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1">
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
        
        <span className="text-sm text-white/70 min-w-[3rem]">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-pulse text-white/70 text-sm">Speaking...</div>
        </div>
      )}

      <div className="text-xs text-white/60 text-center">
        Current phase: <span className="capitalize font-medium">{phase}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;