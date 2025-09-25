import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Play, BookOpen, Clock, User, Brain } from 'lucide-react';
import { VBTTechnique } from '@/utils/vigyanBhairavTantra';
import { GuidedMeditationPlayer } from './GuidedMeditationPlayer';
import { MeditationIllustrations } from './MeditationIllustrations';

interface MeditationStep {
  id: number;
  instruction: string;
  duration: number;
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

interface GuidedVBTSessionProps {
  technique: VBTTechnique;
  onBack: () => void;
  onComplete?: () => void;
}

export const GuidedVBTSession: React.FC<GuidedVBTSessionProps> = ({
  technique,
  onBack,
  onComplete
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [meditationTechnique, setMeditationTechnique] = useState<MeditationTechnique | null>(null);

  // Convert VBT technique to meditation technique format
  useEffect(() => {
    if (technique && technique.steps) {
      const convertedSteps: MeditationStep[] = technique.steps.map((step, index) => {
        // Calculate duration based on step content and technique difficulty
        let baseDuration = 60; // 1 minute base
        
        if (technique.difficulty === 'Beginner') baseDuration = 45;
        else if (technique.difficulty === 'Advanced') baseDuration = 90;
        
        // Adjust duration based on step content
        if (step.toLowerCase().includes('breathe') || step.toLowerCase().includes('breath')) {
          baseDuration += 30;
        }
        if (step.toLowerCase().includes('visualize') || step.toLowerCase().includes('imagine')) {
          baseDuration += 45;
        }
        if (step.toLowerCase().includes('observe') || step.toLowerCase().includes('witness')) {
          baseDuration += 60;
        }

        // Create breathing pattern based on technique category
        let breathingPattern;
        if (technique.category === 'BREATH' || step.toLowerCase().includes('breath')) {
          breathingPattern = {
            inhale: 4,
            hold: 2,
            exhale: 6,
            pause: 2
          };
        }

        // Enhanced voice text for better narration
        const voiceText = createVoiceNarration(step, index, technique);

        return {
          id: index + 1,
          instruction: step,
          duration: baseDuration,
          voiceText,
          breathingPattern
        };
      });

      // Calculate total duration
      const totalDuration = convertedSteps.reduce((sum, step) => sum + step.duration, 0);

      const converted: MeditationTechnique = {
        id: technique.id,
        name: technique.title,
        category: technique.category,
        difficulty: technique.difficulty,
        description: technique.description,
        totalDuration,
        steps: convertedSteps
      };

      setMeditationTechnique(converted);
    }
  }, [technique]);

  const createVoiceNarration = (step: string, index: number, technique: VBTTechnique): string => {
    const stepNumber = index + 1;
    const isFirstStep = index === 0;
    const isLastStep = index === technique.steps!.length - 1;

    let narration = '';

    if (isFirstStep) {
      if (technique.category === 'Tantric Methods') {
        narration += `Beloved disciple, welcome to the sacred practice of ${technique.title}. `;
        narration += `This is a profound ${technique.difficulty.toLowerCase()} level tantric technique from the divine teachings of Lord Shiva to Goddess Parvati. `;
        narration += `Approach this practice with reverence, surrender, and complete trust. `;
        narration += `Remember, in tantra, you are not just practicing a technique - you are entering into communion with the divine. `;
        narration += `Let us begin this sacred journey together. Step ${stepNumber}. `;
      } else {
        narration += `Welcome to ${technique.title}. This is a ${technique.difficulty.toLowerCase()} level technique from the sacred Vigyan Bhairav Tantra. `;
        narration += `Let's begin with step ${stepNumber}. `;
      }
    } else {
      if (technique.category === 'Tantric Methods') {
        narration += `Now, dear one, let us move deeper into the mystery. Step ${stepNumber}. `;
      } else {
        narration += `Now, let's move to step ${stepNumber}. `;
      }
    }

    // Add breathing cues if relevant
    if (step.toLowerCase().includes('breathe') || step.toLowerCase().includes('breath')) {
      if (technique.category === 'Tantric Methods') {
        narration += 'Feel your breath as the sacred bridge between the physical and the divine. ';
      } else {
        narration += 'Take a moment to settle into your natural breathing rhythm. ';
      }
    }

    // Add the main instruction with pauses
    if (technique.category === 'Tantric Methods') {
      narration += step.replace(/\./g, '. Allow this to unfold naturally. ');
    } else {
      narration += step.replace(/\./g, '. Pause for a moment. ');
    }

    // Add guidance based on technique category
    switch (technique.category) {
      case 'Tantric Methods':
        // Add safety reminder for first step
        if (index === 0 && technique.warnings) {
          narration += ` Before we proceed, remember these important guidelines: ${technique.warnings.join('. ')}. Honor these boundaries as you would honor the sacred itself. `;
        }
        
        if (step.toLowerCase().includes('sacred') || step.toLowerCase().includes('reverence')) {
          narration += ' Feel the profound sacredness of this moment. You are touching the very essence of creation itself. ';
        } else if (step.toLowerCase().includes('union') || step.toLowerCase().includes('merge')) {
          narration += ' In this union, the boundaries between self and cosmos dissolve. You are experiencing the fundamental unity of existence. ';
        } else if (step.toLowerCase().includes('energy') || step.toLowerCase().includes('creative')) {
          narration += ' This energy you feel is the same force that creates galaxies and flowers alike. Honor it as the divine creative principle. ';
        } else if (step.toLowerCase().includes('bliss') || step.toLowerCase().includes('joy')) {
          narration += ' This bliss is your natural state, dear student. It is not something you create, but something you remember. ';
        } else if (step.toLowerCase().includes('gaze') || step.toLowerCase().includes('eyes')) {
          narration += ' Through the eyes, you glimpse the soul. See beyond form into the eternal essence that dwells within. ';
        } else if (step.toLowerCase().includes('breathe') || step.toLowerCase().includes('breath')) {
          narration += ' Each breath connects you to the cosmic rhythm. Breathe as if you are breathing with the universe itself. ';
        } else {
          narration += ' Stay present with whatever arises. Trust the wisdom of your body and the guidance of your inner teacher. ';
        }
        break;
      case 'Breath Awareness':
        narration += ' Focus completely on your breath, letting it guide you deeper into awareness.';
        break;
      case 'Body Consciousness':
        narration += ' Feel the sensations in your body with complete attention and acceptance.';
        break;
      case 'Pure Awareness':
        narration += ' Simply observe without judgment, remaining as pure witnessing consciousness.';
        break;
      case 'Visualization':
        narration += ' Allow the visualization to become vivid and real in your inner vision.';
        break;
      case 'Energy Work':
        narration += ' Feel the energy flowing through you, awakening your subtle awareness.';
        break;
      case 'Sound Meditation':
        narration += ' Let the sound vibrations penetrate every cell of your being.';
        break;
      default:
        narration += ' Stay present and aware throughout this practice.';
    }

    if (isLastStep) {
      if (technique.category === 'Tantric Methods') {
        narration += ' This is the culmination of our sacred practice together. Rest in this state as long as you wish. ';
        narration += ' When you are ready to return, do so with gratitude for this divine communion. ';
        narration += ' Carry this sacred awareness with you always. You are blessed, beloved disciple. ';
      } else {
        narration += ' This is the final step. Take your time to complete this practice fully. When you are ready, slowly return your awareness to your surroundings.';
      }
    } else {
      if (technique.category === 'Tantric Methods') {
        narration += ' Rest in this awareness. When you feel ready, we will continue deeper into the mystery.';
      } else {
        narration += ' Take your time with this step. The next instruction will guide you when you are ready.';
      }
    }

    return narration;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BREATH': return '🌬️';
      case 'BODY': return '🧘';
      case 'AWARENESS': return '👁️';
      case 'VISUALIZATION': return '✨';
      case 'ENERGY': return '⚡';
      case 'SOUND': return '🔊';
      case 'MIND': return '🧠';
      case 'DEVOTION': return '❤️';
      case 'TANTRIC': return '🕉️';
      default: return '🧘‍♂️';
    }
  };

  if (showPlayer && meditationTechnique) {
    return (
      <GuidedMeditationPlayer
        technique={meditationTechnique}
        onComplete={() => {
          setShowPlayer(false);
          onComplete?.();
        }}
        onClose={() => setShowPlayer(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Guided Meditation Session</h1>
          <p className="text-gray-600">Prepare for your practice</p>
        </div>
      </div>

      {/* Technique Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getCategoryIcon(technique.category)}</div>
              <div>
                <CardTitle className="text-xl text-purple-800">
                  {technique.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    #{technique.id}
                  </Badge>
                  <Badge className={getDifficultyColor(technique.difficulty)}>
                    {technique.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {technique.category}
                  </Badge>
                </div>
              </div>
            </div>
            {meditationTechnique && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDuration(meditationTechnique.totalDuration)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {meditationTechnique.steps.length} steps
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            {technique.description}
          </p>
          
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <MeditationIllustrations 
              technique={technique.category.toLowerCase()} 
              className="w-32 h-32"
            />
          </div>

          {/* Benefits */}
          {technique.benefits && technique.benefits.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-purple-700 mb-2">Benefits:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {technique.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {technique.prerequisites && technique.prerequisites.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Prerequisites:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {technique.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {technique.warnings && technique.warnings.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                {technique.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Preview */}
      {meditationTechnique && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meditationTechnique.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white text-sm rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">
                      {step.instruction}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(step.duration)}
                      </div>
                      {step.breathingPattern && (
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          Breathing Pattern
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Session */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Begin?</h3>
          <p className="mb-4 opacity-90">
            Find a quiet, comfortable space where you won't be disturbed. 
            This guided session will take you through each step with voice narration and visual guidance.
          </p>
          <Button 
            onClick={() => setShowPlayer(true)}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
            disabled={!meditationTechnique}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Guided Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};