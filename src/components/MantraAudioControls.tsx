import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Repeat,
  Music,
  Languages,
  Clock,
  Headphones
} from 'lucide-react';

interface MantraAudioControlsProps {
  mantra: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  stepNumber: number;
  className?: string;
}

interface MantraPlayback {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  duration: number;
  repetitions: number;
}

export const MantraAudioControls: React.FC<MantraAudioControlsProps> = ({ 
  mantra, 
  stepNumber, 
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState<'sanskrit' | 'transliteration' | 'meaning'>('sanskrit');
  const [volume, setVolume] = useState([0.8]);
  const [isMuted, setIsMuted] = useState(false);
  const [repetitions, setRepetitions] = useState([3]);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const repetitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced mantra pronunciation with proper Sanskrit phonetics
  const getProperPronunciation = (text: string, mode: string) => {
    if (mode === 'sanskrit') {
      // Sanskrit pronunciation adjustments
      return text
        .replace(/ॐ/g, 'AUM')
        .replace(/ं/g, 'M')
        .replace(/ः/g, 'H')
        .replace(/ऋ/g, 'RI')
        .replace(/ॠ/g, 'RII')
        .replace(/ऌ/g, 'LRI')
        .replace(/ॡ/g, 'LRII')
        .replace(/्/g, ''); // Remove virama for better pronunciation
    }
    return text;
  };

  const speak = (text: string, mode: string, repetition: number = 0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const pronunciationText = getProperPronunciation(text, mode);
      const utterance = new SpeechSynthesisUtterance(pronunciationText);
      
      // Configure voice based on mode
      if (mode === 'sanskrit') {
        utterance.lang = 'hi-IN'; // Hindi for Sanskrit
        utterance.rate = 0.6; // Very slow for proper pronunciation
        utterance.pitch = 0.8; // Lower pitch for sacred chanting
      } else if (mode === 'transliteration') {
        utterance.lang = 'en-IN'; // English Indian accent
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
      }
      
      utterance.volume = isMuted ? 0 : volume[0];
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentRepetition(repetition + 1);
      };
      
      utterance.onend = () => {
        if (repetition < repetitions[0] - 1) {
          // Continue with next repetition
          repetitionTimeoutRef.current = setTimeout(() => {
            speak(text, mode, repetition + 1);
          }, 1000); // 1 second pause between repetitions
        } else if (isLooping) {
          // Start over if looping
          repetitionTimeoutRef.current = setTimeout(() => {
            setCurrentRepetition(0);
            speak(text, mode, 0);
          }, 2000); // 2 second pause before loop
        } else {
          // Finished all repetitions
          setIsPlaying(false);
          setCurrentRepetition(0);
          setProgress(0);
        }
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentRepetition(0);
      };
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
      // Progress simulation
      const estimatedDuration = pronunciationText.length * 150; // Slower for mantras
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 100;
          }
          return prev + 2;
        });
      }, estimatedDuration / 50);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (repetitionTimeoutRef.current) {
      clearTimeout(repetitionTimeoutRef.current);
    }
    setIsPlaying(false);
    setCurrentRepetition(0);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      const textToSpeak = currentMode === 'sanskrit' ? mantra.sanskrit :
                         currentMode === 'transliteration' ? mantra.transliteration :
                         mantra.meaning;
      speak(textToSpeak, currentMode);
    }
  };

  const playMode = (mode: 'sanskrit' | 'transliteration' | 'meaning') => {
    stopSpeech();
    setCurrentMode(mode);
    const textToSpeak = mode === 'sanskrit' ? mantra.sanskrit :
                       mode === 'transliteration' ? mantra.transliteration :
                       mantra.meaning;
    speak(textToSpeak, mode);
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <Card className={`border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">मंत्र जाप (Mantra Chanting)</h3>
          <Headphones className="w-5 h-5 text-indigo-500" />
        </div>

        {/* Mantra Display */}
        <div className="bg-white/80 rounded-lg p-4 mb-4 border border-purple-200">
          <div className="space-y-3">
            <div className={`p-3 rounded ${currentMode === 'sanskrit' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Languages className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">संस्कृत (Sanskrit)</span>
              </div>
              <p className="text-lg font-sanskrit text-purple-900">{mantra.sanskrit}</p>
            </div>
            
            <div className={`p-3 rounded ${currentMode === 'transliteration' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Languages className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Transliteration</span>
              </div>
              <p className="text-base italic text-indigo-800">{mantra.transliteration}</p>
            </div>
            
            <div className={`p-3 rounded ${currentMode === 'meaning' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Languages className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Meaning</span>
              </div>
              <p className="text-sm text-green-800">{mantra.meaning}</p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => playMode('sanskrit')}
            variant={currentMode === 'sanskrit' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            संस्कृत
          </Button>
          <Button
            onClick={() => playMode('transliteration')}
            variant={currentMode === 'transliteration' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            Roman
          </Button>
          <Button
            onClick={() => playMode('meaning')}
            variant={currentMode === 'meaning' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            Meaning
          </Button>
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={togglePlayPause}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'रोकें' : 'जाप करें'}
          </Button>
          
          <Button
            onClick={stopSpeech}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            रीसेट
          </Button>

          <Button
            onClick={() => setIsLooping(!isLooping)}
            variant={isLooping ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Repeat className="w-4 h-4" />
            {isLooping ? 'लूप ऑन' : 'लूप ऑफ'}
          </Button>
        </div>

        {/* Volume and Repetition Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">आवाज़ (Volume)</label>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="sm"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                step={0.1}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">पुनरावृत्ति (Repetitions)</label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <Slider
                value={repetitions}
                onValueChange={setRepetitions}
                min={1}
                max={108}
                step={1}
                className="flex-1"
              />
              <Badge variant="outline" className="min-w-[3rem] text-center">
                {repetitions[0]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress and Status */}
        {isPlaying && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">
                पुनरावृत्ति {currentRepetition} / {repetitions[0]}
              </span>
              <Badge variant="secondary" className="text-xs">
                {currentMode === 'sanskrit' ? 'संस्कृत' : 
                 currentMode === 'transliteration' ? 'Roman' : 'अर्थ'}
              </Badge>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Chanting Tips */}
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-sm font-medium text-amber-800 mb-1">जाप सुझाव (Chanting Tips)</h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• धीरे और स्पष्ट उच्चारण करें</li>
            <li>• सांस पर ध्यान दें</li>
            <li>• मन को मंत्र पर केंद्रित रखें</li>
            <li>• 108 बार जाप करना शुभ माना जाता है</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};