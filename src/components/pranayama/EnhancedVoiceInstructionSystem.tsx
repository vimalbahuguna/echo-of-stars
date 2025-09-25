import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, User, Users, Mic, MicOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceInstruction {
  id: string;
  text: string;
  timing: number; // When to speak (seconds into stage)
  priority: 'high' | 'medium' | 'low';
  type: 'guidance' | 'encouragement' | 'technique' | 'transition' | 'completion';
}

interface PranayamaVoiceScript {
  introduction: VoiceInstruction[];
  preparation: VoiceInstruction[];
  inhale: VoiceInstruction[];
  hold?: VoiceInstruction[];
  exhale: VoiceInstruction[];
  pause: VoiceInstruction[];
  completion: VoiceInstruction[];
}

interface EnhancedVoiceInstructionSystemProps {
  pranayamaType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  currentStage: string;
  stageElapsedTime: number;
  currentRound: number;
  totalRounds: number;
  voiceGender: 'male' | 'female';
  volume: number;
  isMuted: boolean;
  isActive: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onVoiceGenderChange: (gender: 'male' | 'female') => void;
  onInstructionSpoken?: (instruction: VoiceInstruction) => void;
}

const EnhancedVoiceInstructionSystem: React.FC<EnhancedVoiceInstructionSystemProps> = ({
  pranayamaType,
  level,
  currentStage,
  stageElapsedTime,
  currentRound,
  totalRounds,
  voiceGender,
  volume,
  isMuted,
  isActive,
  onVolumeChange,
  onMuteToggle,
  onVoiceGenderChange,
  onInstructionSpoken
}) => {
  const [speechRate, setSpeechRate] = useState(0.8);
  const [speechPitch, setSpeechPitch] = useState(voiceGender === 'female' ? 1.2 : 0.8);
  const [enableEncouragement, setEnableEncouragement] = useState(true);
  const [voiceStyle, setVoiceStyle] = useState<'calm' | 'energetic' | 'meditative'>('calm');
  const [spokenInstructions, setSpokenInstructions] = useState<Set<string>>(new Set());
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Update speech pitch when voice gender changes
  useEffect(() => {
    setSpeechPitch(voiceGender === 'female' ? 1.2 : 0.8);
  }, [voiceGender]);

  // Generate comprehensive voice scripts for each pranayama type
  const generateVoiceScripts = useCallback((): Record<string, PranayamaVoiceScript> => {
    const levelIntensity = {
      beginner: { pace: 'gentle', intensity: 'light', complexity: 'simple' },
      intermediate: { pace: 'steady', intensity: 'moderate', complexity: 'focused' },
      advanced: { pace: 'controlled', intensity: 'deep', complexity: 'refined' }
    };

    const currentIntensity = levelIntensity[level];

    return {
      'Anulom Vilom': {
        introduction: [
          {
            id: 'anulom_intro_1',
            text: voiceGender === 'male' 
              ? `Welcome to Anulom Vilom, the ancient practice of alternate nostril breathing. As a ${level} practitioner, you'll experience ${currentIntensity.pace} movements with ${currentIntensity.intensity} awareness.`
              : `Hello and welcome to Anulom Vilom, a beautiful balancing breath practice. Today we'll practice with ${currentIntensity.pace} rhythm and ${currentIntensity.intensity} mindfulness, perfect for your ${level} level.`,
            timing: 1,
            priority: 'high',
            type: 'guidance'
          },
          {
            id: 'anulom_intro_2',
            text: voiceGender === 'male'
              ? `This practice balances the left and right hemispheres of your brain, harmonizing your nervous system. Find your comfortable seated position with spine naturally erect.`
              : `This sacred technique harmonizes your inner energies and brings deep balance to mind and body. Settle into your comfortable position with your spine gently lengthened.`,
            timing: 8,
            priority: 'high',
            type: 'guidance'
          },
          {
            id: 'anulom_intro_3',
            text: voiceGender === 'male'
              ? `We'll complete ${totalRounds} rounds together. Each round will help deepen your sense of balance and inner calm.`
              : `Together we'll flow through ${totalRounds} mindful rounds, each one bringing you deeper into harmony and peace.`,
            timing: 15,
            priority: 'medium',
            type: 'guidance'
          }
        ],
        preparation: [
          {
            id: 'anulom_prep_1',
            text: voiceGender === 'male'
              ? `Form Vishnu mudra with your right hand. Curl your index and middle fingers toward your palm, keeping your thumb and ring finger active for nostril control.`
              : `Let's create Vishnu mudra together. Gently fold your index and middle fingers while your thumb and ring finger remain ready to guide your breath.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          },
          {
            id: 'anulom_prep_2',
            text: voiceGender === 'male'
              ? `Rest your hand lightly near your nose. The touch should be gentle - you're guiding the breath, not forcing it. Take three natural breaths to center yourself.`
              : `Bring your hand softly to your face, creating a gentle connection. Your touch is light and caring. Let's take three centering breaths to prepare our energy.`,
            timing: 8,
            priority: 'high',
            type: 'technique'
          }
        ],
        inhale: [
          {
            id: 'anulom_inhale_1',
            text: voiceGender === 'male'
              ? `Close your right nostril with your thumb. Breathe in slowly through your left nostril. Feel the cool air entering, filling your lungs completely.`
              : `Gently close your right nostril and breathe in through your left. Feel the nourishing breath flowing in, expanding your chest and belly with life.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          },
          {
            id: 'anulom_inhale_encouragement',
            text: enableEncouragement ? (voiceGender === 'male'
              ? `Excellent breathing. Keep the inhalation smooth and steady.`
              : `Beautiful breath. Allow it to flow naturally and completely.`) : '',
            timing: Math.floor(stageElapsedTime / 2),
            priority: 'low',
            type: 'encouragement'
          }
        ],
        hold: [
          {
            id: 'anulom_hold_1',
            text: voiceGender === 'male'
              ? `Now close both nostrils gently. Hold the breath comfortably - no strain. Feel the energy circulating through your body.`
              : `Softly close both nostrils and retain the breath with ease. Feel the life force energy flowing within you, bringing balance and harmony.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        exhale: [
          {
            id: 'anulom_exhale_1',
            text: voiceGender === 'male'
              ? `Release your thumb, keeping your ring finger on the left nostril. Exhale slowly through your right nostril. Let all the air flow out completely.`
              : `Open your right nostril and let the breath flow out gently and completely. Feel the sense of release and letting go with each exhalation.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        pause: [
          {
            id: 'anulom_pause_1',
            text: voiceGender === 'male'
              ? `Release your hand and breathe naturally for a moment. Notice any sensations or changes in your body and mind.`
              : `Let your hand rest and allow your breath to return to its natural rhythm. Take a moment to feel the beautiful effects of this practice.`,
            timing: 1,
            priority: 'medium',
            type: 'guidance'
          }
        ],
        completion: [
          {
            id: 'anulom_completion_1',
            text: voiceGender === 'male'
              ? `Excellent work. You have completed ${totalRounds} rounds of Anulom Vilom with focus and dedication. Feel the balance and harmony flowing through your entire being.`
              : `Beautiful practice. You've completed ${totalRounds} rounds with such mindfulness and grace. Feel the deep sense of balance and tranquility within you.`,
            timing: 1,
            priority: 'high',
            type: 'completion'
          },
          {
            id: 'anulom_completion_2',
            text: voiceGender === 'male'
              ? `This practice has balanced your nervous system and harmonized your energy channels. Carry this sense of equilibrium with you throughout your day.`
              : `Your practice has created beautiful harmony between your mind and body. Take this sense of balance and peace with you as you continue your journey.`,
            timing: 8,
            priority: 'medium',
            type: 'completion'
          }
        ]
      },
      'Kapalbhati': {
        introduction: [
          {
            id: 'kapalbhati_intro_1',
            text: voiceGender === 'male'
              ? `Welcome to Kapalbhati, the skull-shining breath. This powerful cleansing practice will energize your body and clear your mind. As a ${level} practitioner, we'll work with ${currentIntensity.intensity} intensity.`
              : `Hello and welcome to Kapalbhati, the radiant breath of purification. This energizing practice will awaken your inner fire and clarity. We'll practice with ${currentIntensity.intensity} energy, perfect for your ${level} experience.`,
            timing: 1,
            priority: 'high',
            type: 'guidance'
          },
          {
            id: 'kapalbhati_intro_2',
            text: voiceGender === 'male'
              ? `Kapalbhati involves forceful exhalations followed by passive inhalations. This creates internal heat and purifies your respiratory system.`
              : `In Kapalbhati, we create powerful exhalations while allowing gentle, natural inhalations. This builds inner fire and cleanses your entire breathing system.`,
            timing: 8,
            priority: 'high',
            type: 'guidance'
          }
        ],
        preparation: [
          {
            id: 'kapalbhati_prep_1',
            text: voiceGender === 'male'
              ? `Sit with your spine erect and shoulders relaxed. Place your hands on your knees or in your preferred mudra. Take a few deep breaths to prepare.`
              : `Find your strong, comfortable seat with spine naturally tall. Rest your hands mindfully and take several deep breaths to awaken your core energy.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        inhale: [
          {
            id: 'kapalbhati_inhale_1',
            text: voiceGender === 'male'
              ? `Take a deep inhalation to fill your lungs completely. This will prepare you for the active exhalation phase.`
              : `Breathe in deeply and fully, preparing your body for the powerful cleansing breaths that follow.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        exhale: [
          {
            id: 'kapalbhati_exhale_1',
            text: voiceGender === 'male'
              ? `Now begin the forceful exhalations. Contract your abdominal muscles sharply, pushing the air out through your nose. Let the inhalation happen naturally.`
              : `Begin the powerful exhalations now. Use your core muscles to push the breath out strongly while allowing gentle, passive inhalations between.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        pause: [
          {
            id: 'kapalbhati_pause_1',
            text: voiceGender === 'male'
              ? `Rest and breathe naturally. Feel the heat and energy generated by your practice. Notice the clarity in your mind.`
              : `Take a gentle pause and breathe naturally. Feel the wonderful warmth and vitality flowing through you. Notice how clear and alert you feel.`,
            timing: 1,
            priority: 'medium',
            type: 'guidance'
          }
        ],
        completion: [
          {
            id: 'kapalbhati_completion_1',
            text: voiceGender === 'male'
              ? `Excellent Kapalbhati practice. You have generated internal heat and purified your respiratory system. Feel the energy and clarity flowing through you.`
              : `Wonderful Kapalbhati session. You've created beautiful inner fire and cleansed your entire system. Feel the radiant energy and mental clarity you've cultivated.`,
            timing: 1,
            priority: 'high',
            type: 'completion'
          }
        ]
      },
      // Add more pranayama types as needed...
      'Bhastrika': {
        introduction: [
          {
            id: 'bhastrika_intro_1',
            text: voiceGender === 'male'
              ? `Welcome to Bhastrika, the bellows breath. This dynamic practice builds internal fire and increases your vital energy. We'll practice with ${currentIntensity.intensity} power.`
              : `Hello and welcome to Bhastrika, the powerful bellows breathing. This energizing practice awakens your inner strength and vitality with ${currentIntensity.intensity} intensity.`,
            timing: 1,
            priority: 'high',
            type: 'guidance'
          }
        ],
        preparation: [
          {
            id: 'bhastrika_prep_1',
            text: voiceGender === 'male'
              ? `Sit tall with your spine erect. This practice requires strong posture and focused attention. Prepare your core muscles for dynamic breathing.`
              : `Find your powerful, grounded seat. This practice needs your full presence and strong core engagement. Prepare your body for energizing breath.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        inhale: [
          {
            id: 'bhastrika_inhale_1',
            text: voiceGender === 'male'
              ? `Inhale forcefully and completely, expanding your chest and abdomen. Feel the power of the breath filling your entire torso.`
              : `Breathe in with strength and fullness, allowing your chest and belly to expand completely. Feel the dynamic energy entering your body.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        exhale: [
          {
            id: 'bhastrika_exhale_1',
            text: voiceGender === 'male'
              ? `Exhale forcefully through your nose, contracting your abdominal muscles. Create the bellows action with power and control.`
              : `Exhale with strength and control, using your core to create the powerful bellows motion. Feel the energy building with each breath.`,
            timing: 1,
            priority: 'high',
            type: 'technique'
          }
        ],
        pause: [
          {
            id: 'bhastrika_pause_1',
            text: voiceGender === 'male'
              ? `Rest and feel the heat generated by your practice. Notice the increased energy and alertness in your system.`
              : `Pause and feel the wonderful warmth and vitality you've created. Notice how energized and alive you feel throughout your body.`,
            timing: 1,
            priority: 'medium',
            type: 'guidance'
          }
        ],
        completion: [
          {
            id: 'bhastrika_completion_1',
            text: voiceGender === 'male'
              ? `Powerful Bhastrika practice completed. You have built tremendous internal energy and heat. Feel the strength and vitality coursing through you.`
              : `Beautiful and powerful Bhastrika session. You've awakened incredible inner fire and strength. Feel the dynamic energy and aliveness within you.`,
            timing: 1,
            priority: 'high',
            type: 'completion'
          }
        ]
      }
    };
  }, [level, voiceGender, totalRounds, enableEncouragement, stageElapsedTime]);

  const voiceScripts = generateVoiceScripts();

  // Get current stage instructions
  const getCurrentInstructions = useCallback((): VoiceInstruction[] => {
    const script = voiceScripts[pranayamaType];
    if (!script) return [];

    const stageKey = currentStage.toLowerCase().replace(/round_\d+_/, '') as keyof PranayamaVoiceScript;
    return script[stageKey] || [];
  }, [voiceScripts, pranayamaType, currentStage]);

  // Speech synthesis function with queue management
  const speakInstruction = useCallback((instruction: VoiceInstruction) => {
    if (!speechSynthesisRef.current || isMuted || !instruction.text) return;

    // Don't interrupt if there's already speech playing
    if (currentUtterance) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(instruction.text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = volume;

    // Adjust speech characteristics based on voice style
    switch (voiceStyle) {
      case 'calm':
        utterance.rate = Math.max(speechRate - 0.1, 0.5);
        break;
      case 'energetic':
        utterance.rate = Math.min(speechRate + 0.2, 1.2);
        utterance.pitch = speechPitch + 0.1;
        break;
      case 'meditative':
        utterance.rate = Math.max(speechRate - 0.2, 0.4);
        utterance.pitch = speechPitch - 0.1;
        break;
    }

    // Try to select appropriate voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      voice.name.toLowerCase().includes(voiceGender)
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setCurrentUtterance(utterance);
    };

    utterance.onend = () => {
      setCurrentUtterance(null);
    };

    speechSynthesisRef.current.speak(utterance);
    onInstructionSpoken?.(instruction);
  }, [speechRate, speechPitch, volume, isMuted, voiceGender, voiceStyle, onInstructionSpoken]);

  // Main instruction timing effect
  useEffect(() => {
    if (!isActive) return;

    const instructions = getCurrentInstructions();
    const instructionKey = `${currentStage}_${stageElapsedTime}`;

    // Check if we should speak any instructions at this timing
    instructions.forEach(instruction => {
      if (instruction.timing === stageElapsedTime && !spokenInstructions.has(instruction.id)) {
        speakInstruction(instruction);
        setSpokenInstructions(prev => new Set(prev).add(instruction.id));
      }
    });

    // Clear spoken instructions when stage changes
    if (stageElapsedTime === 0) {
      setSpokenInstructions(new Set());
    }
  }, [isActive, currentStage, stageElapsedTime, getCurrentInstructions, speakInstruction, spokenInstructions]);

  // Stop speech when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setCurrentUtterance(null);
    }
  }, [isActive]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Voice Guidance
        </h3>
        <div className="flex items-center space-x-2">
          {currentUtterance && (
            <Badge variant="secondary" className="animate-pulse">
              Speaking...
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMuteToggle}
            className="text-white hover:text-gray-200"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Voice Gender</label>
          <Select value={voiceGender} onValueChange={onVoiceGenderChange}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Female
                </div>
              </SelectItem>
              <SelectItem value="male">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Male
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Voice Style</label>
          <Select value={voiceStyle} onValueChange={(value: 'calm' | 'energetic' | 'meditative') => setVoiceStyle(value)}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm">Calm & Steady</SelectItem>
              <SelectItem value="energetic">Energetic & Dynamic</SelectItem>
              <SelectItem value="meditative">Meditative & Slow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Volume and Speech Rate Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Volume</label>
          <Slider
            value={[volume]}
            onValueChange={(value) => onVolumeChange(value[0])}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Speech Rate</label>
          <Slider
            value={[speechRate]}
            onValueChange={(value) => setSpeechRate(value[0])}
            min={0.5}
            max={1.5}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Encouragement</label>
        <Button
          variant={enableEncouragement ? "default" : "outline"}
          size="sm"
          onClick={() => setEnableEncouragement(!enableEncouragement)}
          className="text-xs"
        >
          {enableEncouragement ? 'On' : 'Off'}
        </Button>
      </div>

      {/* Current Stage Info */}
      <div className="text-xs text-gray-300 space-y-1">
        <div>Current Stage: {currentStage.replace(/_/g, ' ').replace(/round \d+ /, '')}</div>
        <div>Round: {currentRound} of {totalRounds}</div>
        <div>Instructions Available: {getCurrentInstructions().length}</div>
      </div>
    </div>
  );
};

export default EnhancedVoiceInstructionSystem;