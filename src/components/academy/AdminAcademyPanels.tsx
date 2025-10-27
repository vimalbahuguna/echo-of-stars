import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, ShieldCheck, Settings, Save, Trash2, Plus } from "lucide-react";

interface Membership { id: string; user_id: string; tenant_id: string; role: string; }
interface Cohort { id: string; tenant_id: string; name: string; }
interface CohortMember { id: string; cohort_id: string; membership_id: string; }

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="text-xs text-muted-foreground">{label}</div>
    {children}
  </div>
);

export const AdminAcademyPanels: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohortMembers, setCohortMembers] = useState<CohortMember[]>([]);

  const [newMembership, setNewMembership] = useState<Partial<Membership>>({});
  const [newCohort, setNewCohort] = useState<Partial<Cohort>>({});
  const [newCohortMember, setNewCohortMember] = useState<Partial<CohortMember>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: memData } = await supabase.from("academy_memberships" as any).select("id, user_id, tenant_id, role").order("tenant_id");
        setMemberships((memData as any) || []);
        const { data: cohortData } = await supabase.from("stu_cohorts" as any).select("id, tenant_id, name").order("name");
        setCohorts((cohortData as any) || []);
        const { data: cmData } = await supabase.from("stu_cohort_members" as any).select("id, cohort_id, membership_id").order("cohort_id");
        setCohortMembers((cmData as any) || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const refreshMemberships = async () => {
    const { data } = await supabase.from("academy_memberships" as any).select("id, user_id, tenant_id, role").order("tenant_id");
    setMemberships((data as any) || []);
  };
  const refreshCohorts = async () => {
    const { data } = await supabase.from("stu_cohorts" as any).select("id, tenant_id, name").order("name");
    setCohorts((data as any) || []);
  };
  const refreshCohortMembers = async () => {
    const { data } = await supabase.from("stu_cohort_members" as any).select("id, cohort_id, membership_id").order("cohort_id");
    setCohortMembers((data as any) || []);
  };

  const getActualTableName = (table: string) => {
    if (table === "academy_cohorts") return "stu_cohorts";
    if (table === "cohort_members") return "stu_cohort_members";
    return table;
  };

  const handleInsert = async (table: string, values: Record<string, any>, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table) as any).insert(values);
    if (error) { console.error(error); return; }
    await refresh();
  };
  const handleUpdate = async (table: string, id: string, values: Record<string, any>, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table) as any).update(values).eq("id", id);
    if (error) { console.error(error); return; }
    await refresh();
  };
  const handleDelete = async (table: string, id: string, refresh: () => Promise<void>) => {
    const { error } = await supabase.from(getActualTableName(table) as any).delete().eq("id", id);
    if (error) { console.error(error); return; }
    await refresh();
  };

  return (
    <Tabs defaultValue="memberships" className="space-y-6">
      <TabsList>
        <TabsTrigger value="memberships" className="flex items-center gap-2"><Users className="w-4 h-4" /> Memberships</TabsTrigger>
        <TabsTrigger value="cohorts" className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Cohorts</TabsTrigger>
        <TabsTrigger value="cohortMembers" className="flex items-center gap-2"><Settings className="w-4 h-4" /> Cohort Members</TabsTrigger>
      </TabsList>

      <TabsContent value="memberships">
        <Card>
          <CardHeader><CardTitle>Manage Academy Memberships</CardTitle></CardHeader>
          <CardContent>
            {loading && (<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>)}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="User ID"><Input value={newMembership.user_id || ""} onChange={e => setNewMembership(m => ({ ...m, user_id: e.target.value }))} /></Field>
                <Field label="Tenant ID"><Input value={newMembership.tenant_id || ""} onChange={e => setNewMembership(m => ({ ...m, tenant_id: e.target.value }))} /></Field>
                <Field label="Role"><Input value={newMembership.role || ""} onChange={e => setNewMembership(m => ({ ...m, role: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("academy_memberships", newMembership as any, refreshMemberships)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Create</Button>
              </div>
              <div className="space-y-3">
                {memberships.map(m => (
                  <div key={m.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">{m.user_id} • {m.tenant_id} • {m.role}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("academy_memberships", m.id, { role: m.role }, refreshMemberships)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("academy_memberships", m.id, refreshMemberships)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cohorts">
        <Card>
          <CardHeader><CardTitle>Manage Cohorts</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Tenant ID"><Input value={newCohort.tenant_id || ""} onChange={e => setNewCohort(c => ({ ...c, tenant_id: e.target.value }))} /></Field>
                <Field label="Name"><Input value={newCohort.name || ""} onChange={e => setNewCohort(c => ({ ...c, name: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("academy_cohorts", newCohort as any, refreshCohorts)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Create</Button>
              </div>
              <div className="space-y-3">
                {cohorts.map(c => (
                  <div key={c.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">{c.name} • {c.tenant_id}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdate("academy_cohorts", c.id, { name: c.name }, refreshCohorts)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("academy_cohorts", c.id, refreshCohorts)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cohortMembers">
        <Card>
          <CardHeader><CardTitle>Manage Cohort Members</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Cohort ID"><Input value={newCohortMember.cohort_id || ""} onChange={e => setNewCohortMember(cm => ({ ...cm, cohort_id: e.target.value }))} /></Field>
                <Field label="Membership ID"><Input value={newCohortMember.membership_id || ""} onChange={e => setNewCohortMember(cm => ({ ...cm, membership_id: e.target.value }))} /></Field>
                <Button size="sm" onClick={() => handleInsert("cohort_members", newCohortMember as any, refreshCohortMembers)} className="mt-2"><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
              <div className="space-y-3">
                {cohortMembers.map(cm => (
                  <div key={cm.id} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">Cohort {cm.cohort_id} • Member {cm.membership_id}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("cohort_members", cm.id, refreshCohortMembers)}><Trash2 className="w-4 h-4 mr-1" /> Remove</Button>
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

export default AdminAcademyPanels;