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
import { Loader2, Play, Pause, Square, History, PlusCircle, Edit, Trash2 } from 'lucide-react';

interface AsanaSession {
  id: string;
  practice_type: string;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

const AsanaPractice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [practiceType, setPracticeType] = useState('');
  const [duration, setDuration] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<AsanaSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'getAsanaHistory',
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
        showCopyButton: true,
        copyMessage: `Failed to fetch history: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (!practiceType) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please select a practice type.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Missing Information: Please select a practice type.'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'startAsanaSession',
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
        showCopyButton: true,
        copyMessage: `Failed to start practice: ${error.message}`
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
          command: 'endAsanaSession',
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

  const pauseResumePractice = () => {
    setTimerRunning(!timerRunning);
  };

  const asanaTypes = [
    'Hatha Yoga',
    'Vinyasa Flow',
    'Ashtanga',
    'Yin Yoga',
    'Restorative Yoga',
    'Power Yoga',
    'Kundalini Yoga',
    'Iyengar Yoga'
  ];

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Asana Practice
            </h1>
            <Link to="/spiritual-practices">
              <Button variant="outline">Back to Practices</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Practice Session */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Current Session
                </CardTitle>
                <CardDescription>
                  Start a new asana practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="practice-type">Practice Type</Label>
                  <Select value={practiceType} onValueChange={setPracticeType} disabled={timerRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asana type" />
                    </SelectTrigger>
                    <SelectContent>
                      {asanaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center py-6">
                  <div className="text-4xl font-mono font-bold text-primary mb-4">
                    {formatTime(duration)}
                  </div>
                  <div className="flex justify-center gap-2">
                    {!timerRunning && !sessionId && (
                      <Button onClick={startPractice} disabled={loading || !practiceType}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Start Practice
                      </Button>
                    )}
                    {timerRunning && (
                      <Button onClick={pauseResumePractice} variant="outline">
                        <Pause className="w-4 h-4" />
                        Pause
                      </Button>
                    )}
                    {!timerRunning && sessionId && (
                      <Button onClick={pauseResumePractice} variant="outline">
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    )}
                    {sessionId && (
                      <Button onClick={endPractice} disabled={loading} variant="destructive">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                        End Practice
                      </Button>
                    )}
                  </div>
                </div>

                {sessionId && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Session Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about your practice..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Practice History */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Practice History
                </CardTitle>
                <CardDescription>
                  Your recent asana sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No practice sessions yet. Start your first session!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((session) => (
                      <div key={session.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="secondary">{session.practice_type}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatTime(session.duration_seconds)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.start_time).toLocaleDateString()}
                          </p>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground">{session.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AsanaPractice;