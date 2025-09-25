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
import { Loader2, Play, Pause, Square, History, PlusCircle, BookOpen, Clock } from 'lucide-react';

interface UpanishadSession {
  id: string;
  teaching_type: string;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

const UpanishadTeachings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teachingType, setTeachingType] = useState('');
  const [duration, setDuration] = useState(0);
  const [studyRunning, setStudyRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<UpanishadSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'getUpanishadHistory',
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
    if (studyRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [studyRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startStudy = async () => {
    if (!user) {
      toast({ 
        title: 'Sign in required', 
        description: 'Please sign in to start a study session.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Sign in required: Please sign in to start a study session.'
      });
      return;
    }
    if (!teachingType) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please select a teaching type.', 
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: 'Missing Information: Please select a teaching type.'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'startUpanishadSession',
          data: {
            teaching_type: teachingType,
            duration_seconds: 0, // Will be updated on end
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setSessionId(data.session.id);
        setDuration(0);
        setStudyRunning(true);
        setNotes('');
        toast({ title: 'Study Started', description: `Started studying ${teachingType}.` });
      }
    } catch (error: any) {
      console.error('Error starting study:', error);
      toast({
        title: 'Error',
        description: `Failed to start study session: ${error.message}`,
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: `Failed to start study session: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const endStudy = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('spiritual-practice-service', {
        body: {
          command: 'endUpanishadSession',
          data: {
            sessionId: sessionId,
            duration_seconds: duration,
            notes: notes,
          },
        },
      });

      if (error) throw error;
      if (data && data.success) {
        setStudyRunning(false);
        setSessionId(null);
        toast({ title: 'Study Ended', description: `Completed ${teachingType} study. Duration: ${duration} seconds.` });
        fetchHistory(); // Refresh history
      }
    } catch (error: any) {
      console.error('Error ending study:', error);
      toast({
        title: 'Error',
        description: `Failed to end study session: ${error.message}`,
        variant: 'destructive',
        showCopyButton: true,
        copyMessage: `Failed to end study session: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const pauseResumeStudy = () => {
    setStudyRunning(!studyRunning);
  };

  const upanishadTypes = [
    'Isha Upanishad',
    'Kena Upanishad',
    'Katha Upanishad',
    'Prashna Upanishad',
    'Mundaka Upanishad',
    'Mandukya Upanishad',
    'Taittiriya Upanishad',
    'Aitareya Upanishad',
    'Chandogya Upanishad',
    'Brihadaranyaka Upanishad',
    'Svetasvatara Upanishad',
    'Kaushitaki Upanishad'
  ];

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Upanishad Teachings
            </h1>
            <Link to="/spiritual-practices">
              <Button variant="outline">Back to Practices</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Session */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Current Study Session
                </CardTitle>
                <CardDescription>
                  Begin studying ancient wisdom from the Upanishads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teaching-type">Upanishad Text</Label>
                  <Select value={teachingType} onValueChange={setTeachingType} disabled={studyRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Upanishad to study" />
                    </SelectTrigger>
                    <SelectContent>
                      {upanishadTypes.map((type) => (
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
                    {!studyRunning && !sessionId && (
                      <Button onClick={startStudy} disabled={loading || !teachingType}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Start Study
                      </Button>
                    )}
                    {studyRunning && (
                      <Button onClick={pauseResumeStudy} variant="outline">
                        <Pause className="w-4 h-4" />
                        Pause
                      </Button>
                    )}
                    {!studyRunning && sessionId && (
                      <Button onClick={pauseResumeStudy} variant="outline">
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    )}
                    {sessionId && (
                      <Button onClick={endStudy} disabled={loading} variant="destructive">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                        End Study
                      </Button>
                    )}
                  </div>
                </div>

                {sessionId && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Study Notes & Insights</Label>
                    <Textarea
                      id="notes"
                      placeholder="Record your insights, questions, and reflections..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Study History */}
            <Card className="bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Study History
                </CardTitle>
                <CardDescription>
                  Your journey through the ancient wisdom
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No study sessions yet. Begin your journey into ancient wisdom!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((session) => (
                      <div key={session.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="secondary">{session.teaching_type}</Badge>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(session.duration_seconds)}
                            </p>
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

          {/* Wisdom Quote */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <blockquote className="text-lg italic text-muted-foreground mb-2">
                "सर्वं खल्विदं ब्रह्म" - "All this is indeed Brahman"
              </blockquote>
              <p className="text-sm text-muted-foreground">- Chandogya Upanishad</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default UpanishadTeachings;