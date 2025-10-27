import { supabase } from '@/integrations/supabase/client';

// Matches Postgres enum stu_progress_status_enum values
export type WeekProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface UpdateWeekProgressInput {
  student_id?: number; // optional: if omitted, RPC uses current user
  week_id: number;
  status: WeekProgressStatus;
  completion_percentage: number;
  notes?: string;
  started_date?: string | null; // YYYY-MM-DD or null
  completed_date?: string | null; // YYYY-MM-DD or null
}

export interface ActiveStudentProgressKPI {
  student_id: number;
  level_name: string;
  weeks_total: number;
  weeks_completed: number;
  weeks_in_progress: number;
  avg_completion_percentage: number | null;
  last_activity_at: string | null;
}

export async function fetchStudentProgressKPIs() {
  const { data, error } = await (supabase as any)
    .from('vw_active_students_progress' as any)
    .select('student_id, level_name, weeks_total, weeks_completed, weeks_in_progress, avg_completion_percentage, last_activity_at')
    .order('last_activity_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  const rows = (Array.isArray(data) ? data : [data]).filter(Boolean) as unknown as ActiveStudentProgressKPI[];
  return rows[0] ?? null;
}

export async function updateWeekProgress(input: UpdateWeekProgressInput): Promise<{ ok: boolean; via: 'rpc' | 'edge'; message?: string } > {
  // Normalize dates based on status if not explicitly provided
  const normalized: UpdateWeekProgressInput = {
    ...input,
    started_date: typeof input.started_date !== 'undefined' ? input.started_date : (input.status === 'in_progress' ? new Date().toISOString().slice(0, 10) : null),
    completed_date: typeof input.completed_date !== 'undefined' ? input.completed_date : (input.status === 'completed' ? new Date().toISOString().slice(0, 10) : null),
  };

  // First try Postgres RPC function
  try {
    const { error } = await (supabase as any).rpc('progress_update_week' as any, {
      p_student_id: normalized.student_id ?? null,
      p_week_id: normalized.week_id,
      p_completion: normalized.completion_percentage,
      p_status: normalized.status,
      p_notes: normalized.notes ?? null,
      p_started_date: normalized.started_date ?? null,
      p_completed_date: normalized.completed_date ?? null,
    } as any);
    if (!error) {
      return { ok: true, via: 'rpc' };
    }
    // If rpc responded with error, fall back to edge function
    const { data, error: edgeErr } = await supabase.functions.invoke('progress-update-week', {
      body: normalized,
    });
    if (edgeErr) throw edgeErr;
    return { ok: !!(data?.ok), via: 'edge', message: data?.message };
  } catch (e: any) {
    // final attempt: Edge function only
    try {
      const { data, error } = await supabase.functions.invoke('progress-update-week', {
        body: normalized,
      });
      if (error) throw error;
      return { ok: !!(data?.ok), via: 'edge', message: data?.message };
    } catch (err: any) {
      throw err;
    }
  }
}