import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Clock, Award, CheckCircle, AlertCircle,
  Upload, Download, ChevronRight, Calendar, Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const VedicAssessments: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true);
      try {
        // Load assessments
        const { data: assessData, error: assessErr } = await (supabase as any)
          .from('asm_assessments')
          .select('*, type:asm_types(*), level:cur_certification_levels(*)')
          .order('assessment_id', { ascending: false });
        
        if (!assessErr) setAssessments(assessData || []);

        // Load results
        const { data: resultsData, error: resultsErr } = await (supabase as any)
          .from('asm_assessment_results')
          .select('*, assessment:asm_assessments(*)')
          .order('created_at', { ascending: false });
        
        if (!resultsErr) setResults(resultsData || []);
      } catch (err) {
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [user]);

  const upcomingAssessments = assessments.filter(a => {
    const hasResult = results.some(r => r.assessment_id === a.assessment_id);
    return !hasResult;
  });

  const completedAssessments = results.filter(r => r.graded_at);
  const pendingResults = results.filter(r => !r.graded_at);

  const averageScore = completedAssessments.length > 0
    ? completedAssessments.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0) / completedAssessments.length
    : 0;

  return (
    <DashboardLayout role="student">
      <div>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Assessments
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Complete assessments, track your performance, and receive feedback
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { 
              icon: Target, 
              label: 'Upcoming', 
              value: upcomingAssessments.length, 
              color: 'text-blue-500' 
            },
            { 
              icon: Clock, 
              label: 'Pending Review', 
              value: pendingResults.length, 
              color: 'text-orange-500' 
            },
            { 
              icon: CheckCircle, 
              label: 'Completed', 
              value: completedAssessments.length, 
              color: 'text-green-500' 
            },
            { 
              icon: Award, 
              label: 'Average Score', 
              value: `${Math.round(averageScore)}%`, 
              color: 'text-purple-500' 
            }
          ].map((stat, i) => (
            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Upcoming Assessments */}
          <TabsContent value="upcoming">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading assessments...</div>
            ) : upcomingAssessments.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming assessments</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingAssessments.map((assessment) => (
                  <Card key={assessment.assessment_id} className="p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{assessment.assessment_name}</h3>
                        {assessment.description && (
                          <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                        )}
                      </div>
                      <Badge variant="outline">{assessment.type?.type_name || 'Assessment'}</Badge>
                    </div>

                    <div className="space-y-2 text-sm mb-6">
                      {assessment.level && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span>Level: {assessment.level.level_name}</span>
                        </div>
                      )}
                      {assessment.duration_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>Duration: {assessment.duration_hours} hours</span>
                        </div>
                      )}
                      {assessment.max_marks && (
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span>Max Marks: {assessment.max_marks}</span>
                        </div>
                      )}
                      {assessment.quantity > 1 && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{assessment.quantity} assessments</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        Start Assessment
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pending Review Section */}
            {pendingResults.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Pending Review</h3>
                <div className="space-y-4">
                  {pendingResults.map((result) => (
                    <Card key={result.result_id} className="p-4 bg-orange-500/5 border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-6 h-6 text-orange-500" />
                          <div>
                            <div className="font-semibold">
                              {result.assessment?.assessment_name || 'Assessment'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Submitted on {new Date(result.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">Under Review</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Completed Assessments */}
          <TabsContent value="completed">
            {completedAssessments.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed assessments yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedAssessments.map((result) => {
                  const score = parseFloat(result.score) || 0;
                  const maxMarks = result.assessment?.max_marks || 100;
                  const percentage = (score / maxMarks) * 100;
                  const passed = result.passed;

                  return (
                    <Card key={result.result_id} className={`p-6 ${passed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">
                              {result.assessment?.assessment_name || 'Assessment'}
                            </h3>
                            <Badge variant={passed ? 'default' : 'destructive'}>
                              {passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Graded on {new Date(result.graded_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">{Math.round(percentage)}%</div>
                          <div className="text-sm text-muted-foreground">{score}/{maxMarks}</div>
                        </div>
                      </div>

                      <Progress value={percentage} className="h-3 mb-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-background/50">
                          <div className="text-xs text-muted-foreground mb-1">Submitted</div>
                          <div className="text-sm font-medium">
                            {new Date(result.created_at).toLocaleDateString()}
                          </div>
                        </Card>
                        <Card className="p-4 bg-background/50">
                          <div className="text-xs text-muted-foreground mb-1">Graded By</div>
                          <div className="text-sm font-medium">
                            Faculty Member #{result.grader_faculty_id || 'N/A'}
                          </div>
                        </Card>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-2" />
                          Download Certificate
                        </Button>
                        <Button variant="outline" size="sm">
                          View Feedback
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Overall Performance</CardTitle>
                  <CardDescription>Your assessment statistics</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Score</span>
                      <span className="text-2xl font-bold text-primary">{Math.round(averageScore)}%</span>
                    </div>
                    <Progress value={averageScore} className="h-3" />
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Assessments</span>
                      <span className="font-semibold">{completedAssessments.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Passed</span>
                      <span className="font-semibold text-green-500">
                        {completedAssessments.filter(r => r.passed).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Failed</span>
                      <span className="font-semibold text-red-500">
                        {completedAssessments.filter(r => !r.passed).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate</span>
                      <span className="font-semibold">
                        {completedAssessments.length > 0 
                          ? Math.round((completedAssessments.filter(r => r.passed).length / completedAssessments.length) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest assessment submissions</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    {results.slice(0, 5).map((result) => (
                      <div key={result.result_id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                        {result.graded_at ? (
                          result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {result.assessment?.assessment_name || 'Assessment'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(result.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {result.graded_at && (
                          <div className="text-sm font-bold">
                            {Math.round((parseFloat(result.score) / (result.assessment?.max_marks || 100)) * 100)}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VedicAssessments;