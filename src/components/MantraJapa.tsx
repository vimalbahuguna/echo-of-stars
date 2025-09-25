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
import { Loader2, Play, Pause, Square, History, PlusCircle, Volume2, Clock } from 'lucide-react';

interface MantraSession {
  id: string;
  mantra_type: string;
  repetitions: number;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

const MantraJapa = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mantraType, setMantraType] = useState('');
  const [targetRepetitions, setTargetRepetitions] = useState(108);
  const [currentRepetitions, setCurrentRepetitions] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chantingRunning, setChantingRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<MantraSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'getMantraHistory',
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
    if (chantingRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [chantingRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startChanting = async () => {
    if (!user) {
      toast({ 
        title: 'Sign in required', 
        description: 'Please sign in to start a chanting session.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Sign in required: Please sign in to start a chanting session.'
      });
      return;
    }
    if (!mantraType) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please select a mantra type.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Missing Information: Please select a mantra type.'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'startMantraSession',
          data: {
            mantra_type: mantraType,
            target_repetitions: targetRepetitions,
            duration_seconds: 0, // Will be updated on end
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setSessionId(data.session.id);
        setCurrentRepetitions(0);
        setDuration(0);
        setChantingRunning(true);
        setNotes('');
        toast({ title: 'Chanting Started', description: `Started chanting ${mantraType}.` });
      }
    } catch (error: any) {
      console.error('Error starting chanting:', error);
      toast({
        title: 'Error',
        description: `Failed to start chanting session: ${error.message}`,
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: `Failed to start chanting session: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const endChanting = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'endMantraSession',
          data: {
            sessionId: sessionId,
            repetitions: currentRepetitions,
            duration_seconds: duration,
            notes: notes,
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setChantingRunning(false);
        setSessionId(null);
        toast({ title: 'Chanting Ended', description: `Completed ${currentRepetitions} repetitions of ${mantraType}.` });
        fetchHistory(); // Refresh history
      }
    } catch (error: any) {
      console.error('Error ending chanting:', error);
      toast({
        title: 'Error',
        description: `Failed to end chanting session: ${error.message}`,
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: `Failed to end chanting session: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const pauseResumeChanting = () => {
    setChantingRunning(!chantingRunning);
  };

  const incrementRepetition = () => {
    if (sessionId && currentRepetitions < targetRepetitions) {
      setCurrentRepetitions(prev => prev + 1);
    }
  };

  const mantraTypes = [
    'Om Namah Shivaya',
    'Om Gam Ganapataye Namaha',
    'Om Mani Padme Hum',
    'Hare Krishna Maha Mantra',
    'Gayatri Mantra',
    'Mahamrityunjaya Mantra',
    'Om Namo Narayanaya',
    'Om Aim Saraswatyai Namaha',
    'Om Shri Durgayai Namaha',
    'Om Namo Bhagavate Vasudevaya',
    'So Hum',
    'Om Shanti Shanti Shanti'
  ];

  const repetitionCounts = [108, 216, 324, 432, 540, 648, 756, 864, 972, 1080];

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Mantra Japa
            </h1>
            <Link to="/spiritual-practices">
              <Button variant="outline">Back to Practices</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chanting Session */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Current Chanting Session
                </CardTitle>
                <CardDescription>
                  Begin your sacred mantra practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mantra-type">Mantra</Label>
                    <Select value={mantraType} onValueChange={setMantraType} disabled={chantingRunning}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mantra" />
                      </SelectTrigger>
                      <SelectContent>
                        {mantraTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repetitions">Target Repetitions</Label>
                    <Select 
                      value={targetRepetitions.toString()} 
                      onValueChange={(value) => setTargetRepetitions(parseInt(value))}
                      disabled={chantingRunning}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {repetitionCounts.map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center py-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-mono font-bold text-primary">
                        {currentRepetitions}
                      </div>
                      <div className="text-sm text-muted-foreground">Repetitions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-mono font-bold text-primary">
                        {formatTime(duration)}
                      </div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {!chantingRunning && !sessionId && (
                      <Button onClick={startChanting} disabled={loading || !mantraType}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Start Chanting
                      </Button>
                    )}
                    {chantingRunning && (
                      <Button onClick={pauseResumeChanting} variant="outline">
                        <Pause className="w-4 h-4" />
                        Pause
                      </Button>
                    )}
                    {!chantingRunning && sessionId && (
                      <Button onClick={pauseResumeChanting} variant="outline">
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    )}
                    {sessionId && (
                      <Button onClick={endChanting} disabled={loading} variant="destructive">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                        End Session
                      </Button>
                    )}
                  </div>

                  {sessionId && (
                    <Button 
                      onClick={incrementRepetition} 
                      disabled={currentRepetitions >= targetRepetitions}
                      className="w-full"
                      variant="secondary"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Count Repetition ({currentRepetitions}/{targetRepetitions})
                    </Button>
                  )}
                </div>

                {sessionId && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Session Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Record your experience, insights, or observations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chanting History */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Chanting History
                </CardTitle>
                <CardDescription>
                  Your sacred practice journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No chanting sessions yet. Begin your sacred practice!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((session) => (
                      <div key={session.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="secondary">{session.mantra_type}</Badge>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <PlusCircle className="w-3 h-3" />
                                {session.repetitions} reps
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(session.duration_seconds)}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.start_time).toLocaleDateString()}
                          </p>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground italic">{session.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sacred Quote */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <blockquote className="text-lg italic text-muted-foreground mb-2">
                "मन्त्रो वै यज्ञः" - "Mantra is indeed the sacrifice"
              </blockquote>
              <p className="text-sm text-muted-foreground">- Vedic Wisdom</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default MantraJapa;