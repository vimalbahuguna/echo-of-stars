import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  Gem, 
  Sun, 
  Moon, 
  Star, 
  Flower2, 
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calendar
} from "lucide-react";

interface Planet {
  name: string;
  house: number;
  sign?: string;
  degree?: number;
  longitude: number;
  isRetrograde?: boolean;
  strength?: 'weak' | 'moderate' | 'strong';
}

interface Remedy {
  id: string;
  type: 'gemstone' | 'mantra' | 'charity' | 'ritual' | 'lifestyle' | 'yantra';
  planet: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  cost: 'low' | 'medium' | 'high';
  effectiveness: number; // 1-10
  isCompleted?: boolean;
}

interface RemedialMeasuresProps {
  planets: Planet[];
  weakPlanets?: string[];
  afflictedHouses?: number[];
}

// Comprehensive remedy database
const remedyDatabase: Remedy[] = [
  // Sun Remedies
  {
    id: 'sun-mantra-1',
    type: 'mantra',
    planet: 'Sun',
    title: 'Surya Mantra',
    description: 'Chant the powerful Surya mantra to strengthen the Sun',
    instructions: [
      'Chant "Om Hraam Hreem Hraum Sah Suryaya Namaha" 108 times',
      'Best time: Early morning during sunrise',
      'Face east while chanting',
      'Use a rudraksha or crystal mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },
  {
    id: 'sun-gemstone-1',
    type: 'gemstone',
    planet: 'Sun',
    title: 'Ruby Gemstone',
    description: 'Wear a natural ruby to enhance Sun\'s positive energy',
    instructions: [
      'Wear a 3-5 carat natural ruby',
      'Set in gold ring or pendant',
      'Wear on ring finger of right hand',
      'Energize on Sunday morning'
    ],
    duration: 'Permanent',
    difficulty: 'moderate',
    cost: 'high',
    effectiveness: 9
  },
  {
    id: 'sun-charity-1',
    type: 'charity',
    planet: 'Sun',
    title: 'Sunday Charity',
    description: 'Donate items related to Sun on Sundays',
    instructions: [
      'Donate wheat, jaggery, or copper items',
      'Give to temples or needy people',
      'Donate on Sundays only',
      'Do with pure intentions'
    ],
    duration: '11 Sundays',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 7
  },

  // Moon Remedies
  {
    id: 'moon-mantra-1',
    type: 'mantra',
    planet: 'Moon',
    title: 'Chandra Mantra',
    description: 'Strengthen the Moon with this powerful mantra',
    instructions: [
      'Chant "Om Shraam Shreem Shraum Sah Chandraya Namaha" 108 times',
      'Best time: Monday evening or full moon night',
      'Sit near water or under moonlight',
      'Use pearl or silver mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },
  {
    id: 'moon-gemstone-1',
    type: 'gemstone',
    planet: 'Moon',
    title: 'Pearl Gemstone',
    description: 'Wear natural pearl for emotional balance and Moon strength',
    instructions: [
      'Wear a 4-6 carat natural pearl',
      'Set in silver ring or pendant',
      'Wear on ring finger of right hand',
      'Energize on Monday evening'
    ],
    duration: 'Permanent',
    difficulty: 'moderate',
    cost: 'medium',
    effectiveness: 9
  },

  // Mars Remedies
  {
    id: 'mars-mantra-1',
    type: 'mantra',
    planet: 'Mars',
    title: 'Mangal Mantra',
    description: 'Pacify Mars energy with this mantra',
    instructions: [
      'Chant "Om Kraam Kreem Kraum Sah Bhaumaya Namaha" 108 times',
      'Best time: Tuesday morning',
      'Face south while chanting',
      'Use red coral or rudraksha mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },
  {
    id: 'mars-charity-1',
    type: 'charity',
    planet: 'Mars',
    title: 'Tuesday Donations',
    description: 'Donate red items on Tuesdays to pacify Mars',
    instructions: [
      'Donate red lentils, red cloth, or jaggery',
      'Give to temples or poor people',
      'Donate on Tuesdays only',
      'Include red flowers if possible'
    ],
    duration: '11 Tuesdays',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 7
  },

  // Mercury Remedies
  {
    id: 'mercury-mantra-1',
    type: 'mantra',
    planet: 'Mercury',
    title: 'Budh Mantra',
    description: 'Enhance Mercury for better communication and intelligence',
    instructions: [
      'Chant "Om Braam Breem Braum Sah Budhaya Namaha" 108 times',
      'Best time: Wednesday morning',
      'Face north while chanting',
      'Use emerald or tulsi mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },

  // Jupiter Remedies
  {
    id: 'jupiter-mantra-1',
    type: 'mantra',
    planet: 'Jupiter',
    title: 'Guru Mantra',
    description: 'Strengthen Jupiter for wisdom and prosperity',
    instructions: [
      'Chant "Om Graam Greem Graum Sah Gurave Namaha" 108 times',
      'Best time: Thursday morning',
      'Face northeast while chanting',
      'Use yellow sapphire or turmeric mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 9
  },
  {
    id: 'jupiter-charity-1',
    type: 'charity',
    planet: 'Jupiter',
    title: 'Thursday Donations',
    description: 'Donate yellow items on Thursdays for Jupiter\'s blessings',
    instructions: [
      'Donate turmeric, yellow cloth, or books',
      'Give to temples, teachers, or students',
      'Donate on Thursdays only',
      'Include yellow flowers'
    ],
    duration: '11 Thursdays',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },

  // Venus Remedies
  {
    id: 'venus-mantra-1',
    type: 'mantra',
    planet: 'Venus',
    title: 'Shukra Mantra',
    description: 'Enhance Venus for love, beauty, and prosperity',
    instructions: [
      'Chant "Om Draam Dreem Draum Sah Shukraya Namaha" 108 times',
      'Best time: Friday morning or evening',
      'Face southeast while chanting',
      'Use diamond or white flower mala'
    ],
    duration: '40 days minimum',
    difficulty: 'easy',
    cost: 'low',
    effectiveness: 8
  },

  // Saturn Remedies
  {
    id: 'saturn-mantra-1',
    type: 'mantra',
    planet: 'Saturn',
    title: 'Shani Mantra',
    description: 'Pacify Saturn for reducing obstacles and delays',
    instructions: [
      'Chant "Om Praam Preem Praum Sah Shanaischaraya Namaha" 108 times',
      'Best time: Saturday evening',
      'Face west while chanting',
      'Use black sesame or iron mala'
    ],
    duration: '40 days minimum',
    difficulty: 'moderate',
    cost: 'low',
    effectiveness: 9
  },
  {
    id: 'saturn-charity-1',
    type: 'charity',
    planet: 'Saturn',
    title: 'Saturday Service',
    description: 'Serve the underprivileged on Saturdays to appease Saturn',
    instructions: [
      'Donate black sesame, oil, or iron items',
      'Serve food to poor or elderly',
      'Help disabled or disadvantaged people',
      'Do on Saturdays consistently'
    ],
    duration: '11 Saturdays',
    difficulty: 'moderate',
    cost: 'low',
    effectiveness: 9
  },

  // Rahu Remedies
  {
    id: 'rahu-mantra-1',
    type: 'mantra',
    planet: 'Rahu',
    title: 'Rahu Mantra',
    description: 'Control Rahu\'s malefic effects with this mantra',
    instructions: [
      'Chant "Om Bhram Bhreem Bhraum Sah Rahave Namaha" 108 times',
      'Best time: Saturday evening or Rahu kaal',
      'Face southwest while chanting',
      'Use hessonite or rudraksha mala'
    ],
    duration: '40 days minimum',
    difficulty: 'moderate',
    cost: 'low',
    effectiveness: 8
  },

  // Ketu Remedies
  {
    id: 'ketu-mantra-1',
    type: 'mantra',
    planet: 'Ketu',
    title: 'Ketu Mantra',
    description: 'Balance Ketu\'s energy for spiritual growth',
    instructions: [
      'Chant "Om Sraam Sreem Sraum Sah Ketave Namaha" 108 times',
      'Best time: Tuesday evening',
      'Face northwest while chanting',
      'Use cat\'s eye or rudraksha mala'
    ],
    duration: '40 days minimum',
    difficulty: 'moderate',
    cost: 'low',
    effectiveness: 8
  }
];

const RemedialMeasures: React.FC<RemedialMeasuresProps> = ({ 
  planets, 
  weakPlanets = [], 
  afflictedHouses = [] 
}) => {
  const [completedRemedies, setCompletedRemedies] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlanet, setSelectedPlanet] = useState('all');

  // Analyze chart and suggest remedies
  const getRecommendedRemedies = (): Remedy[] => {
    const recommended: Remedy[] = [];
    
    // Add remedies for weak planets
    weakPlanets.forEach(planet => {
      const planetRemedies = remedyDatabase.filter(r => r.planet === planet);
      recommended.push(...planetRemedies);
    });
    
    // If no specific weak planets, suggest general strengthening remedies
    if (weakPlanets.length === 0) {
      // Add top remedies for each planet
      const topRemedies = remedyDatabase.filter(r => r.effectiveness >= 8);
      recommended.push(...topRemedies.slice(0, 6));
    }
    
    return recommended;
  };

  // Filter remedies based on selection
  const getFilteredRemedies = (): Remedy[] => {
    let remedies = getRecommendedRemedies();
    
    if (selectedCategory !== 'all') {
      remedies = remedies.filter(r => r.type === selectedCategory);
    }
    
    if (selectedPlanet !== 'all') {
      remedies = remedies.filter(r => r.planet === selectedPlanet);
    }
    
    return remedies;
  };

  // Toggle remedy completion
  const toggleRemedyCompletion = (remedyId: string) => {
    setCompletedRemedies(prev => 
      prev.includes(remedyId) 
        ? prev.filter(id => id !== remedyId)
        : [...prev, remedyId]
    );
  };

  // Get remedy type icon
  const getRemedyIcon = (type: string) => {
    switch (type) {
      case 'gemstone': return <Gem className="w-4 h-4" />;
      case 'mantra': return <Star className="w-4 h-4" />;
      case 'charity': return <Gift className="w-4 h-4" />;
      case 'ritual': return <Flower2 className="w-4 h-4" />;
      case 'lifestyle': return <Heart className="w-4 h-4" />;
      case 'yantra': return <Sun className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get cost color
  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get planet color
  const getPlanetColor = (planet: string) => {
    const colors: { [key: string]: string } = {
      'Sun': 'bg-orange-500',
      'Moon': 'bg-blue-500',
      'Mars': 'bg-red-500',
      'Mercury': 'bg-green-500',
      'Jupiter': 'bg-yellow-500',
      'Venus': 'bg-pink-500',
      'Saturn': 'bg-purple-500',
      'Rahu': 'bg-gray-700',
      'Ketu': 'bg-gray-500'
    };
    return colors[planet] || 'bg-gray-400';
  };

  const filteredRemedies = getFilteredRemedies();
  const completionRate = (completedRemedies.length / filteredRemedies.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Remedial Measures
          </CardTitle>
          <CardDescription>
            Personalized astrological remedies to strengthen weak planets and improve life areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Lightbulb className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Recommended</div>
              <div className="text-lg font-bold">{filteredRemedies.length}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Completed</div>
              <div className="text-lg font-bold">{completedRemedies.length}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">In Progress</div>
              <div className="text-lg font-bold">
                {filteredRemedies.length - completedRemedies.length}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-sm font-medium">Completion</div>
              <div className="text-lg font-bold">{Math.round(completionRate)}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Types
              </Button>
              {['mantra', 'gemstone', 'charity', 'ritual', 'lifestyle'].map(type => (
                <Button
                  key={type}
                  variant={selectedCategory === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(type)}
                  className="capitalize"
                >
                  {getRemedyIcon(type)}
                  <span className="ml-1">{type}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remedy Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Remedies</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="priority" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="priority">By Priority</TabsTrigger>
              <TabsTrigger value="planet">By Planet</TabsTrigger>
              <TabsTrigger value="type">By Type</TabsTrigger>
              <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
            </TabsList>
            
            <TabsContent value="priority" className="space-y-4">
              <div className="space-y-4">
                {filteredRemedies
                  .sort((a, b) => b.effectiveness - a.effectiveness)
                  .map((remedy) => (
                    <div key={remedy.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={completedRemedies.includes(remedy.id)}
                            onCheckedChange={() => toggleRemedyCompletion(remedy.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getRemedyIcon(remedy.type)}
                              <h3 className="font-medium">{remedy.title}</h3>
                              <div className={`w-3 h-3 rounded-full ${getPlanetColor(remedy.planet)}`} />
                              <span className="text-sm text-muted-foreground">{remedy.planet}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{remedy.description}</p>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Instructions:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {remedy.instructions.map((instruction, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge className={getDifficultyColor(remedy.difficulty)}>
                            {remedy.difficulty}
                          </Badge>
                          <Badge className={getCostColor(remedy.cost)}>
                            {remedy.cost} cost
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs">{remedy.effectiveness}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Duration: {remedy.duration}</span>
                        </div>
                        {completedRemedies.includes(remedy.id) && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="planet" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map(planet => {
                  const planetRemedies = filteredRemedies.filter(r => r.planet === planet);
                  if (planetRemedies.length === 0) return null;
                  
                  return (
                    <div key={planet} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-4 h-4 rounded-full ${getPlanetColor(planet)}`} />
                        <h3 className="font-medium">{planet}</h3>
                        <Badge variant="secondary">{planetRemedies.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {planetRemedies.map(remedy => (
                          <div key={remedy.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={completedRemedies.includes(remedy.id)}
                              onCheckedChange={() => toggleRemedyCompletion(remedy.id)}
                            />
                            {getRemedyIcon(remedy.type)}
                            <span className="flex-1">{remedy.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="type" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['mantra', 'gemstone', 'charity', 'ritual', 'lifestyle'].map(type => {
                  const typeRemedies = filteredRemedies.filter(r => r.type === type);
                  if (typeRemedies.length === 0) return null;
                  
                  return (
                    <div key={type} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        {getRemedyIcon(type)}
                        <h3 className="font-medium capitalize">{type}</h3>
                        <Badge variant="secondary">{typeRemedies.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {typeRemedies.map(remedy => (
                          <div key={remedy.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={completedRemedies.includes(remedy.id)}
                              onCheckedChange={() => toggleRemedyCompletion(remedy.id)}
                            />
                            <div className={`w-2 h-2 rounded-full ${getPlanetColor(remedy.planet)}`} />
                            <span className="flex-1">{remedy.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="difficulty" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['easy', 'moderate', 'advanced'].map(difficulty => {
                  const difficultyRemedies = filteredRemedies.filter(r => r.difficulty === difficulty);
                  if (difficultyRemedies.length === 0) return null;
                  
                  return (
                    <div key={difficulty} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getDifficultyColor(difficulty)}>
                          {difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {difficultyRemedies.length} remedies
                        </span>
                      </div>
                      <div className="space-y-2">
                        {difficultyRemedies.map(remedy => (
                          <div key={remedy.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={completedRemedies.includes(remedy.id)}
                              onCheckedChange={() => toggleRemedyCompletion(remedy.id)}
                            />
                            <div className={`w-2 h-2 rounded-full ${getPlanetColor(remedy.planet)}`} />
                            <span className="flex-1">{remedy.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Important Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Before Starting Remedies</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Consult with a qualified astrologer for personalized guidance</li>
                <li>• Start remedies on auspicious days as mentioned</li>
                <li>• Maintain consistency and faith in the process</li>
                <li>• Combine multiple remedies for better results</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">General Tips</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Gemstones should be natural and properly energized</li>
                <li>• Mantras should be chanted with correct pronunciation</li>
                <li>• Charity should be done with pure intentions</li>
                <li>• Results may take time - patience is essential</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Expected Benefits</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Strengthening of weak planetary influences</li>
                <li>• Reduction in negative effects and obstacles</li>
                <li>• Enhanced positive qualities and opportunities</li>
                <li>• Overall improvement in life areas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemedialMeasures;