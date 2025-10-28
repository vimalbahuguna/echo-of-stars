import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VedicAcademyHeader from '@/components/academy/VedicAcademyHeader';
import VedicAcademyFooter from '@/components/academy/VedicAcademyFooter';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const VedicCourseIndex: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, any[]>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const sb: any = supabase;
        const { data: courseData, error: courseErr } = await sb
          .from('courses')
          .select('id, title, slug, level, category, language, published')
          .eq('category', 'astrology')
          .eq('published', true);
        if (courseErr) { setError(courseErr.message); return; }
        setCourses(courseData || []);

        const lessonsMap: Record<string, any[]> = {};
        for (const c of courseData || []) {
          const { data: lessonData } = await sb
            .from('lessons')
            .select('id, title, slug, order_index, published')
            .eq('course_id', c.id)
            .eq('published', true)
            .order('order_index', { ascending: true });
          lessonsMap[c.id] = lessonData || [];
        }
        setLessonsByCourse(lessonsMap);
      } catch (e: any) {
        setError(e.message);
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
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — Courses & Lessons
          </h1>
        </div>

        {error && (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="p-6 bg-card/80 backdrop-blur border-border/30">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <span className="text-xs text-muted-foreground uppercase">{course.level}</span>
              </div>
              <div className="space-y-2">
                {(lessonsByCourse[course.id] || []).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between">
                    <span className="text-sm">{lesson.title}</span>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/academy/astrology/vedic/course/${course.slug}/lesson/${lesson.slug}`}>View</Link>
                    </Button>
                  </div>
                ))}
                {(!lessonsByCourse[course.id] || lessonsByCourse[course.id].length === 0) && (
                  <p className="text-sm text-muted-foreground">No published lessons yet.</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/academy/astrology/vedic/syllabus">Back to Syllabus</Link>
          </Button>
        </div>
      </main>
      <VedicAcademyFooter />
    </div>
  );
};

export default VedicCourseIndex;