import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Video, Calendar as CalendarIcon, Clock, Users, 
  Play, Download, Search, Filter, ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const VedicLiveSessions: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        // Load upcoming sessions
        const { data: sessionsData, error: sessionsErr } = await (supabase as any)
          .from('cur_sessions')
          .select('*')
          .gte('start_at', new Date().toISOString())
          .order('start_at', { ascending: true })
          .limit(10);
        
        if (!sessionsErr) setSessions(sessionsData || []);

        // Load recordings
        const { data: recordingsData, error: recordingsErr } = await (supabase as any)
          .from('cur_session_recordings')
          .select('*, session:cur_sessions(*)')
          .order('uploaded_at', { ascending: false })
          .limit(20);
        
        if (!recordingsErr) setRecordings(recordingsData || []);
      } catch (err) {
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  const filteredRecordings = recordings.filter(rec =>
    searchQuery === '' || 
    rec.session?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.session?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="student">
      <div>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Video className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Live Sessions
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Join live classes, workshops, and Q&A sessions with expert faculty
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="recordings">Past Recordings</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                </div>
              ) : (
                sessions.map((session) => {
                  const startDate = new Date(session.start_at);
                  const isLive = startDate <= new Date() && (!session.end_at || new Date(session.end_at) >= new Date());
                  const isSoon = startDate <= new Date(Date.now() + 30 * 60 * 1000); // Within 30 mins

                  return (
                    <Card key={session.id} className={`p-6 hover:border-primary/50 transition-all ${isLive ? 'border-green-500 border-2' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isLive && (
                              <Badge className="bg-green-500 animate-pulse">
                                🔴 LIVE NOW
                              </Badge>
                            )}
                            {isSoon && !isLive && (
                              <Badge variant="secondary">Starting Soon</Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {session.title || 'Live Session'}
                          </h3>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {session.description}
                            </p>
                          )}
                        </div>
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="space-y-2 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span>{startDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{startDate.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>Instructor: Faculty Member</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {isLive ? (
                          <Button className="flex-1 bg-green-500 hover:bg-green-600">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join Now
                          </Button>
                        ) : (
                          <Button variant="outline" className="flex-1" disabled={!isSoon}>
                            {isSoon ? 'Join Soon' : 'Register'}
                          </Button>
                        )}
                        <Button variant="outline" size="icon">
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Session Calendar</CardTitle>
                  <CardDescription>View all scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Sessions on {selectedDate?.toLocaleDateString()}</h3>
                  <div className="space-y-3">
                    {sessions.filter(s => {
                      const sessionDate = new Date(s.start_at);
                      return selectedDate && 
                        sessionDate.toDateString() === selectedDate.toDateString();
                    }).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sessions scheduled</p>
                    ) : (
                      sessions
                        .filter(s => {
                          const sessionDate = new Date(s.start_at);
                          return selectedDate && 
                            sessionDate.toDateString() === selectedDate.toDateString();
                        })
                        .map((session) => (
                          <Card key={session.id} className="p-3 bg-primary/5 border-primary/30">
                            <div className="font-medium text-sm mb-1">
                              {new Date(session.start_at).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.title || 'Live Session'}
                            </div>
                          </Card>
                        ))
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">This Week:</span>
                      <span className="font-medium">5 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attended:</span>
                      <span className="font-medium">12 total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attendance Rate:</span>
                      <span className="font-medium text-green-500">85%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Past Recordings */}
          <TabsContent value="recordings">
            <Card className="p-6 mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recordings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  Loading recordings...
                </div>
              ) : filteredRecordings.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recordings found</p>
                </div>
              ) : (
                filteredRecordings.map((recording) => (
                  <Card key={recording.recording_id} className="overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                      <Play className="w-16 h-16 text-primary group-hover:scale-110 transition-transform cursor-pointer" />
                      {recording.duration_minutes && (
                        <Badge className="absolute top-2 right-2">
                          {recording.duration_minutes} min
                        </Badge>
                      )}
                      <Badge className="absolute bottom-2 left-2" variant="secondary">
                        Recording
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">
                        {recording.session?.title || 'Recorded Session'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(recording.uploaded_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Play className="w-3 h-3 mr-2" />
                          Watch
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VedicLiveSessions;