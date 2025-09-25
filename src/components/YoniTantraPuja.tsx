import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Lock, 
  Flower2, 
  Flame, 
  Heart, 
  Star, 
  Crown, 
  Shield, 
  CheckCircle,
  Circle,
  Eye,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Bell
} from 'lucide-react';
import { PujaIllustrations, StepIllustrations } from './PujaIllustrations';
import { GuruVoiceNarration } from './GuruVoiceNarration';
import { MantraAudioControls } from './MantraAudioControls';
import { PujaProgressTracker } from './PujaProgressTracker';

interface PujaStep {
  id: number;
  title: string;
  description: string;
  mantra?: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  actions: string[];
  duration: string;
  materials: string[];
}

interface PujaMaterial {
  name: string;
  sanskrit: string;
  purpose: string;
  essential: boolean;
}

interface YoniTantraPujaProps {
  onBack?: () => void;
  isAdvancedPractitioner?: boolean;
}

const YoniTantraPuja: React.FC<YoniTantraPujaProps> = ({ onBack, isAdvancedPractitioner = false }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showMaterials, setShowMaterials] = useState(true);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Sacred materials required for Yoni Puja
  const pujaMaterials: PujaMaterial[] = [
    {
      name: "Sacred Yoni Yantra",
      sanskrit: "योनि यन्त्र",
      purpose: "Central focus for worship and meditation",
      essential: true
    },
    {
      name: "Red Flowers",
      sanskrit: "रक्त पुष्प",
      purpose: "Offering to the Divine Feminine energy",
      essential: true
    },
    {
      name: "Ghee Lamp",
      sanskrit: "घृत दीप",
      purpose: "Illumination and purification",
      essential: true
    },
    {
      name: "Sandalwood Paste",
      sanskrit: "चन्दन",
      purpose: "Sacred marking and fragrance",
      essential: true
    },
    {
      name: "Red Kumkum",
      sanskrit: "कुमकुम",
      purpose: "Sacred tilaka and offerings",
      essential: true
    },
    {
      name: "Incense Sticks",
      sanskrit: "धूप",
      purpose: "Aromatic offering and purification",
      essential: true
    },
    {
      name: "Sacred Water",
      sanskrit: "पवित्र जल",
      purpose: "Purification and abhisheka",
      essential: true
    },
    {
      name: "Fresh Fruits",
      sanskrit: "ताज़े फल",
      purpose: "Naivedya offering to the Goddess",
      essential: false
    },
    {
      name: "Honey",
      sanskrit: "मधु",
      purpose: "Sweet offering representing bliss",
      essential: false
    },
    {
      name: "Rose Petals",
      sanskrit: "गुलाब पंखुड़ी",
      purpose: "Fragrant offering for beauty",
      essential: false
    },
    {
      name: "Sacred Thread",
      sanskrit: "पवित्र सूत्र",
      purpose: "Binding and protection",
      essential: false
    },
    {
      name: "Bell",
      sanskrit: "घंटा",
      purpose: "Invoking divine presence",
      essential: false
    }
  ];

  // Detailed step-by-step puja instructions
  const pujaSteps: PujaStep[] = [
    {
      id: 1,
      title: "Purification and Preparation",
      description: "Begin with complete purification of body, mind, and sacred space",
      mantra: {
        sanskrit: "ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत् पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥",
        transliteration: "Om Apavitrah Pavitro Va Sarvaavastham Gato'pi Va | Yah Smaret Pundarikaksham Sa Bahyabhyantarah Shuchih ||",
        meaning: "Whether pure or impure, in whatever state one may be, whoever remembers the lotus-eyed Lord becomes pure both externally and internally"
      },
      actions: [
        "Take a ritual bath with sacred herbs",
        "Wear clean, preferably red or white clothing",
        "Clean the puja space thoroughly",
        "Arrange all materials in proper order",
        "Light the ghee lamp and incense",
        "Sprinkle sacred water around the space while chanting purification mantras"
      ],
      duration: "15-20 minutes",
      materials: ["Sacred Water", "Ghee Lamp", "Incense Sticks"]
    },
    {
      id: 2,
      title: "Invocation of Ganesha",
      description: "Remove obstacles and seek blessings for the sacred ritual",
      mantra: {
        sanskrit: "ॐ गं गणपतये नमः",
        transliteration: "Om Gam Ganapataye Namah",
        meaning: "Salutations to Lord Ganesha, remover of obstacles"
      },
      actions: [
        "Face east and sit in padmasana",
        "Place hands in anjali mudra",
        "Chant the Ganesha mantra 108 times",
        "Offer red flowers to Ganesha",
        "Seek permission to begin the sacred ritual"
      ],
      duration: "10-15 minutes",
      materials: ["Red Flowers"]
    },
    {
      id: 3,
      title: "Establishment of Sacred Space",
      description: "Create the sacred mandala and establish divine presence",
      mantra: {
        sanskrit: "ॐ ह्रीं श्रीं क्लीं परमेश्वरि स्वाहा",
        transliteration: "Om Hreem Shreem Kleem Parameshwari Swaha",
        meaning: "Salutations to the Supreme Divine Mother"
      },
      actions: [
        "Draw a sacred circle with kumkum",
        "Place the Yoni Yantra in the center",
        "Mark the eight directions with sandalwood",
        "Establish the presence of the Divine Mother",
        "Invoke protection from all directions"
      ],
      duration: "10 minutes",
      materials: ["Red Kumkum", "Sandalwood Paste", "Sacred Yoni Yantra"]
    },
    {
      id: 4,
      title: "Pranayama and Meditation",
      description: "Purify the breath and center the consciousness",
      mantra: {
        sanskrit: "ॐ प्राणाय स्वाहा। ॐ अपानाय स्वाहा। ॐ व्यानाय स्वाहा। ॐ उदानाय स्वाहा। ॐ समानाय स्वाहा।",
        transliteration: "Om Pranaya Swaha | Om Apanaya Swaha | Om Vyanaya Swaha | Om Udanaya Swaha | Om Samanaya Swaha |",
        meaning: "Salutations to the five vital life forces - Prana, Apana, Vyana, Udana, and Samana"
      },
      actions: [
        "Perform Nadi Shodhana (alternate nostril breathing) while chanting prana mantras",
        "Practice Bhramari pranayama (bee breath) with Om vibration",
        "Enter deep meditative state with breath awareness",
        "Connect with the Divine Feminine within through breath",
        "Feel the sacred energy awakening with each breath cycle"
      ],
      duration: "15-20 minutes",
      materials: []
    },
    {
      id: 5,
      title: "Invocation of Divine Mother",
      description: "Call upon the Supreme Goddess in her Yoni aspect",
      mantra: {
        sanskrit: "ॐ ऐं ह्रीं श्रीं योनि देव्यै नमः",
        transliteration: "Om Aim Hreem Shreem Yoni Devyai Namah",
        meaning: "Salutations to the Goddess in her Yoni form"
      },
      actions: [
        "Chant the invocation mantra 108 times",
        "Visualize the Goddess manifesting",
        "Feel her divine presence filling the space",
        "Offer mental prostrations",
        "Request her grace and blessings"
      ],
      duration: "20 minutes",
      materials: ["Sacred Yoni Yantra"]
    },
    {
      id: 6,
      title: "Abhisheka (Sacred Bathing)",
      description: "Perform ritual bathing of the Yoni Yantra",
      mantra: {
        sanskrit: "ॐ ह्रीं योनि शुद्धये स्वाहा",
        transliteration: "Om Hreem Yoni Shuddhaye Swaha",
        meaning: "Om, for the purification of the sacred Yoni"
      },
      actions: [
        "Pour sacred water gently over the yantra",
        "Chant purification mantras",
        "Use honey for sweet abhisheka",
        "Wipe gently with clean cloth",
        "Apply fresh sandalwood paste"
      ],
      duration: "15 minutes",
      materials: ["Sacred Water", "Honey", "Sandalwood Paste"]
    },
    {
      id: 7,
      title: "Flower Offerings",
      description: "Offer flowers with deep devotion and reverence",
      mantra: {
        sanskrit: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः",
        transliteration: "Om Shreem Hreem Kleem Mahalakshmyai Namah",
        meaning: "Salutations to the Great Goddess Lakshmi"
      },
      actions: [
        "Offer red flowers one by one",
        "Chant the Goddess mantra with each flower",
        "Sprinkle rose petals around the yantra",
        "Create a beautiful flower mandala",
        "Express gratitude for feminine energy"
      ],
      duration: "10-15 minutes",
      materials: ["Red Flowers", "Rose Petals"]
    },
    {
      id: 8,
      title: "Kumkum and Tilaka",
      description: "Apply sacred marks and decorations",
      mantra: {
        sanskrit: "ॐ ललाटे केशवं ध्यायेत् नासिकायां त्रिलोचनम्। कण्ठे माधवं ध्यायेत् हृदये विष्णुमेव च॥",
        transliteration: "Om Lalate Keshavam Dhyayet Nasikayam Trilochanam | Kanthe Madhavam Dhyayet Hridaye Vishnumeva Cha ||",
        meaning: "Meditate on Keshava on the forehead, Trilochana on the nose, Madhava on the throat, and Vishnu in the heart"
      },
      actions: [
        "Apply kumkum to the yantra center while chanting tilaka mantras",
        "Create sacred geometric patterns with devotional focus",
        "Apply tilaka to your own forehead with reverence",
        "Mark the yantra with sacred symbols and Om",
        "Decorate with artistic devotion and mantra chanting"
      ],
      duration: "10 minutes",
      materials: ["Red Kumkum", "Sandalwood Paste"]
    },
    {
      id: 9,
      title: "Naivedya (Food Offering)",
      description: "Offer sacred food to the Divine Mother",
      mantra: {
        sanskrit: "ॐ अन्नपूर्णायै नमः",
        transliteration: "Om Annapurnayai Namah",
        meaning: "Salutations to the Goddess who provides nourishment"
      },
      actions: [
        "Offer fresh fruits to the Goddess",
        "Present honey as sweet offering",
        "Chant the nourishment mantra",
        "Request acceptance of the offerings",
        "Feel gratitude for life's sustenance"
      ],
      duration: "10 minutes",
      materials: ["Fresh Fruits", "Honey"]
    },
    {
      id: 10,
      title: "Aarti and Prayers",
      description: "Perform the sacred light ceremony",
      mantra: {
        sanskrit: "ॐ जय जगदम्बे हरे",
        transliteration: "Om Jaya Jagadambe Hare",
        meaning: "Victory to the Universal Mother"
      },
      actions: [
        "Light the ghee lamp",
        "Perform circular aarti movements",
        "Ring the bell rhythmically",
        "Sing devotional songs",
        "Feel the divine light within"
      ],
      duration: "15 minutes",
      materials: ["Ghee Lamp", "Bell"]
    },
    {
      id: 11,
      title: "Silent Meditation",
      description: "Merge in silent communion with the Divine Mother",
      mantra: {
        sanskrit: "ॐ शान्तिः शान्तिः शान्तिः। सोऽहं हंसः। हंसो सोऽहम्।",
        transliteration: "Om Shantih Shantih Shantih | So'ham Hamsah | Hamso So'ham |",
        meaning: "Om Peace, Peace, Peace. I am That. That I am. The divine swan breath of consciousness."
      },
      actions: [
        "Sit in complete stillness with natural breath awareness",
        "Merge consciousness with the Goddess through silent So'ham mantra",
        "Feel the sacred feminine energy pulsating within",
        "Experience unity and bliss in the eternal silence",
        "Rest in divine love and grace beyond all words"
      ],
      duration: "20-30 minutes",
      materials: []
    },
    {
      id: 12,
      title: "Gratitude and Conclusion",
      description: "Express gratitude and conclude the sacred ritual",
      mantra: {
        sanskrit: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
        transliteration: "Om Sarve Bhavantu Sukhinah Sarve Santu Niramayah",
        meaning: "May all beings be happy, may all beings be healthy"
      },
      actions: [
        "Offer final prostrations",
        "Express deep gratitude",
        "Chant universal peace mantras",
        "Distribute prasadam",
        "Carry the blessings forward"
      ],
      duration: "10 minutes",
      materials: ["Fresh Fruits"]
    }
  ];

  const handleUnlock = () => {
    // In a real application, this would involve proper authentication
    const confirmation = window.confirm(
      "This is a sacred and advanced Tantric practice. Do you approach this with proper reverence, preparation, and understanding of its sacred nature?"
    );
    if (confirmation) {
      setIsUnlocked(true);
    }
  };

  const toggleStep = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleStepComplete = (stepNumber: number) => {
    // stepNumber is 0-based index, but we store step IDs (1-based) in completedSteps
    const stepId = pujaSteps[stepNumber]?.id;
    if (stepId && !completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
    if (stepNumber === currentStep && stepNumber < pujaSteps.length - 1) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleStepChange = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  };

  // Enhanced step navigation with animations
  const nextStep = () => {
    if (currentStep < pujaSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetPuja = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-rose-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-rose-100 to-pink-100">
              <div className="flex justify-center mb-4">
                <Lock className="h-16 w-16 text-rose-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-rose-800 mb-2">
                योनि तन्त्र पूजा
              </CardTitle>
              <CardTitle className="text-2xl font-semibold text-rose-700 mb-4">
                Sacred Yoni Tantra Puja
              </CardTitle>
              <CardDescription className="text-lg text-rose-600">
                A Restricted Sacred Practice
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Alert className="mb-6 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800 font-semibold">
                  Sacred Warning
                </AlertTitle>
                <AlertDescription className="text-amber-700 mt-2">
                  This is an extremely sacred and advanced Tantric practice from the Yoni Tantra tradition. 
                  It requires proper initiation, spiritual maturity, and deep reverence for the Divine Feminine.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-rose-800 mb-4">Prerequisites:</h3>
                <ul className="space-y-2 text-rose-700">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-rose-600" />
                    Proper initiation from qualified Guru
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-rose-600" />
                    Deep reverence for Divine Feminine
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-rose-600" />
                    Advanced meditation experience
                  </li>
                  <li className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-rose-600" />
                    Spiritual maturity and purity of intention
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
              >
                <Lock className="h-5 w-5 mr-2" />
                Enter Sacred Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Sacred Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200 opacity-30">
          <Flower2 className="w-16 h-16 animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 text-orange-200 opacity-40">
          <Flame className="w-12 h-12 animate-bounce" />
        </div>
        <div className="absolute bottom-20 left-20 text-purple-200 opacity-30">
          <Crown className="w-14 h-14 animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 text-red-200 opacity-40">
          <Heart className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-yellow-200 opacity-20">
          <Star className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute top-1/3 right-1/3 text-indigo-200 opacity-25">
          <Sparkles className="w-12 h-12 animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with sacred elements */}
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="flex items-center gap-2 border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              <Eye className="w-4 h-4" />
              वापस जाएं
            </Button>
          )}
          
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Flower2 className="w-8 h-8 text-pink-500 animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                योनि तन्त्र पूजा
              </h1>
              <Flower2 className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">Sacred Yoni Tantra Puja</h2>
            <p className="text-lg text-rose-600 max-w-3xl mx-auto">
              A complete guide to the sacred Yoni Puja ceremony with detailed guru-shishya instructions, 
              authentic mantras, and traditional ritual procedures.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              गुप्त साधना
            </Badge>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6">
          <PujaProgressTracker 
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onStepComplete={handleStepComplete}
          />
        </div>

        {/* Guru Voice Narration Controls */}
        <div className="mb-6">
          <GuruVoiceNarration 
            step={currentStep}
            isPlaying={isNarrationPlaying}
            onPlayStateChange={setIsNarrationPlaying}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Materials Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-2 border-pink-200 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
              <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100">
                <CardTitle className="flex items-center text-rose-800">
                  <Flower2 className="h-6 w-6 mr-2 animate-pulse" />
                  पूजा सामग्री
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Sacred objects required for the ceremony
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowMaterials(!showMaterials)}
                  variant="outline"
                  className="w-full mb-4 border-pink-300 text-pink-700 hover:bg-pink-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showMaterials ? 'Hide Materials' : 'Show Materials'}
                </Button>
                
                {showMaterials && (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {pujaMaterials.map((material, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-rose-800 text-sm">{material.name}</h4>
                            {material.essential && (
                              <Badge variant="destructive" className="text-xs animate-pulse">आवश्यक</Badge>
                            )}
                          </div>
                          <p className="text-sm text-rose-600 mb-1 font-sanskrit">{material.sanskrit}</p>
                          <p className="text-xs text-rose-500">{material.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Step Display */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-purple-800">
                    <BookOpen className="h-6 w-6 mr-2 animate-pulse" />
                    गुरु-शिष्य निर्देश
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="text-purple-600 border-purple-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextStep}
                      disabled={currentStep === pujaSteps.length - 1}
                      className="text-purple-600 border-purple-300"
                    >
                      Next
                      <Eye className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPuja}
                      className="text-rose-600 border-rose-300"
                    >
                      <Circle className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-purple-600">
                  Step {currentStep + 1} of {pujaSteps.length}: Complete guidance from Guru to Shishya
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {pujaSteps[currentStep] && (
                  <div className="space-y-6">
                    {/* Current Step Illustration */}
                    <div className="text-center mb-6">
                      <StepIllustrations step={currentStep + 1} className="mx-auto" />
                    </div>

                    {/* Step Header */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStepComplete(currentStep)}
                          className="mr-3 p-2"
                        >
                          {completedSteps.includes(currentStep + 1) ? (
                            <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
                          ) : (
                            <Circle className="h-8 w-8 text-rose-400" />
                          )}
                        </Button>
                        <div>
                          <h2 className="text-2xl font-bold text-purple-800 mb-2">
                            {pujaSteps[currentStep].title}
                          </h2>
                          <Badge variant="outline" className="text-purple-600 border-purple-300 text-lg px-3 py-1">
                            {pujaSteps[currentStep].duration}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-lg text-purple-700 max-w-2xl mx-auto">
                        {pujaSteps[currentStep].description}
                      </p>
                    </div>

                    {/* Sacred Mantra Section */}
                    {pujaSteps[currentStep].mantra && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                        <h3 className="font-bold text-amber-800 mb-4 flex items-center text-xl">
                          <Star className="h-6 w-6 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                          पवित्र मंत्र - Sacred Mantra
                        </h3>
                        <div className="space-y-4 text-center">
                          <p className="text-2xl font-sanskrit text-amber-900 leading-relaxed">
                            {pujaSteps[currentStep].mantra!.sanskrit}
                          </p>
                          <p className="text-lg italic text-amber-700 font-medium">
                            {pujaSteps[currentStep].mantra!.transliteration}
                          </p>
                          <p className="text-base text-amber-600 max-w-xl mx-auto">
                            {pujaSteps[currentStep].mantra!.meaning}
                          </p>
                          
                          {/* Mantra Audio Controls */}
                          <div className="mt-4">
                            <MantraAudioControls 
                              mantra={pujaSteps[currentStep].mantra!}
                              stepNumber={currentStep + 1}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Section */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border-2 border-rose-200">
                      <h3 className="font-bold text-rose-800 mb-4 flex items-center text-xl">
                        <Heart className="h-6 w-6 mr-2 animate-pulse" />
                        कार्य - Actions to Perform
                      </h3>
                      <div className="grid gap-3">
                        {pujaSteps[currentStep].actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start p-3 bg-white rounded-lg border border-rose-200 hover:shadow-md transition-all duration-300">
                            <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <span className="text-rose-600 font-bold text-sm">{actionIndex + 1}</span>
                            </div>
                            <p className="text-rose-700 leading-relaxed">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Materials */}
                    {pujaSteps[currentStep].materials.length > 0 && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                        <h3 className="font-bold text-indigo-800 mb-4 flex items-center text-xl">
                          <Flower2 className="h-6 w-6 mr-2 animate-bounce" />
                          आवश्यक सामग्री - Required Materials
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {pujaSteps[currentStep].materials.map((material, materialIndex) => (
                            <Badge key={materialIndex} variant="secondary" className="text-indigo-700 bg-indigo-100 border-indigo-300 px-3 py-2 text-sm">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step Completion Button */}
                    <div className="text-center pt-6">
                      <Button
                        onClick={() => handleStepComplete(currentStep + 1)}
                        disabled={completedSteps.includes(currentStep + 1)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold"
                      >
                        {completedSteps.includes(currentStep + 1) ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            पूर्ण - Completed
                          </>
                        ) : (
                          <>
                            <Circle className="h-5 w-5 mr-2" />
                            पूर्ण करें - Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sacred Illustrations */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-2 border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
                <CardTitle className="flex items-center text-indigo-800">
                  <Sparkles className="h-6 w-6 mr-2 animate-pulse" />
                  पवित्र चित्र
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  Sacred visual guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <StepIllustrations step={currentStep + 1} />
                
                {/* Quick Navigation */}
                <div className="mt-6 space-y-2">
                  <h4 className="font-semibold text-indigo-800 mb-3">Quick Navigation</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {pujaSteps.map((step, index) => (
                      <Button
                        key={step.id}
                        variant={currentStep === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentStep(index)}
                        className={`text-xs p-2 ${
                          completedSteps.includes(step.id) 
                            ? 'bg-green-100 border-green-300 text-green-700' 
                            : currentStep === index
                            ? 'bg-indigo-600 text-white'
                            : 'border-indigo-300 text-indigo-600'
                        }`}
                      >
                        {completedSteps.includes(step.id) && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {step.id}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Progress Summary */}
        <Card className="mt-6 border-2 border-emerald-200 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50">
          <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100">
            <CardTitle className="text-emerald-800 flex items-center">
              <Crown className="h-6 w-6 mr-2 animate-pulse" />
              पूजा प्रगति - Puja Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-semibold text-lg">
                  पूर्ण चरण - Completed Steps: {completedSteps.length} / {pujaSteps.length}
                </span>
                <Badge 
                  variant={completedSteps.length === pujaSteps.length ? "default" : "secondary"}
                  className={`text-lg px-4 py-2 ${
                    completedSteps.length === pujaSteps.length 
                      ? 'bg-green-600 text-white animate-pulse' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {Math.round((completedSteps.length / pujaSteps.length) * 100)}%
                </Badge>
              </div>
              
              <div className="w-full bg-emerald-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(completedSteps.length / pujaSteps.length) * 100}%` }}
                />
              </div>
              
              {completedSteps.length === pujaSteps.length && (
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="h-8 w-8 text-yellow-600 animate-bounce mr-2" />
                    <span className="text-2xl font-bold text-yellow-800">पूजा पूर्ण!</span>
                    <Crown className="h-8 w-8 text-yellow-600 animate-bounce ml-2" />
                  </div>
                  <p className="text-yellow-700 font-medium">
                    Sacred Yoni Tantra Puja Completed Successfully
                  </p>
                  <p className="text-yellow-600 text-sm mt-2">
                    May the Divine Mother's blessings be with you always
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YoniTantraPuja;