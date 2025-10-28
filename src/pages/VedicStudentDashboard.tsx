import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Award, BookOpen, CalendarDays,
  TrendingUp, Clock, Target, CheckCircle,
  Video, MessageSquare, FileText, BarChart3,
  ChevronRight, Play
} from 'lucide-react';
import StudentAcademyPanels from "@/components/academy/StudentAcademyPanels";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type ActiveStudentProgress = {
  student_id: number;
  student_name: string | null;
  enrollment_id: number | null;
  level_id: number | null;
  level_name: string | null;
  weeks_total: number | null;
  weeks_completed: number | null;
  weeks_in_progress: number | null;
  avg_completion_percentage: number | null;
  last_activity_at: string | null;
};

const VedicStudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [kpi, setKpi] = useState<ActiveStudentProgress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from('vw_active_students_progress' as any)
          .select('*')
          .order('last_activity_at', { ascending: false })
          .limit(1);
        if (error) throw error;
        const rows = (Array.isArray(data) ? data : [data]).filter(Boolean) as unknown as ActiveStudentProgress[];
        setKpi(rows[0] ?? null);
      } catch (e) {
        console.error('Progress load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const completionPercent = kpi?.avg_completion_percentage ?? 0;
  const weeksCompleted = kpi?.weeks_completed ?? 0;
  const weeksTotal = kpi?.weeks_total ?? 1;
  const progressPercent = Math.round((weeksCompleted / weeksTotal) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              {t('header.navigation.vedicStudentDashboard')}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">Track your learning journey, access courses, and monitor your progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: Target, label: 'Level', value: kpi?.level_name || 'Not Enrolled', color: 'text-blue-500' },
            { icon: CheckCircle, label: 'Weeks Completed', value: `${weeksCompleted}/${weeksTotal}`, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Progress', value: `${progressPercent}%`, color: 'text-purple-500' },
            { icon: Clock, label: 'Last Activity', value: kpi?.last_activity_at ? new Date(kpi.last_activity_at).toLocaleDateString() : 'Never', color: 'text-orange-500' }
          ].map((stat, i) => (
            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Main Progress Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-border/50 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Learning Progress</h2>
              <p className="text-muted-foreground">Overall completion across all enrolled courses</p>
            </div>
            <BarChart3 className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-bold">{Math.round(completionPercent)}%</span>
              </div>
              <Progress value={completionPercent} className="h-3" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{weeksCompleted}</div>
                <div className="text-xs text-muted-foreground">Weeks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{kpi?.weeks_in_progress ?? 0}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{weeksTotal - weeksCompleted}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{weeksTotal}</div>
                <div className="text-xs text-muted-foreground">Total Weeks</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Video,
              title: 'Live Sessions',
              desc: 'Join upcoming classes',
              link: '/academy/astrology/vedic/sessions',
              color: 'from-blue-500/10 to-purple-500/10',
              badge: '3 Upcoming'
            },
            {
              icon: FileText,
              title: 'Assignments',
              desc: 'View and submit work',
              link: '/academy/astrology/vedic/assignments',
              color: 'from-purple-500/10 to-pink-500/10',
              badge: '2 Pending'
            },
            {
              icon: MessageSquare,
              title: 'Forum',
              desc: 'Engage with community',
              link: '/academy/astrology/vedic/forum',
              color: 'from-pink-500/10 to-orange-500/10',
              badge: '12 New'
            }
          ].map((action, i) => (
            <Card key={i} className={`p-6 bg-gradient-to-br ${action.color} border-border/50 hover:border-primary/50 transition-all hover:shadow-xl group`}>
              <action.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{action.title}</h3>
                <Badge variant="secondary" className="text-xs">{action.badge}</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{action.desc}</p>
              <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Link to={action.link}>
                  Open
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* Enrolled Courses */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enrolled Courses</h2>
              <p className="text-muted-foreground">Your active learning paths</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/academy/astrology/vedic/courses">
                Browse All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Vedic Fundamentals', 'Chart Analysis', 'Dasha Systems', 'Predictive Techniques'].map((course, i) => (
              <Card key={i} className="p-6 bg-background/50 border-border/50 hover:border-primary/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{course}</h3>
                    <Badge variant="outline" className="mb-3">
                      Level {Math.min(i + 1, 4)}
                    </Badge>
                  </div>
                  <Play className="w-10 h-10 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <Progress value={25 + (i * 15)} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{25 + (i * 15)}% Complete</span>
                  <Button asChild variant="ghost" size="sm" className="h-7">
                    <Link to={`/academy/astrology/vedic/course/${i + 1}`}>
                      Continue
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Certificates & Achievements */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Certificates & Achievements</h2>
              <p className="text-muted-foreground">Your earned credentials and milestones</p>
            </div>
            <Award className="w-12 h-12 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weeksCompleted > 0 ? (
              <Card className="p-6 bg-primary/5 border-primary/30">
                <Award className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Foundation Progress</h3>
                <p className="text-sm text-muted-foreground">Completed {weeksCompleted} weeks</p>
              </Card>
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                Complete your first course to earn certificates
              </div>
            )}
          </div>
        </Card>

        {/* Detailed Panels */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Course Management</h2>
          <StudentAcademyPanels />
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicStudentDashboard;
