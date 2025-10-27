import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, LayoutGrid, ClipboardList, Megaphone, BookOpen, Save, Trash2, Plus } from "lucide-react";

interface CourseSection { id: string; code?: string; name?: string; }
interface Assignment { id: string; section_id: string; title: string; description?: string; due_date?: string; max_points?: number; }
interface Announcement { id: string; title: string; content?: string; published_at?: string; }
interface SectionResource { id: string; section_id: string; title: string; url?: string; }

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="text-xs text-muted-foreground">{label}</div>
    {children}
  </div>
);

export const FacultyAcademyPanels: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<SectionResource[]>([]);

  const [newSection, setNewSection] = useState<Partial<CourseSection>>({});
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({});
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({});
  const [newResource, setNewResource] = useState<Partial<SectionResource>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: secData } = await supabase.from("cur_sections").select("id, code, name").order("name");
        setSections(secData || []);
        const { data: assignData } = await supabase.from("cur_assignments").select("id, section_id, title, description, due_date, max_points").order("due_date");
        setAssignments(assignData || []);
        const { data: annData } = await supabase.from("com_announcements").select("id, title, content, published_at").order("published_at", { ascending: false });
        setAnnouncements(annData || []);
        const { data: resData } = await supabase.from("res_section_resources").select("id, section_id, title, url").order("title");
        setResources(resData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const refreshSections = async () => {
    const { data } = await supabase.from("cur_sections").select("id, code, name").order("name");
    setSections(data || []);
  };
  const refreshAssignments = async () => {
    const { data } = await supabase.from("cur_assignments").select("id, section_id, title, description, due_date, max_points").order("due_date");
    setAssignments(data || []);
  };
  const refreshAnnouncements = async () => {
    const { data } = await supabase.from("com_announcements").select("id, title, content, published_at").order("published_at", { ascending: false });
    setAnnouncements(data || []);
  };
  const refreshResources = async () => {
    const { data } = await supabase.from("res_section_resources").select("id, section_id, title, url").order("title");
    setResources(data || []);
  };

  const getActualTableName = (table: string) => {
    if (table === "course_sections") return "cur_sections";
    if (table === "assignments") return "cur_assignments";
    if (table === "announcements") return "com_announcements";
    if (table === "section_resources") return "res_section_resources";
    return table;
  };

  // Generic helpers
  const handleInsert = async (table: string, values: Record<string, any>, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table)).insert(values);
    if (error) { console.error(error); return; }
    await refresh();
  };
  const handleUpdate = async (table: string, id: string, values: Record<string, any>, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table)).update(values).eq("id", id);
    if (error) { console.error(error); return; }
    await refresh();
  };
  const handleDelete = async (table: string, id: string, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table)).delete().eq("id", id);
    if (error) { console.error(error); return; }
    await refresh();
  };

  return (
    <Tabs defaultValue="sections" className="space-y-6">
      <TabsList>
        <TabsTrigger value="sections" className="flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> Sections</TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Assignments</TabsTrigger>
        <TabsTrigger value="announcements" className="flex items-center gap-2"><Megaphone className="w-4 h-4" /> Announcements</TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="sections">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> Manage Sections</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>)}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Code"><Input value={newSection.code || ""} onChange={e => setNewSection(s => ({ ...s, code: e.target.value }))} /></Field>
                <Field label="Name"><Input value={newSection.name || ""} onChange={e => setNewSection(s => ({ ...s, name: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("course_sections", newSection as any, refreshSections)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Create</Button>
              </div>
              <div className="space-y-3">
                {sections.map(sec => (
                  <div key={sec.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">{sec.code} — {sec.name}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("course_sections", sec.id, { name: sec.name, code: sec.code }, refreshSections)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("course_sections", sec.id, refreshSections)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assignments">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Manage Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Section ID"><Input value={newAssignment.section_id || ""} onChange={e => setNewAssignment(a => ({ ...a, section_id: e.target.value }))} /></Field>
                <Field label="Title"><Input value={newAssignment.title || ""} onChange={e => setNewAssignment(a => ({ ...a, title: e.target.value }))} /></Field>
                <Field label="Description"><Textarea value={newAssignment.description || ""} onChange={e => setNewAssignment(a => ({ ...a, description: e.target.value }))} /></Field>
                <Field label="Due Date (ISO)"><Input value={newAssignment.due_date || ""} onChange={e => setNewAssignment(a => ({ ...a, due_date: e.target.value }))} /></Field>
                <Field label="Max Points"><Input type="number" value={newAssignment.max_points as any || ""} onChange={e => setNewAssignment(a => ({ ...a, max_points: Number(e.target.value) }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("assignments", newAssignment as any, refreshAssignments)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Create</Button>
              </div>
              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">[{a.section_id}] {a.title}</div>
                    <div className="text-xs text-muted-foreground">Due: {a.due_date || "—"} • Max: {typeof a.max_points === "number" ? a.max_points : "—"}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("assignments", a.id, { title: a.title, description: a.description, due_date: a.due_date, max_points: a.max_points }, refreshAssignments)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("assignments", a.id, refreshAssignments)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="announcements">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="w-5 h-5" /> Manage Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Title"><Input value={newAnnouncement.title || ""} onChange={e => setNewAnnouncement(a => ({ ...a, title: e.target.value }))} /></Field>
                <Field label="Content"><Textarea value={newAnnouncement.content || ""} onChange={e => setNewAnnouncement(a => ({ ...a, content: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("announcements", newAnnouncement as any, refreshAnnouncements)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Publish</Button>
              </div>
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">Published: {a.published_at || "—"}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("announcements", a.id, { title: a.title, content: a.content }, refreshAnnouncements)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("announcements", a.id, refreshAnnouncements)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="resources">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Manage Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Section ID"><Input value={newResource.section_id || ""} onChange={e => setNewResource(r => ({ ...r, section_id: e.target.value }))} /></Field>
                <Field label="Title"><Input value={newResource.title || ""} onChange={e => setNewResource(r => ({ ...r, title: e.target.value }))} /></Field>
                <Field label="URL"><Input value={newResource.url || ""} onChange={e => setNewResource(r => ({ ...r, url: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("section_resources", newResource as any, refreshResources)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Create</Button>
              </div>
              <div className="space-y-3">
                {resources.map(r => (
                  <div key={r.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">[{r.section_id}] {r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.url}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("section_resources", r.id, { title: r.title, url: r.url }, refreshResources)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("section_resources", r.id, refreshResources)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FacultyAcademyPanels;