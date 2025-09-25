import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Shuffle, 
  Play, 
  BookOpen, 
  Heart, 
  Zap, 
  Eye, 
  Brain, 
  Wind, 
  Sparkles, 
  Volume2, 
  Palette,
  Crown,
  Flame,
  Lock,
  Flower2,
  Clock,
  User,
  AlertTriangle,
  ListOrdered
} from 'lucide-react';
import { vigyanBhairavTantraTechniques, VBTTechnique, VBT_CATEGORIES } from '@/utils/vigyanBhairavTantra';
import { GuidedVBTSession } from './GuidedVBTSession';
import YoniTantraPuja from './YoniTantraPuja';

interface VBTGuideProps {
  onSelectTechnique?: (technique: VBTTechnique) => void;
  selectedTechnique?: VBTTechnique | null;
}

export const VigyanBhairavTantraGuide: React.FC<VBTGuideProps> = ({ onSelectTechnique, selectedTechnique }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentTechnique, setCurrentTechnique] = useState<VBTTechnique | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showGuidedSession, setShowGuidedSession] = useState(false);
  const [showYoniTantra, setShowYoniTantra] = useState(false);
  const [isAdvancedPractitioner, setIsAdvancedPractitioner] = useState(false);

  // Category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    'BREATH': <Wind className="w-4 h-4" />,
    'BODY': <Heart className="w-4 h-4" />,
    'AWARENESS': <Eye className="w-4 h-4" />,
    'MIND': <Brain className="w-4 h-4" />,
    'ENERGY': <Zap className="w-4 h-4" />,
    'SOUND': <Volume2 className="w-4 h-4" />,
    'VISUALIZATION': <Sparkles className="w-4 h-4" />,
    'DEVOTION': <Heart className="w-4 h-4" />,
    'TANTRIC': <Sparkles className="w-4 h-4" />
  };

  // Difficulty colors
  const difficultyColors: Record<string, string> = {
    'Beginner': 'bg-green-100 text-green-800 border-green-300',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Advanced': 'bg-red-100 text-red-800 border-red-300'
  };

  // Filter techniques based on search and filters
  const filteredTechniques = useMemo(() => {
    return vigyanBhairavTantraTechniques.filter(technique => {
      const matchesSearch = technique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           technique.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || technique.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || technique.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleTechniqueSelect = (technique: VBTTechnique) => {
    if (onSelectTechnique) {
      onSelectTechnique(technique);
    }
    setShowDetails(false);
  };

  const getRandomTechnique = () => {
    const randomIndex = Math.floor(Math.random() * vigyanBhairavTantraTechniques.length);
    const randomTechnique = vigyanBhairavTantraTechniques[randomIndex];
    setCurrentTechnique(randomTechnique);
    setShowDetails(true);
  };

  const categories = Array.from(new Set(vigyanBhairavTantraTechniques.map(t => t.category)));
  const difficulties = Array.from(new Set(vigyanBhairavTantraTechniques.map(t => t.difficulty)));

  // If showing Yoni Tantra section, render that instead
  if (showYoniTantra) {
    return (
      <YoniTantraPuja
        onBack={() => setShowYoniTantra(false)}
        isAdvancedPractitioner={isAdvancedPractitioner}
      />
    );
  }

  // If showing guided session, render that instead
  if (showGuidedSession && currentTechnique) {
    return (
      <GuidedVBTSession
        technique={currentTechnique}
        onBack={() => {
          setShowGuidedSession(false);
          setCurrentTechnique(null);
        }}
        onComplete={() => {
          setShowGuidedSession(false);
          setCurrentTechnique(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Vigyan Bhairav Tantra
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover 112 sacred meditation techniques from the ancient tantric text. 
          Each technique offers a unique path to consciousness and self-realization.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={getRandomTechnique}
            className="flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Random
          </Button>

          {/* Yoni Tantra Access Button */}
          <Button
            variant="outline"
            onClick={() => setShowYoniTantra(true)}
            className="flex items-center gap-2 border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            <Flower2 className="w-4 h-4" />
            <Lock className="w-3 h-3" />
            Yoni Tantra
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          {filteredTechniques.length} of {vigyanBhairavTantraTechniques.length} techniques
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((technique) => (
          <Card 
            key={technique.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-400"
            onClick={() => {
              setCurrentTechnique(technique);
              setShowDetails(true);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {categoryIcons[technique.category]}
                  <Badge variant="outline" className="text-xs">
                    #{technique.id}
                  </Badge>
                </div>
                <Badge className={difficultyColors[technique.difficulty]}>
                  {technique.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg text-purple-800 leading-tight">
                {technique.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {technique.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {technique.duration}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {technique.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTechniques.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No techniques found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Technique Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {currentTechnique && categoryIcons[currentTechnique.category]}
              <span>{currentTechnique?.title}</span>
              <Badge className={currentTechnique ? difficultyColors[currentTechnique.difficulty] : ''}>
                {currentTechnique?.difficulty}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {currentTechnique && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <p className="text-gray-700 leading-relaxed">
                  {currentTechnique.description}
                </p>

                {/* Steps */}
                {currentTechnique.steps && currentTechnique.steps.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ListOrdered className="w-4 h-4" />
                        Step-by-Step Guide
                      </h4>
                      <ol className="space-y-2">
                        {currentTechnique.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-600 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
                
                <Separator />
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Duration</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-gray-600">{currentTechnique.duration}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <div className="flex items-center gap-2">
                      {categoryIcons[currentTechnique.category]}
                      <span className="text-gray-600">{currentTechnique.category}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Benefits */}
                {currentTechnique.benefits && currentTechnique.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {currentTechnique.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Prerequisites */}
                {currentTechnique.prerequisites && currentTechnique.prerequisites.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Prerequisites
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {currentTechnique.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                
                {/* Warnings */}
                {currentTechnique.warnings && currentTechnique.warnings.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="w-4 h-4" />
                        Important Notes
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-yellow-700">
                        {currentTechnique.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => {
                setShowGuidedSession(true);
                setShowDetails(false);
              }}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <User className="w-4 h-4 mr-2" />
              Guided Session
            </Button>
            <Button 
              onClick={() => currentTechnique && handleTechniqueSelect(currentTechnique)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Practice This Technique
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VigyanBhairavTantraGuide;