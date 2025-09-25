import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import VigyanBhairavTantraGuide from '@/components/VigyanBhairavTantraGuide';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Play, Pause, Square, History, PlusCircle, Edit, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { VBTTechnique } from '@/utils/vigyanBhairavTantra';

interface MeditationSession {
  id: string;
  practice_type: string;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

const MeditationPractice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [practiceType, setPracticeType] = useState('');
  const [duration, setDuration] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVBTTechnique, setSelectedVBTTechnique] = useState<VBTTechnique | null>(null);
  const [activeTab, setActiveTab] = useState('practice');

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'getMeditationHistory',
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
      toast({ 
        title: 'Sign in required', 
        description: 'Please sign in to start a practice.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Sign in required: Please sign in to start a practice.'
      });
      return;
    }
    
    let finalPracticeType = practiceType;
    
    // If VBT technique is selected, use it as practice type
    if (selectedVBTTechnique) {
      finalPracticeType = `VBT: ${selectedVBTTechnique.title}`;
      // Add technique details to notes
      setNotes(`Technique #${selectedVBTTechnique.id}: ${selectedVBTTechnique.description}\n\nInstructions: ${selectedVBTTechnique.instruction}\n\n`);
    }
    
    if (!finalPracticeType) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please select a practice type or VBT technique.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Missing Information: Please select a practice type or VBT technique.'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'startMeditationSession',
          data: {
            practice_type: finalPracticeType,
            duration_seconds: 0, // Will be updated on end
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setSessionId(data.session.id);
        setDuration(0);
        setTimerRunning(true);
        // Don't clear notes if VBT technique is selected (they contain instructions)
        if (!selectedVBTTechnique) {
          setNotes('');
        }
        toast({ title: 'Practice Started', description: `Started ${finalPracticeType} practice.` });
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
          command: 'endMeditationSession',
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
        showCopyButton: true,
        copyMessage: `Failed to end practice: ${error.message}`
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

  const handleVBTTechniqueSelect = (technique: VBTTechnique) => {
    setSelectedVBTTechnique(technique);
    setPracticeType(''); // Clear regular practice type when VBT is selected
    setActiveTab('practice'); // Switch to practice tab
    toast({
      title: 'VBT Technique Selected',
      description: `Selected: ${technique.title}`,
    });
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="practice" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="vbt" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                VBT Techniques
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="space-y-6">
              <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                    Meditation Practice
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Track your meditation sessions with traditional or VBT techniques.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedVBTTechnique ? (
                    <Card className="bg-purple-900/20 border-purple-500/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-purple-300">
                            Selected VBT Technique
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedVBTTechnique(null);
                              setNotes('');
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                        <CardDescription className="text-purple-200">
                          Technique #{selectedVBTTechnique.id}: {selectedVBTTechnique.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedVBTTechnique.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {selectedVBTTechnique.difficulty}
                          </Badge>
                          <span>{selectedVBTTechnique.duration}</span>
                          <span>{selectedVBTTechnique.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="practiceType">Traditional Practice Type</Label>
                      <Select value={practiceType} onValueChange={setPracticeType} disabled={timerRunning || loading}>
                        <SelectTrigger id="practiceType">
                          <SelectValue placeholder="Select a Meditation type or choose VBT technique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="Vipassana">Vipassana</SelectItem>
                          <SelectItem value="Transcendental">Transcendental</SelectItem>
                          <SelectItem value="Zazen">Zazen</SelectItem>
                          <SelectItem value="Loving-Kindness">Loving-Kindness</SelectItem>
                          <SelectItem value="Body Scan">Body Scan</SelectItem>
                          <SelectItem value="Walking Meditation">Walking Meditation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Or switch to the VBT Techniques tab to explore 112 sacred methods
                      </p>
                    </div>
                  )}

                  <div className="text-center text-6xl font-bold text-primary">
                    {formatTime(duration)}
                  </div>

                  <div className="flex gap-4 justify-center">
                    {!timerRunning ? (
                      <Button 
                        onClick={startPractice} 
                        disabled={loading || (!practiceType && !selectedVBTTechnique)} 
                        className="px-8 py-6 text-lg"
                      >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />} 
                        Start Practice
                      </Button>
                    ) : (
                      <Button onClick={endPractice} disabled={loading} className="px-8 py-6 text-lg bg-destructive hover:bg-destructive/90">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Square className="w-6 h-6" />} 
                        End Practice
                      </Button>
                    )}
                  </div>

                  {(timerRunning || selectedVBTTechnique) && (
                    <div className="space-y-2">
                      <Label htmlFor="notes">
                        {selectedVBTTechnique ? 'Instructions & Notes' : 'Notes (Optional)'}
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={selectedVBTTechnique ? 
                          "Technique instructions are pre-filled. Add your observations..." : 
                          "Add any observations or feelings about your practice..."
                        }
                        rows={selectedVBTTechnique ? 6 : 3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vbt" className="space-y-6">
              <VigyanBhairavTantraGuide 
                onSelectTechnique={handleVBTTechniqueSelect}
                selectedTechnique={selectedVBTTechnique}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                    Meditation History
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Review your past meditation sessions.
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
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default MeditationPractice;
