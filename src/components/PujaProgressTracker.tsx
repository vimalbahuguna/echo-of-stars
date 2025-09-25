import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Star, 
  Flame, 
  Flower2,
  Heart,
  Crown,
  Sparkles,
  Timer,
  Award,
  Target
} from 'lucide-react';

interface PujaStep {
  id: number;
  title: string;
  titleHindi: string;
  duration: number; // in minutes
  isCompleted: boolean;
  isActive: boolean;
  completedAt?: Date;
}

interface PujaProgressTrackerProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepComplete: (step: number) => void;
  className?: string;
}

export const PujaProgressTracker: React.FC<PujaProgressTrackerProps> = ({
  currentStep,
  onStepChange,
  onStepComplete,
  className = ""
}) => {
  const [steps, setSteps] = useState<PujaStep[]>([
    { id: 1, title: "Purification", titleHindi: "शुद्धिकरण", duration: 5, isCompleted: false, isActive: false },
    { id: 2, title: "Ganesha Prayer", titleHindi: "गणेश प्रार्थना", duration: 3, isCompleted: false, isActive: false },
    { id: 3, title: "Sacred Space", titleHindi: "पवित्र स्थान", duration: 7, isCompleted: false, isActive: false },
    { id: 4, title: "Pranayama", titleHindi: "प्राणायाम", duration: 10, isCompleted: false, isActive: false },
    { id: 5, title: "Divine Mother", titleHindi: "दिव्य माता", duration: 8, isCompleted: false, isActive: false },
    { id: 6, title: "Abhisheka", titleHindi: "अभिषेक", duration: 12, isCompleted: false, isActive: false },
    { id: 7, title: "Flower Offering", titleHindi: "पुष्प अर्पण", duration: 6, isCompleted: false, isActive: false },
    { id: 8, title: "Kumkum & Tilaka", titleHindi: "कुमकुम तिलक", duration: 4, isCompleted: false, isActive: false },
    { id: 9, title: "Food Offering", titleHindi: "नैवेद्य", duration: 5, isCompleted: false, isActive: false },
    { id: 10, title: "Aarti", titleHindi: "आरती", duration: 8, isCompleted: false, isActive: false },
    { id: 11, title: "Silent Meditation", titleHindi: "मौन ध्यान", duration: 15, isCompleted: false, isActive: false },
    { id: 12, title: "Gratitude", titleHindi: "कृतज्ञता", duration: 5, isCompleted: false, isActive: false }
  ]);

  const [totalTime, setTotalTime] = useState(0);
  const [completedTime, setCompletedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Update steps based on current step
  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        isActive: step.id === currentStep,
        isCompleted: step.id < currentStep || step.isCompleted
      }))
    );
  }, [currentStep]);

  // Calculate total and completed time
  useEffect(() => {
    const total = steps.reduce((sum, step) => sum + step.duration, 0);
    const completed = steps.filter(step => step.isCompleted).reduce((sum, step) => sum + step.duration, 0);
    setTotalTime(total);
    setCompletedTime(completed);
  }, [steps]);

  // Track session duration
  useEffect(() => {
    if (!startTime && currentStep > 1) {
      setStartTime(new Date());
    }

    const interval = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60); // in minutes
        setSessionDuration(duration);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime, currentStep]);

  const handleStepComplete = (stepId: number) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? { ...step, isCompleted: true, completedAt: new Date() }
          : step
      )
    );
    onStepComplete(stepId);
  };

  const getStepIcon = (step: PujaStep) => {
    if (step.isCompleted) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (step.isActive) return <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getProgressColor = () => {
    const progress = (completedTime / totalTime) * 100;
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className={`border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-indigo-800">पूजा प्रगति (Puja Progress)</h3>
          <Crown className="w-5 h-5 text-purple-500" />
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-indigo-700">समग्र प्रगति (Overall Progress)</span>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              {completedSteps} / {steps.length} चरण
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{Math.round(progressPercentage)}% पूर्ण</span>
            <span>{totalTime - completedTime} मिनट शेष</span>
          </div>
        </div>

        {/* Time Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-white/70 rounded-lg border border-indigo-200">
            <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-indigo-800">{sessionDuration}</div>
            <div className="text-xs text-indigo-600">मिनट बीते</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg border border-green-200">
            <Timer className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-green-800">{completedTime}</div>
            <div className="text-xs text-green-600">पूर्ण समय</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg border border-orange-200">
            <Star className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-orange-800">{totalTime - completedTime}</div>
            <div className="text-xs text-orange-600">शेष समय</div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                step.isActive
                  ? 'bg-orange-100 border-orange-300 shadow-md'
                  : step.isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white/50 border-gray-200 hover:bg-white/80'
              }`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium truncate ${
                    step.isActive ? 'text-orange-800' : 
                    step.isCompleted ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {step.titleHindi}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {step.duration}मिनट
                  </Badge>
                </div>
                <p className={`text-sm truncate ${
                  step.isActive ? 'text-orange-600' : 
                  step.isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                {step.completedAt && (
                  <p className="text-xs text-green-500 mt-1">
                    पूर्ण: {step.completedAt.toLocaleTimeString('hi-IN')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!step.isCompleted && step.isActive && (
                  <Button
                    onClick={() => handleStepComplete(step.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    पूर्ण
                  </Button>
                )}
                
                {!step.isActive && !step.isCompleted && (
                  <Button
                    onClick={() => onStepChange(step.id)}
                    variant="outline"
                    size="sm"
                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                  >
                    जाएं
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Celebration */}
        {completedSteps === steps.length && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
            <div className="text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                🎉 पूजा संपन्न! 🎉
              </h3>
              <p className="text-sm text-green-700 mb-2">
                आपने सफलतापूर्वक योनि तंत्र पूजा पूर्ण की है
              </p>
              <div className="flex justify-center gap-4 text-xs text-green-600">
                <span>कुल समय: {sessionDuration} मिनट</span>
                <span>•</span>
                <span>सभी {steps.length} चरण पूर्ण</span>
              </div>
            </div>
          </div>
        )}

        {/* Sacred Elements */}
        <div className="mt-4 flex justify-center gap-2 opacity-60">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <Flower2 className="w-4 h-4 text-pink-400" />
          <Heart className="w-4 h-4 text-red-400" />
          <Flower2 className="w-4 h-4 text-pink-400" />
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};