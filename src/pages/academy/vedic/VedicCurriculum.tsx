import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VedicAcademyHeader from '@/components/academy/VedicAcademyHeader';
import VedicAcademyFooter from '@/components/academy/VedicAcademyFooter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenCheck } from 'lucide-react';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useSearchParams } from "react-router-dom";

const VedicCurriculum: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);
  const [sectionsByCourse, setSectionsByCourse] = useState<Record<string, any[]>>({});
  const [selectedLevel, setSelectedLevel] = useState<'all'|'foundation'|'practitioner'|'professional'|'master'>('all');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const levelParam = (searchParams.get('level') || '').toLowerCase();
    if (['foundation','practitioner','professional','master'].includes(levelParam)) {
      setSelectedLevel(levelParam as any);
    }
  }, []);

  useEffect(() => {
    if (selectedLevel === 'all') {
      searchParams.delete('level');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ level: selectedLevel });
    }
  }, [selectedLevel]);

  const levelToCourseLevel: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    foundation: 'beginner',
    practitioner: 'intermediate',
    professional: 'advanced',
    master: 'advanced',
  };

  const visibleCourses = selectedLevel === 'all'
    ? courses
    : courses.filter((c) => c.level === levelToCourseLevel[selectedLevel]);

  useEffect(() => {
    const load = async () => {
      const { data: courseData, error: courseErr } = await supabase
        .from('courses')
        .select('id, title, slug, description, level, category, language, published')
        .eq('category', 'astrology')
        .eq('published', true)
        .order('title');
      if (courseErr) { console.error(courseErr); return; }
      setCourses(courseData || []);

      const courseIds = (courseData || []).map((c: any) => c.id);
      if (courseIds.length) {
        const { data: sectionData, error: sectionErr } = await supabase
          .from('course_sections' as any)
          .select('id, course_id, code, title, status')
          .in('course_id', courseIds)
          .eq('status', 'active');
        if (sectionErr) { console.warn('Sections may be restricted by RLS:', sectionErr); return; }
        const grouped: Record<string, any[]> = {};
        (sectionData || []).forEach((s: any) => {
          grouped[s.course_id] = grouped[s.course_id] || [];
          grouped[s.course_id].push(s);
        });
        setSectionsByCourse(grouped);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <VedicAcademyHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="flex items-center gap-3 mb-6">
          <BookOpenCheck className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — Curriculum
          </h1>
        </div>

        <p className="text-muted-foreground mb-6 max-w-3xl">
          Certification Levels: Foundation Certificate (3 months), Practitioner Diploma (6 months), Professional Certification (9 months), Master Astrologer Certification (12 months). Total duration: 30 months for complete mastery.
        </p>

        {/* Certification Level Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-3">
          <Button variant={selectedLevel === 'all' ? 'default' : 'outline'} onClick={() => setSelectedLevel('all')}>All Levels</Button>
          <Button variant={selectedLevel === 'foundation' ? 'default' : 'outline'} onClick={() => setSelectedLevel('foundation')}>Foundation</Button>
          <Button variant={selectedLevel === 'practitioner' ? 'default' : 'outline'} onClick={() => setSelectedLevel('practitioner')}>Practitioner</Button>
          <Button variant={selectedLevel === 'professional' ? 'default' : 'outline'} onClick={() => setSelectedLevel('professional')}>Professional</Button>
          <Button variant={selectedLevel === 'master' ? 'default' : 'outline'} onClick={() => setSelectedLevel('master')}>Master</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Fundamentals</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Graha</Badge>
              <Badge variant="outline">Rashi</Badge>
              <Badge variant="outline">Nakshatra</Badge>
              <Badge variant="outline">Panchanga</Badge>
            </div>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Chart Analysis</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">D1</Badge>
              <Badge variant="outline">D9</Badge>
              <Badge variant="outline">Yogas</Badge>
              <Badge variant="outline">Case Studies</Badge>
            </div>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Predictive Methods</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Dasha</Badge>
              <Badge variant="outline">Transit</Badge>
              <Badge variant="outline">Remedial</Badge>
            </div>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Ethics & Practice</h3>
            <p className="text-sm text-muted-foreground">Boundaries, consent, and compassionate delivery.</p>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Research</h3>
            <p className="text-sm text-muted-foreground">Methods for developing and publishing findings.</p>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Published Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 && (
              <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
                <p className="text-sm text-muted-foreground">No published astrology courses found or access is restricted.</p>
              </Card>
            )}
            {visibleCourses.map((c) => (
              <Card key={c.id} className="p-6 bg-card/80 backdrop-blur border-border/30">
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                {c.description && (<p className="text-sm text-muted-foreground mb-2">{c.description}</p>)}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Level: {c.level}</Badge>
                  <Badge variant="outline">Language: {c.language}</Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Active Sections:</span>{' '}
                  {sectionsByCourse[c.id]?.length ? (
                    <span>{sectionsByCourse[c.id].map((s) => s.code || s.title).join(', ')}</span>
                  ) : (
                    <span className="text-muted-foreground">None visible (sign in to see tenant sections)</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <VedicAcademyFooter />
    </div>
  );
};

export default VedicCurriculum;