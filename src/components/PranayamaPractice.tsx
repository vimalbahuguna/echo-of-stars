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
