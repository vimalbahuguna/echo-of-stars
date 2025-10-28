import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VedicAcademyHeader from '@/components/academy/VedicAcademyHeader';
import VedicAcademyFooter from '@/components/academy/VedicAcademyFooter';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const VedicLessonViewer: React.FC = () => {
  const { t } = useTranslation();
  const { slug, courseSlug } = useParams();
  const [lesson, setLesson] = useState<any | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const sb: any = supabase;
        let courseId: string | null = null;
        if (courseSlug) {
          const { data: courseData, error: courseErr } = await sb
            .from('courses')
            .select('id, title')
            .eq('slug', courseSlug)
            .eq('published', true)
            .single();
          if (courseErr) { setError(courseErr.message); return; }
          courseId = courseData?.id || null;
          setCourseTitle(courseData?.title || '');
        }

        const lessonQuery = sb
          .from('lessons')
          .select('id, course_id, title, content, published')
          .eq('slug', slug)
          .eq('published', true);
        const { data: fetchedLessons, error: lessonErr } = courseId
          ? await lessonQuery.eq('course_id', courseId)
          : await lessonQuery;
        if (lessonErr) { setError(lessonErr.message); return; }

        const lessonData = Array.isArray(fetchedLessons) ? fetchedLessons[0] : fetchedLessons;
        setLesson(lessonData);
        if (!courseTitle && lessonData?.course_id) {
          const { data: course } = await sb
            .from('courses')
            .select('title')
            .eq('id', lessonData.course_id)
            .single();
          setCourseTitle(course?.title || '');
        }
      } catch (e: any) {
        setError(e.message);
      }
    };
    load();
  }, [slug, courseSlug]);

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <VedicAcademyHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — Lesson
          </h1>
        </div>

        {error && (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {!lesson && !error && (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <p className="text-sm text-muted-foreground">Loading lesson or access restricted by RLS.</p>
          </Card>
        )}

        {lesson && (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            {courseTitle && (
              <div className="text-sm text-muted-foreground mb-2">Course: {courseTitle}</div>
            )}
            <h2 className="text-xl font-semibold mb-3">{lesson.title}</h2>
            {lesson.content ? (
              <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            ) : (
              <p className="text-sm text-muted-foreground">No content yet for this lesson.</p>
            )}
            <div className="mt-6 flex gap-3">
              <Button asChild variant="outline">
                <Link to="/academy/astrology/vedic/syllabus">Back to Syllabus</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/academy/astrology/vedic/courses">All Courses & Lessons</Link>
              </Button>
            </div>
          </Card>
        )}
      </main>
      <VedicAcademyFooter />
    </div>
  );
};

export default VedicLessonViewer;