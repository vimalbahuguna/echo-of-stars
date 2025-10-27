import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { Loader2, ClipboardList, CheckCircle, LayoutGrid } from "lucide-react";

interface SectionEnrollment {
  id: string;
  membership_id: string;
  section_id?: string; // may be missing in migration index; handle gracefully
  status: string;
  created_at: string;
  updated_at: string;
}

interface Assignment {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  due_at?: string;
  max_points?: number;
  created_at: string;
  updated_at: string;
}

interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  membership_id: string;
  submitted_at?: string;
  grade_points?: number;
  feedback?: string;
  updated_at: string;
}

interface CourseSectionSummary {
  id: string;
  code?: string;
  title?: string;
}

export const StudentAcademyPanels: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<SectionEnrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [sections, setSections] = useState<Record<string, CourseSectionSummary>>({});

  const membershipIds = useMemo(() => {
    // In absence of direct membership lookup here, we rely on RLS-filtered queries.
    // However we can derive membership_ids from enrollments once fetched.
    return enrollments.map(e => e.membership_id);
  }, [enrollments]);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        // 1) Fetch section enrollments (RLS restricts to own memberships)
        const { data: enrollData, error: enrollErr } = await supabase
          .from("section_enrollments" as any)
          .select("id, membership_id, status, created_at, updated_at, section_id")
          .order("created_at", { ascending: false });
        if (enrollErr) throw enrollErr;
        setEnrollments((enrollData as any) || []);

        const sectionIds = (enrollData || [])
          .map(e => (e as any).section_id)
          .filter(Boolean);

        // 2) Fetch section summaries to show context
        if (sectionIds.length) {
          const { data: sectData, error: sectErr } = await supabase
            .from("course_sections" as any)
            .select("id, code, title")
            .in("id", sectionIds);
          if (sectErr) throw sectErr;
          const map: Record<string, CourseSectionSummary> = {};
          ((sectData as any) || []).forEach((s: any) => { map[s.id] = s; });
          setSections(map);
        } else {
          setSections({});
        }

        // 3) Fetch assignments (RLS returns only for enrolled sections)
        const { data: assignData, error: assignErr } = await supabase
          .from("assignments" as any)
          .select("id, section_id, title, description, due_at, max_points, created_at, updated_at")
          .order("due_at", { ascending: true });
        if (assignErr) throw assignErr;
        setAssignments((assignData as any) || []);

        // 4) Fetch own submissions (RLS returns only for own membership_ids)
        const { data: subData, error: subErr } = await supabase
          .from("assignment_submissions" as any)
          .select("id, assignment_id, membership_id, submitted_at, grade_points, feedback, updated_at")
          .order("updated_at", { ascending: false });
        if (subErr) throw subErr;
        setSubmissions((subData as any) || []);
      } catch (e) {
        console.error("Student panels load error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const submissionByAssignment: Record<string, AssignmentSubmission> = useMemo(() => {
    const map: Record<string, AssignmentSubmission> = {};
    submissions.forEach(s => { map[s.assignment_id] = s; });
    return map;
  }, [submissions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> My Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading enrollments…</div>)}
          {!loading && enrollments.length === 0 && (
            <div className="text-sm text-muted-foreground">No section enrollments yet.</div>
          )}
          {!loading && enrollments.length > 0 && (
            <div className="space-y-3">
              {enrollments.map(e => {
                const sec = e.section_id ? sections[e.section_id] : undefined;
                return (
                  <div key={e.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{sec?.code || "Section"} {sec?.title ? `— ${sec.title}` : ""}</div>
                      <div className="text-xs text-muted-foreground">Status: {e.status}</div>
                    </div>
                    <Badge variant="outline">Enrollment</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading assignments…</div>)}
          {!loading && assignments.length === 0 && (
            <div className="text-sm text-muted-foreground">No assignments published yet.</div>
          )}
          {!loading && assignments.length > 0 && (
            <div className="space-y-3">
              {assignments.map(a => {
                const sub = submissionByAssignment[a.id];
                return (
                  <div key={a.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{a.title}</div>
                      {a.due_at && (
                        <Badge variant="outline">Due {new Date(a.due_at).toLocaleString()}</Badge>
                      )}
                    </div>
                    {a.description && (
                      <div className="text-sm text-muted-foreground mt-1">{a.description}</div>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {sub ? (
                        <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Submitted</Badge>
                      ) : (
                        <Button size="sm" variant="outline" disabled>Submit (coming soon)</Button>
                      )}
                      {typeof a.max_points === "number" && (
                        <Badge variant="outline">Max {a.max_points} pts</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAcademyPanels;