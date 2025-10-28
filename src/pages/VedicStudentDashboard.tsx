import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Award, BookOpen, CalendarDays } from 'lucide-react';
import StudentAcademyPanels from "@/components/academy/StudentAcademyPanels";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { updateWeekProgress } from '@/integrations/supabase/academyProgress';

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
  const { user, profile } = useAuth();
  const [kpi, setKpi] = useState<ActiveStudentProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Form state for updating progress
  const [weekId, setWeekId] = useState<number | ''>('');
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'skipped'>('in_progress');
  const [completion, setCompletion] = useState<number>(50);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // RLS should scope rows by user/tenant; grab the latest activity row
        const { data, error } = await (supabase as any)
          .from('vw_active_students_progress' as any)
          .select('student_id, student_name, enrollment_id, level_id, level_name, weeks_total, weeks_completed, weeks_in_progress, avg_completion_percentage, last_activity_at')
          .order('last_activity_at', { ascending: false })
          .limit(1);
        if (error) throw error;
        const rows = (Array.isArray(data) ? data : [data]).filter(Boolean) as unknown as ActiveStudentProgress[];
        const row = rows[0] ?? null;
        setKpi(row);
      } catch (e: any) {
        setError(e.message || 'Failed to load progress');
        console.error('Progress KPI load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, profile?.tenant_id]);

  const refreshKpi = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase as any)
        .from('vw_active_students_progress' as any)
        .select('student_id, student_name, enrollment_id, level_id, level_name, weeks_total, weeks_completed, weeks_in_progress, avg_completion_percentage, last_activity_at')
        .order('last_activity_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      const rows = (Array.isArray(data) ? data : [data]).filter(Boolean) as unknown as ActiveStudentProgress[];
      setKpi(rows[0] ?? null);
    } catch (e) {
      console.error('Refresh KPI failed:', e);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekId || typeof weekId !== 'number') {
      setError('Please enter a valid Week ID');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateWeekProgress({
        week_id: weekId,
        status,
        completion_percentage: completion,
        notes: notes || undefined,
      });
      if (!res.ok) {
        throw new Error(res.message || 'Failed to update progress');
      }
      await refreshKpi();
      setNotes('');
    } catch (e: any) {
      setError(e?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicStudentDashboard')}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">Your courses, progress, assignments, and certificates.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Vedic Fundamentals</Badge>
              <Badge variant="outline">Chart Analysis</Badge>
              <Badge variant="outline">Dasha Systems</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-4">View Catalog</Button>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            {!loading && !error && kpi && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Level</div>
                  <div className="text-sm font-medium">{kpi.level_name || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Weeks Total</div>
                  <div className="text-sm font-medium">{kpi.weeks_total ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div className="text-sm font-medium">{kpi.weeks_completed ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                  <div className="text-sm font-medium">{kpi.weeks_in_progress ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Completion</div>
                  <div className="text-sm font-medium">{typeof kpi.avg_completion_percentage === 'number' ? `${Math.round(kpi.avg_completion_percentage)}%` : '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Activity</div>
                  <div className="text-sm font-medium">{kpi.last_activity_at ? new Date(kpi.last_activity_at).toLocaleString() : '—'}</div>
                </div>
              </div>
            )}
            {loading && (
              <p className="text-sm text-muted-foreground">Loading progress…</p>
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <LineChart className="w-16 h-16 text-secondary mt-3" />

            {/* Update progress form */}
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Week ID</label>
                  <input
                    type="number"
                    value={weekId === '' ? '' : weekId}
                    onChange={(e) => setWeekId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="skipped">Skipped</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Completion %</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={completion}
                  onChange={(e) => setCompletion(Number(e.target.value))}
                  className="mt-1 w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">{completion}%</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm"
                  rows={2}
                  placeholder="E.g., revised assignment, attended workshop"
                />
              </div>
              <Button type="submit" variant="default" size="sm" disabled={submitting}>
                {submitting ? 'Updating…' : 'Update Week Progress'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Certificates</h3>
            <p className="text-sm text-muted-foreground">Completed course certificates appear here.</p>
            <Award className="w-16 h-16 text-foreground mt-2" />
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
            <p className="text-sm text-muted-foreground">Next sessions and assignment deadlines.</p>
            <CalendarDays className="w-16 h-16 text-accent mt-2" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Announcements</h3>
            <p className="text-sm text-muted-foreground">Faculty and academy-wide updates.</p>
          </Card>
        </div>

        {/* New student panels hooked to Supabase tables */}
        <div className="mt-8">
          <StudentAcademyPanels />
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicStudentDashboard;