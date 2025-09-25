import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Mic,
  Crown,
  Heart
} from 'lucide-react';

interface GuruNarrationProps {
  step: number;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  className?: string;
}

interface NarrationContent {
  introduction: string;
  instruction: string;
  mantraGuidance: string;
  completion: string;
}

export const GuruVoiceNarration: React.FC<GuruNarrationProps> = ({ 
  step, 
  isPlaying, 
  onPlayStateChange, 
  className = "" 
}) => {
  const [currentPhase, setCurrentPhase] = useState<'introduction' | 'instruction' | 'mantra' | 'completion'>('introduction');
  const [volume, setVolume] = useState([0.7]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Guru narration content for each step
  const narrationContent: Record<number, NarrationContent> = {
    1: {
      introduction: "प्रिय शिष्य, हम आज पवित्र योनि तंत्र पूजा की शुरुआत करते हैं। सबसे पहले अपने मन, शरीर और आत्मा को शुद्ध करना आवश्यक है।",
      instruction: "अपने हाथों को जल से धोएं, गहरी सांस लें और अपने चारों ओर की नकारात्मक ऊर्जा को दूर करने का संकल्प लें। पवित्र जल से अपने चेहरे और हाथों को स्पर्श करें।",
      mantraGuidance: "अब मेरे साथ इस मंत्र का उच्चारण करें: 'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत् पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥'",
      completion: "उत्तम। आपने शुद्धिकरण की प्रक्रिया पूर्ण की है। अब आप अगले चरण के लिए तैयार हैं।"
    },
    2: {
      introduction: "अब हम भगवान गणेश का आशीर्वाद प्राप्त करेंगे। सभी शुभ कार्यों की शुरुआत गणपति वंदना से होती है।",
      instruction: "अपने हाथों को जोड़कर हृदय के सामने रखें। गणेश जी की मूर्ति या चित्र की ओर देखते हुए श्रद्धा से प्रणाम करें।",
      mantraGuidance: "मेरे साथ गणेश मंत्र का जाप करें: 'ॐ गं गणपतये नमः। वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'",
      completion: "गणेश जी का आशीर्वाद प्राप्त हो गया है। अब आपका पूजा पथ निर्विघ्न होगा।"
    },
    3: {
      introduction: "अब हम पवित्र स्थान का निर्माण करेंगे। यह स्थान दिव्य ऊर्जा से भरपूर होगा।",
      instruction: "लाल कपड़े को बिछाएं, योनि यंत्र को केंद्र में स्थापित करें। चारों दिशाओं में दीप जलाएं और पवित्र वातावरण बनाएं।",
      mantraGuidance: "स्थान की पवित्रता के लिए मंत्र: 'ॐ भूर्भुवः स्वः। तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥'",
      completion: "पवित्र क्षेत्र तैयार हो गया है। दिव्य शक्ति इस स्थान में विराजमान है।"
    },
    4: {
      introduction: "प्राणायाम के माध्यम से हम अपनी चेतना को उच्च स्तर पर ले जाएंगे।",
      instruction: "सुखासन में बैठें, रीढ़ सीधी रखें। नासिका से धीरे-धीरे सांस लें, कुछ क्षण रोकें, फिर धीरे छोड़ें।",
      mantraGuidance: "सांस के साथ मंत्र: 'सो हं' - सांस अंदर लेते समय 'सो', छोड़ते समय 'हं'। यह आत्मा की आवाज है।",
      completion: "प्राणायाम से आपकी चेतना शुद्ध हो गई है। अब आप दिव्य अनुभव के लिए तैयार हैं।"
    },
    5: {
      introduction: "अब हम दिव्य माता की उपासना करेंगे। वे सृष्टि की आदि शक्ति हैं।",
      instruction: "हाथ जोड़कर माता के सामने झुकें। उनकी कृपा और आशीर्वाद की प्रार्थना करें।",
      mantraGuidance: "माता का मंत्र: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे। या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥'",
      completion: "माता का आशीर्वाद प्राप्त हुआ है। उनकी शक्ति आपमें प्रवाहित हो रही है।"
    },
    6: {
      introduction: "अभिषेक के द्वारा हम योनि यंत्र को पवित्र करेंगे।",
      instruction: "पवित्र जल, दूध और घी से धीरे-धीरे यंत्र का अभिषेक करें। प्रत्येक बूंद के साथ श्रद्धा रखें।",
      mantraGuidance: "अभिषेक मंत्र: 'ॐ ह्रीं श्रीं क्लीं परमेश्वरि स्वाहा। गंगे च यमुने चैव गोदावरि सरस्वति। नर्मदे सिन्धु कावेरि जलेऽस्मिन् संनिधिं कुरु॥'",
      completion: "अभिषेक पूर्ण हुआ। यंत्र अब दिव्य ऊर्जा से चार्ज हो गया है।"
    },
    7: {
      introduction: "पुष्प अर्पण के द्वारा हम प्रकृति की सुंदरता को समर्पित करते हैं।",
      instruction: "लाल फूलों को एक-एक करके यंत्र पर चढ़ाएं। प्रत्येक फूल के साथ प्रेम और श्रद्धा भाव रखें।",
      mantraGuidance: "पुष्प अर्पण मंत्र: 'ॐ पुष्पं पुष्पं पुष्पं। एतत् पुष्पं समर्पयामि। या देवी पुष्पमाल्यादि प्रिया सा मे प्रसीदतु॥'",
      completion: "फूलों का अर्पण स्वीकार हुआ है। दिव्य सुगंध से वातावरण पवित्र हो गया है।"
    },
    8: {
      introduction: "कुमकुम और तिलक से हम पवित्र चिह्न बनाएंगे।",
      instruction: "कुमकुम से यंत्र पर तिलक लगाएं, अपने मस्तक पर भी तिलक करें। यह दिव्य संबंध का प्रतीक है।",
      mantraGuidance: "तिलक मंत्र: 'ॐ केशवाय नमः। ललाटे केशवं ध्यायेत्। नारायणं अथोरसि। गोविन्दं कण्ठदेशे तु विष्णुं हृदि तु संस्मरेत्॥'",
      completion: "तिलक से आपका दिव्य चिह्न पूर्ण हुआ। आप अब पवित्र ऊर्जा से जुड़े हैं।"
    },
    9: {
      introduction: "नैवेद्य के रूप में हम प्रकृति के उपहार समर्पित करते हैं।",
      instruction: "फल और मिठाई को यंत्र के सामने रखें। इन्हें प्रेम और कृतज्ञता के साथ अर्पित करें।",
      mantraGuidance: "नैवेद्य मंत्र: 'ॐ प्राणाय स्वाहा, अपानाय स्वाहा, व्यानाय स्वाहा, उदानाय स्वाहा, समानाय स्वाहा, ब्रह्मणे स्वाहा॥'",
      completion: "नैवेद्य स्वीकार हुआ है। आपका समर्पण भाव सराहनीय है।"
    },
    10: {
      introduction: "आरती के द्वारा हम प्रकाश और भक्ति का समर्पण करते हैं।",
      instruction: "दीप जलाकर यंत्र के चारों ओर वृत्ताकार गति में घुमाएं। मन में भक्ति भाव रखें।",
      mantraGuidance: "आरती मंत्र: 'ॐ ज्योति स्वरूपे ज्योतिर्मये ज्योति। त्वमेव माता च पिता त्वमेव। त्वमेव बन्धुश्च सखा त्वमेव। त्वमेव विद्या द्रविणं त्वमेव॥'",
      completion: "आरती से दिव्य प्रकाश चारों ओर फैल गया है। आपकी भक्ति स्वीकार हुई है।"
    },
    11: {
      introduction: "अब मौन ध्यान में जाकर आंतरिक शांति का अनुभव करें।",
      instruction: "आंखें बंद करें, मन को शांत करें। केवल अपनी सांस पर ध्यान दें। किसी भी विचार को आने-जाने दें।",
      mantraGuidance: "मौन में केवल 'ॐ' की ध्वनि सुनें। यह ब्रह्मांड की आदि ध्वनि है। इसे अपने हृदय में अनुभव करें।",
      completion: "मौन ध्यान में आपने अपने सच्चे स्वरूप का दर्शन किया है। यह अमूल्य अनुभव है।"
    },
    12: {
      introduction: "अब हम कृतज्ञता के साथ इस पवित्र पूजा का समापन करते हैं।",
      instruction: "हाथ जोड़कर सभी देवी-देवताओं को धन्यवाद दें। इस अनुभव के लिए आभार व्यक्त करें।",
      mantraGuidance: "समापन मंत्र: 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत्। ॐ शान्तिः शान्तिः शान्तिः॥'",
      completion: "पूजा का समापन हुआ। आपने दिव्य अनुभव प्राप्त किया है। यह ज्ञान आपके जीवन में शांति और आनंद लाएगा।"
    }
  };

  const currentContent = narrationContent[step] || narrationContent[1];

  // Text-to-Speech functionality
  const speak = (text: string, phase: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Hindi language
      utterance.rate = 0.8; // Slower, more meditative pace
      utterance.pitch = 0.9; // Slightly lower pitch for guru voice
      utterance.volume = isMuted ? 0 : volume[0];
      
      utterance.onstart = () => {
        onPlayStateChange(true);
        setCurrentPhase(phase as any);
      };
      
      utterance.onend = () => {
        onPlayStateChange(false);
        setProgress(0);
      };
      
      utterance.onerror = () => {
        onPlayStateChange(false);
      };
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
      // Simulate progress
      const estimatedDuration = text.length * 100; // Rough estimate
      setDuration(estimatedDuration);
      
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 100;
          }
          return prev + 1;
        });
      }, estimatedDuration / 100);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onPlayStateChange(false);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      const phaseTexts = [
        { phase: 'introduction', text: currentContent.introduction },
        { phase: 'instruction', text: currentContent.instruction },
        { phase: 'mantra', text: currentContent.mantraGuidance },
        { phase: 'completion', text: currentContent.completion }
      ];
      
      const currentPhaseIndex = phaseTexts.findIndex(p => p.phase === currentPhase);
      const nextPhase = phaseTexts[currentPhaseIndex] || phaseTexts[0];
      
      speak(nextPhase.text, nextPhase.phase);
    }
  };

  const playPhase = (phase: 'introduction' | 'instruction' | 'mantra' | 'completion') => {
    stopSpeech();
    const text = currentContent[phase];
    speak(text, phase);
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <Card className={`border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-orange-800">गुरु वाणी (Guru Voice)</h3>
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        
        {/* Main Controls */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={togglePlayPause}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'रोकें' : 'सुनें'}
          </Button>
          
          <Button
            onClick={stopSpeech}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            रीसेट
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
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

        {/* Progress Bar */}
        {isPlaying && (
          <div className="mb-4">
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-orange-700 mt-1">
              चरण {step} - {currentPhase === 'introduction' ? 'परिचय' : 
                           currentPhase === 'instruction' ? 'निर्देश' :
                           currentPhase === 'mantra' ? 'मंत्र' : 'समापन'}
            </p>
          </div>
        )}

        {/* Phase Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            onClick={() => playPhase('introduction')}
            variant={currentPhase === 'introduction' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Mic className="w-3 h-3 mr-1" />
            परिचय
          </Button>
          <Button
            onClick={() => playPhase('instruction')}
            variant={currentPhase === 'instruction' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Mic className="w-3 h-3 mr-1" />
            निर्देश
          </Button>
          <Button
            onClick={() => playPhase('mantra')}
            variant={currentPhase === 'mantra' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Mic className="w-3 h-3 mr-1" />
            मंत्र
          </Button>
          <Button
            onClick={() => playPhase('completion')}
            variant={currentPhase === 'completion' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Mic className="w-3 h-3 mr-1" />
            समापन
          </Button>
        </div>

        {/* Current Text Display */}
        <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-2">
            {currentPhase === 'introduction' ? 'परिचय' : 
             currentPhase === 'instruction' ? 'निर्देश' :
             currentPhase === 'mantra' ? 'मंत्र जाप' : 'समापन'}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentContent[currentPhase]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};