import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Video, FileText, CheckCircle, Clock,
  Play, Download, MessageSquare, ChevronRight, Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const VedicWeekViewer: React.FC = () => {
  const { t } = useTranslation();
  const { weekId } = useParams<{ weekId: string }>();
  const { user } = useAuth();
  const [week, setWeek] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeekData = async () => {
      if (!weekId) return;
      setLoading(true);

      try {
        // Load week details
        const { data: weekData, error: weekErr } = await (supabase as any)
          .from('cur_weeks')
          .select('*')
          .eq('week_id', weekId)
          .single();
        if (weekErr) throw weekErr;
        setWeek(weekData);

        // Load topics
        const { data: topicsData, error: topicsErr } = await (supabase as any)
          .from('cur_topics')
          .select('*')
          .eq('week_id', weekId)
          .order('topic_order');
        if (!topicsErr) setTopics(topicsData || []);

        // Load exercises
        const { data: exercisesData, error: exercisesErr } = await (supabase as any)
          .from('cur_practical_exercises')
          .select('*')
          .eq('week_id', weekId)
          .order('exercise_order');
        if (!exercisesErr) setExercises(exercisesData || []);

        // Load reading materials
        const { data: materialsData, error: materialsErr } = await (supabase as any)
          .from('cur_reading_materials')
          .select('*')
          .eq('week_id', weekId);
        if (!materialsErr) setMaterials(materialsData || []);

        // Load student progress if authenticated
        if (user) {
          const { data: progressData, error: progressErr } = await (supabase as any)
            .from('stu_week_progress')
            .select('*')
            .eq('week_id', weekId)
            .single();
          if (!progressErr && progressData) setProgress(progressData);
        }
      } catch (err) {
        console.error('Error loading week data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeekData();
  }, [weekId, user]);

  const handleMarkComplete = async () => {
    if (!weekId || !user) return;
    
    try {
      const { error } = await (supabase as any)
        .rpc('progress_update_week', {
          p_week_id: parseInt(weekId),
          p_completion: 100,
          p_status: 'completed',
          p_completed_date: new Date().toISOString().slice(0, 10)
        });
      
      if (error) throw error;
      
      // Reload progress
      const { data: progressData } = await (supabase as any)
        .from('stu_week_progress')
        .select('*')
        .eq('week_id', weekId)
        .single();
      setProgress(progressData);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading week content...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!week) {
    return (
      <DashboardLayout role="student">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Week not found</p>
          <Button asChild variant="outline">
            <Link to="/academy/vedic/student">Back to Dashboard</Link>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const completionPercent = progress?.completion_percentage || 0;

  return (
    <DashboardLayout role="student">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/academy/vedic/student" className="hover:text-primary">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Week {week.week_start}-{week.week_end}</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent mb-3">
            {week.week_title}
          </h1>
          {week.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">{week.description}</p>
          )}
        </div>

        {/* Progress Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-border/50 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold mb-1">Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Status: <Badge variant={progress?.status === 'completed' ? 'default' : 'secondary'}>
                  {progress?.status || 'Not Started'}
                </Badge>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{Math.round(completionPercent)}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercent} className="h-3 mb-4" />
          <div className="flex gap-3">
            {completionPercent >= 100 ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            ) : (
              <Button size="sm" onClick={handleMarkComplete}>
                Mark as Complete
              </Button>
            )}
          </div>
        </Card>

        {/* Study Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Theory Hours', value: week.theory_hours || 0, icon: BookOpen, color: 'text-blue-500' },
            { label: 'Practical Hours', value: week.practical_hours || 0, icon: Target, color: 'text-purple-500' },
            { label: 'Self Study Hours', value: week.self_study_hours || 0, icon: Clock, color: 'text-orange-500' }
          ].map((item, i) => (
            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3">
                <item.icon className={`w-8 h-8 ${item.color}`} />
                <div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-2xl font-bold">{item.value}h</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="topics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Week Topics</CardTitle>
                <CardDescription>Core concepts covered this week</CardDescription>
              </CardHeader>
              <CardContent>
                {topics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No topics available yet</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {topics.map((topic, i) => (
                      <AccordionItem key={topic.topic_id} value={`topic-${i}`}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{topic.topic_order}</Badge>
                            <span className="font-semibold">{topic.topic_title}</span>
                            {topic.is_core_topic && (
                              <Badge variant="secondary" className="text-xs">Core</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 pl-12">
                            <p className="text-muted-foreground leading-relaxed">
                              {topic.topic_description || 'Topic description coming soon'}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Lectures</CardTitle>
                <CardDescription>Watch recorded sessions and tutorials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3].map((video) => (
                    <Card key={video} className="overflow-hidden hover:border-primary/50 transition-all group">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                        <Play className="w-16 h-16 text-primary group-hover:scale-110 transition-transform cursor-pointer" />
                        <Badge className="absolute top-2 right-2">15:30</Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2">Lecture {video}: {topics[video - 1]?.topic_title || 'Introduction'}</h4>
                        <p className="text-sm text-muted-foreground mb-3">Duration: 15 minutes</p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Play className="w-3 h-3 mr-2" />
                          Watch Now
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Reading Materials</CardTitle>
                <CardDescription>Supplementary texts and resources</CardDescription>
              </CardHeader>
              <CardContent>
                {materials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No materials available yet</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <Card key={material.material_id} className="p-4 hover:border-primary/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div>
                              <div className="font-semibold">{material.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {material.kind || 'Document'}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-2" />
                            Download
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>Practical Exercises</CardTitle>
                <CardDescription>Apply your knowledge with hands-on practice</CardDescription>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No exercises available yet</p>
                ) : (
                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <Card key={exercise.exercise_id} className="p-6 hover:border-primary/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{exercise.exercise_title}</h4>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline">{exercise.difficulty_level}</Badge>
                              {exercise.estimated_duration_hours && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {exercise.estimated_duration_hours}h
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge>#{exercise.exercise_order}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {exercise.exercise_description || 'Exercise description coming soon'}
                        </p>
                        <div className="flex gap-3">
                          <Button size="sm">
                            Start Exercise
                            <ChevronRight className="w-3 h-3 ml-2" />
                          </Button>
                          <Button size="sm" variant="outline">
                            View Instructions
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Discussion */}
        <Card className="p-8 mt-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-bold">Week Discussion</h3>
              <p className="text-sm text-muted-foreground">Ask questions and engage with peers</p>
            </div>
          </div>
          <Button variant="outline">
            Join Discussion Forum
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VedicWeekViewer;