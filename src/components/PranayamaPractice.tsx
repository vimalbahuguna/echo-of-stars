import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Play, Pause, Square, History, PlusCircle, Edit, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PranayamaSession {
  id: string;
  practice_type: string;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

const PranayamaPractice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [practiceType, setPracticeType] = useState('');
  const [duration, setDuration] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<PranayamaSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExercises, setShowExercises] = useState(false);

  const pranayamaExercises = {
    "Anulom Vilom": {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      steps: [
        "Sit comfortably with spine straight and shoulders relaxed",
        "Use right thumb to close right nostril, inhale through left nostril for 4 counts",
        "Close left nostril with ring finger, release thumb and exhale through right nostril for 4 counts",
        "Inhale through right nostril for 4 counts",
        "Close right nostril, release ring finger and exhale through left nostril for 4 counts",
        "This completes one round. Practice 5-10 rounds initially"
      ],
      benefits: "Balances nervous system, improves concentration, reduces stress and anxiety",
      duration: "5-15 minutes daily"
    },
    "Kapalbhati": {
      name: "Kapalbhati (Skull Shining Breath)",
      steps: [
        "Sit in comfortable cross-legged position with spine erect",
        "Place hands on knees in chin mudra",
        "Take a deep breath in naturally",
        "Exhale forcefully through nose by contracting abdominal muscles",
        "Allow natural inhalation to follow",
        "Start with 30 rapid exhalations, gradually increase to 100"
      ],
      benefits: "Cleanses respiratory system, strengthens core muscles, energizes body and mind",
      duration: "3-5 minutes daily"
    },
    "Bhastrika": {
      name: "Bhastrika (Bellows Breath)",
      steps: [
        "Sit comfortably with spine straight",
        "Take 10 deep breaths, inhaling and exhaling completely",
        "On 11th breath, inhale deeply and hold (Antara Kumbhaka)",
        "Hold breath as long as comfortable without strain",
        "Exhale slowly and completely",
        "Take normal breaths to recover, then repeat cycle"
      ],
      benefits: "Increases lung capacity, generates heat, boosts metabolism and immunity",
      duration: "3-5 cycles, build gradually"
    },
    "Nadi Shodhana": {
      name: "Nadi Shodhana (Channel Purification)",
      steps: [
        "Sit with spine erect, use Vishnu mudra (fold index and middle fingers)",
        "Close right nostril with thumb, inhale left nostril for 4 counts",
        "Close both nostrils, hold breath for 2 counts",
        "Release thumb, exhale right nostril for 4 counts",
        "Inhale right nostril for 4 counts",
        "Close both nostrils, hold for 2 counts",
        "Release ring finger, exhale left nostril for 4 counts"
      ],
      benefits: "Purifies energy channels, balances left and right brain hemispheres",
      duration: "10-20 minutes daily"
    },
    "Bhramari": {
      name: "Bhramari (Humming Bee Breath)",
      steps: [
        "Sit comfortably with eyes closed",
        "Place thumbs in ears, index fingers above eyebrows",
        "Place middle fingers on closed eyelids gently",
        "Ring and little fingers on sides of nose",
        "Inhale normally through nose",
        "Exhale making a humming sound like a bee",
        "Focus on the vibration and sound"
      ],
      benefits: "Calms mind, reduces stress, improves concentration and memory",
      duration: "5-10 minutes daily"
    },
    "Ujjayi": {
      name: "Ujjayi (Victorious Breath)",
      steps: [
        "Sit or lie down comfortably",
        "Breathe through nose only",
        "Slightly constrict throat to create soft sound",
        "Inhale slowly and deeply, creating ocean-like sound",
        "Exhale slowly with same constricted throat",
        "Maintain steady rhythm throughout practice",
        "Focus on the sound and breath"
      ],
      benefits: "Builds internal heat, calms nervous system, improves focus",
      duration: "5-20 minutes daily"
    },
    "Sitali": {
      name: "Sitali (Cooling Breath)",
      steps: [
        "Sit comfortably with spine straight",
        "Curl tongue into tube shape (if unable, purse lips)",
        "Inhale slowly through curled tongue",
        "Close mouth and hold breath briefly",
        "Exhale slowly through nose",
        "Feel cooling sensation throughout body",
        "Continue for several rounds"
      ],
      benefits: "Cools body temperature, reduces heat and inflammation, calms mind",
      duration: "5-10 minutes, especially in hot weather"
    },
    "Sitkari": {
      name: "Sitkari (Hissing Breath)",
      steps: [
        "Sit with spine erect and shoulders relaxed",
        "Open mouth slightly, place tongue against teeth",
        "Inhale through mouth making hissing sound",
        "Close mouth and hold breath briefly",
        "Exhale slowly through nose",
        "Feel cooling effect on tongue and mouth",
        "Repeat for desired duration"
      ],
      benefits: "Cools body, purifies blood, controls hunger and thirst",
      duration: "5-10 minutes daily"
    },
    "Surya Bhedana": {
      name: "Surya Bhedana (Right Nostril Breathing)",
      steps: [
        "Sit comfortably with spine straight",
        "Use right hand in Vishnu mudra",
        "Close left nostril with ring finger",
        "Inhale slowly through right nostril only",
        "Close both nostrils, hold breath comfortably",
        "Release ring finger, exhale through left nostril",
        "Keep right nostril closed throughout exhalation"
      ],
      benefits: "Increases body heat, activates sympathetic nervous system, energizes",
      duration: "5-10 minutes, best in morning"
    },
    "Chandra Bhedana": {
      name: "Chandra Bhedana (Left Nostril Breathing)",
      steps: [
        "Sit with spine erect and relaxed",
        "Use right hand in Vishnu mudra",
        "Close right nostril with thumb",
        "Inhale slowly through left nostril only",
        "Close both nostrils, hold breath gently",
        "Release thumb, exhale through right nostril",
        "Keep left nostril closed throughout exhalation"
      ],
      benefits: "Cools body, activates parasympathetic nervous system, promotes relaxation",
      duration: "5-10 minutes, best in evening"
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'getPranayamaHistory',
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setHistory(data.sessions);
      }
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch history: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else if (!timerRunning && duration !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, duration]);

  const startPractice = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to start a practice.', variant: 'destructive' });
      return;
    }
    if (!practiceType) {
      toast({ title: 'Missing Information', description: 'Please select a practice type.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'startPranayamaSession',
          data: {
            practice_type: practiceType,
            duration_seconds: 0, // Will be updated on end
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setSessionId(data.session.id);
        setDuration(0);
        setTimerRunning(true);
        setNotes('');
        toast({ title: 'Practice Started', description: `Started ${practiceType} practice.` });
      }
    } catch (error: any) {
      console.error('Error starting practice:', error);
      toast({
        title: 'Error',
        description: `Failed to start practice: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const endPractice = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'endPranayamaSession',
          data: {
            sessionId: sessionId,
            duration_seconds: duration,
            notes: notes,
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setTimerRunning(false);
        setSessionId(null);
        toast({ title: 'Practice Ended', description: `Ended ${practiceType} practice. Duration: ${duration} seconds.` });
        fetchHistory(); // Refresh history
      }
    } catch (error: any) {
      console.error('Error ending practice:', error);
      toast({
        title: 'Error',
        description: `Failed to end practice: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <Link to="/spiritual-practices">
              <Button variant="outline">
                Back to Spiritual Practices
              </Button>
            </Link>
          </div>

          <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                Pranayama Practice
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your breathwork sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="practiceType">Practice Type</Label>
                <Select value={practiceType} onValueChange={setPracticeType} disabled={timerRunning || loading}>
                  <SelectTrigger id="practiceType">
                    <SelectValue placeholder="Select a Pranayama type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anulom Vilom">Anulom Vilom</SelectItem>
                    <SelectItem value="Kapalbhati">Kapalbhati</SelectItem>
                    <SelectItem value="Bhastrika">Bhastrika</SelectItem>
                    <SelectItem value="Nadi Shodhana">Nadi Shodhana</SelectItem>
                    <SelectItem value="Bhramari">Bhramari</SelectItem>
                    <SelectItem value="Ujjayi">Ujjayi</SelectItem>
                    <SelectItem value="Sitali">Sitali</SelectItem>
                    <SelectItem value="Sitkari">Sitkari</SelectItem>
                    <SelectItem value="Surya Bhedana">Surya Bhedana</SelectItem>
                    <SelectItem value="Chandra Bhedana">Chandra Bhedana</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {practiceType && pranayamaExercises[practiceType as keyof typeof pranayamaExercises] && (
                <Card className="bg-secondary/20 border-secondary/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-primary">
                        <BookOpen className="w-5 h-5 inline mr-2" />
                        Practice Guide: {practiceType}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowExercises(!showExercises)}
                      >
                        {showExercises ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  {showExercises && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Steps:</h4>
                          <ol className="space-y-2">
                            {pranayamaExercises[practiceType as keyof typeof pranayamaExercises].steps.map((step, index) => (
                              <li key={index} className="flex gap-3 text-sm">
                                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Benefits:</h4>
                            <p className="text-sm">{pranayamaExercises[practiceType as keyof typeof pranayamaExercises].benefits}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Recommended Duration:</h4>
                            <p className="text-sm">{pranayamaExercises[practiceType as keyof typeof pranayamaExercises].duration}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              <div className="text-center text-6xl font-bold text-primary">
                {formatTime(duration)}
              </div>

              <div className="flex gap-4 justify-center">
                {!timerRunning ? (
                  <Button onClick={startPractice} disabled={loading || !practiceType} className="px-8 py-6 text-lg">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />} Start
                  </Button>
                ) : (
                  <Button onClick={endPractice} disabled={loading} className="px-8 py-6 text-lg bg-destructive hover:bg-destructive/90">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Square className="w-6 h-6" />} End
                  </Button>
                )}
              </div>

              {timerRunning && (
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any observations or feelings about your practice..."
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                Pranayama History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Review your past breathwork sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-center text-muted-foreground">No sessions recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((session) => (
                    <Card key={session.id} className="bg-background/60 border-border/30 p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{session.practice_type}</h3>
                        <Badge variant="secondary">{formatTime(session.duration_seconds)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.start_time).toLocaleString()}
                        {session.end_time && ` - ${new Date(session.end_time).toLocaleTimeString()}`}
                      </p>
                      {session.notes && (
                        <p className="text-sm mt-2 italic">"{session.notes}"</p>
                      )}
                      {/* Add edit/delete functionality later if needed */}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default PranayamaPractice;
