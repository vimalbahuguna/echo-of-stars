import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListChecks } from 'lucide-react';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';

const VedicSyllabus: React.FC = () => {
  const { t } = useTranslation();
  // add dynamic syllabus state and auth
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [sections, setSections] = useState<Record<string, { title?: string; code?: string }>>({});
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, any[]>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'foundation' | 'practitioner' | 'professional' | 'master'>('foundation');
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicMappings, setTopicMappings] = useState<Record<string, { lesson_id?: string; course_id?: string; topic_key?: string; lesson_slug?: string }>>({});

  useEffect(() => {
    const paramLevel = searchParams.get('level');
    if (paramLevel && ['foundation','practitioner','professional','master'].includes(paramLevel)) {
      setSelectedLevel(paramLevel as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearchParams({ level: selectedLevel });
  }, [selectedLevel, setSearchParams]);

  const levelToCourseLevel: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    foundation: 'beginner',
    practitioner: 'intermediate',
    professional: 'advanced',
    master: 'advanced',
  };

  const levelMeta = {
    foundation: { months: 3, weeks: 12, days: 90 },
    practitioner: { months: 6, weeks: 24, days: 180 },
    professional: { months: 9, weeks: 36, days: 270 },
    master: { months: 12, weeks: 48, days: 365 },
  } as const;

  const syllabusStructure = {
    foundation: [
      {
        month: 1,
        title: 'Foundations of Vedic Astrology',
        weeks: [
          {
            range: 'Week 1-2',
            topics: [
              'History and philosophy of Vedic Astrology',
              'Difference between Vedic and Western Astrology',
              'Basic astronomy and celestial mechanics',
              'Understanding the Zodiac (Rashis)',
              'The concept of Ayanamsa (Lahiri, Raman, KP)',
              'Ethics and responsibilities of an astrologer',
            ],
          },
          {
            range: 'Week 3-4',
            topics: [
              'Nine planets (Navagrahas): Sun through Ketu',
              'Planetary characteristics and significations',
              'Natural benefics and malefics',
              'Planetary friendships and enmities',
              'Planetary dignity: Exaltation, Debilitation, Mooltrikona, Own sign',
              'Planetary periods (Dashas) - Introduction',
            ],
          },
        ],
      },
      {
        month: 2,
        title: 'Chart Structure and House System',
        weeks: [
          {
            range: 'Week 5-6',
            topics: [
              'Significance of each house (1st through 12th)',
              'House lordships and their effects',
              'Kendras, Trikonas, Dusthanas, Upachayas',
              'House significations in different life areas',
              'Bhava Madhya (house cusps) concepts',
            ],
          },
          {
            range: 'Week 7-8',
            topics: [
              'Twelve Zodiac signs in detail',
              'Elemental classification (Fire, Earth, Air, Water)',
              'Modal classification (Cardinal, Fixed, Mutable)',
              'Sign characteristics and personalities',
              'Sign rulerships by planets',
              'Navamsa sign significance',
            ],
          },
        ],
      },
      {
        month: 3,
        title: 'Basic Chart Interpretation',
        weeks: [
          {
            range: 'Week 9-10',
            topics: [
              'Vedic aspects (Drishti) - full and partial',
              'Conjunctions (Yuti) and their effects',
              'Planetary combinations (Yogas) - basic',
              'Benefic and malefic combinations',
              'Combustion, Retrogression basics',
            ],
          },
          {
            range: 'Week 11-12',
            topics: [
              'Step-by-step chart analysis methodology',
              'Identifying chart strengths and weaknesses',
              'Basic predictions for personality and life themes',
              'Documentation and report writing',
              'Client communication basics',
            ],
          },
        ],
      },
    ],
  } as const;

  const getVisibleLessons = () => {
    const mapped = levelToCourseLevel[selectedLevel];
    const visibleCourseIds = (courses || [])
      .filter((c: any) => c.level === mapped)
      .map((c: any) => c.id);
    const lessons: any[] = [];
    visibleCourseIds.forEach((cid: string) => {
      (lessonsByCourse[cid] || []).forEach((l) => lessons.push(l));
    });
    return lessons;
  };

  const matchTopicToLesson = (topic: string) => {
    const lessons = getVisibleLessons();
    const norm = topic.toLowerCase().trim();
    const mapping = topicMappings[norm];
    if (mapping) {
      if (mapping.lesson_id) {
        const exact = lessons.find((l: any) => l.id === mapping.lesson_id);
        if (exact) return exact;
      }
      if (mapping.lesson_slug) {
        const bySlug = lessons.find((l: any) => l.slug === mapping.lesson_slug);
        if (bySlug) return bySlug;
      }
    }
    const words = norm.split(/[^a-z]+/).filter((w) => w.length >= 4);
    return lessons.find((l: any) => {
      const title = (l.title || '').toLowerCase();
      return words.some((w) => title.includes(w));
    });
  };

  useEffect(() => {
    const loadLoggedIn = async () => {
      const { data: enrollData, error: enrollErr } = await supabase
        .from('section_enrollments' as any)
        .select('id, section_id, membership_id, status, created_at')
        .order('created_at', { ascending: false });
      if (enrollErr) { console.warn('Enrollments restricted by RLS:', enrollErr); return; }
      const sectionIds = (enrollData || []).map((e: any) => e.section_id).filter(Boolean);
      if (sectionIds.length) {
        const { data: sectData } = await supabase
          .from('course_sections' as any)
          .select('id, title, code')
          .in('id', sectionIds);
        const map: Record<string, { title?: string; code?: string }> = {};
        (sectData || []).forEach((s: any) => { map[s.id] = { title: s.title, code: s.code }; });
        setSections(map);
        const { data: assignData } = await supabase
          .from('assignments' as any)
          .select('id, section_id, title, description, due_at, max_points')
          .in('section_id', sectionIds)
          .order('due_at', { ascending: true });
        setAssignments(assignData || []);
      }
    };

    const loadPublic = async () => {
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title, level')
        .eq('category', 'astrology')
        .eq('published', true)
        .order('title');
      setCourses(courseData || []);
      const courseIds = (courseData || []).map((c: any) => c.id);
      if (courseIds.length) {
        const { data: lessonData } = await supabase
          .from('lessons')
          .select('id, course_id, title, slug, order_index, published')
          .in('course_id', courseIds)
          .eq('published', true)
          .order('order_index');
        const grouped: Record<string, any[]> = {};
        (lessonData || []).forEach((l: any) => {
          grouped[l.course_id] = grouped[l.course_id] || [];
          grouped[l.course_id].push(l);
        });
        setLessonsByCourse(grouped);
      }
    };

    if (user) {
      loadLoggedIn();
    } else {
      loadPublic();
    }
  }, [user]);

  useEffect(() => {
    const loadMappings = async () => {
      const { data } = await supabase
        .from('topic_to_lesson_mappings')
        .select('topic_text, topic_key, lesson_id, lesson_slug, course_id, certification_level, language')
        .eq('certification_level', selectedLevel)
        .eq('language', (typeof navigator !== 'undefined' && navigator.language?.startsWith('hi')) ? 'hi' : 'en');
      const map: Record<string, any> = {};
      (data || []).forEach((m: any) => {
        const key = (m.topic_key || m.topic_text || '').toLowerCase().trim();
        if (key) map[key] = m;
      });
      setTopicMappings(map);
    };
    loadMappings();
  }, [selectedLevel]);

  const modules = [
    { title: 'Module 1: Foundations', items: ['Graha & Rashi', 'Nakshatra Overview', 'Chart Basics'] },
    { title: 'Module 2: Chart Analysis', items: ['D1 Essentials', 'D9 and Yogas', 'Case Studies'] },
    { title: 'Module 3: Predictive Systems', items: ['Dasha Introductions', 'Transit Timing', 'Remedial Plans'] },
    { title: 'Module 4: Ethics & Practice', items: ['Boundaries & Consent', 'Delivery & Care', 'Client Readiness'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="flex items-center gap-3 mb-6">
          <ListChecks className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — Syllabus
          </h1>
        </div>

        <p className="text-muted-foreground mb-6 max-w-3xl">
          Duration: {levelMeta[selectedLevel].months} Months | {levelMeta[selectedLevel].weeks} Weeks | {levelMeta[selectedLevel].days} Days. This syllabus follows the SOS Astro Academy structure — chart practice, ethical foundations, and modern tooling — synchronized with cohorts, sections, and assignment timelines.
        </p>

        {/* Certification Level Selector */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant={selectedLevel === 'foundation' ? 'default' : 'outline'} onClick={() => setSelectedLevel('foundation')}>Foundation</Button>
          <Button variant={selectedLevel === 'practitioner' ? 'default' : 'outline'} onClick={() => setSelectedLevel('practitioner')}>Practitioner</Button>
          <Button variant={selectedLevel === 'professional' ? 'default' : 'outline'} onClick={() => setSelectedLevel('professional')}>Professional</Button>
          <Button variant={selectedLevel === 'master' ? 'default' : 'outline'} onClick={() => setSelectedLevel('master')}>Master</Button>
        </div>

        {/* Month/Week Syllabus Mapping */}
        {syllabusStructure[selectedLevel as 'foundation'] ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {syllabusStructure[selectedLevel as 'foundation'].map((month) => (
              <Card key={`month-${month.month}`} className="p-6 bg-card/80 backdrop-blur border-border/30">
                <h3 className="text-lg font-semibold mb-2">Month {month.month}: {month.title}</h3>
                {month.weeks.map((w) => (
                  <div key={w.range} className="mb-3">
                    <div className="text-sm font-medium mb-2">{w.range}</div>
                    <div className="flex flex-wrap gap-2">
                      {w.topics.map((t) => {
                        const match = matchTopicToLesson(t);
                        if (match && match.slug) {
                          return (
                            <Link key={t} to={`/academy/astrology/vedic/lesson/${match.slug}`}>
                              <Badge variant="default">{t}</Badge>
                            </Link>
                          );
                        }
                        return <Badge key={t} variant="outline">{t}</Badge>;
                      })}
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Syllabus mapping coming soon</h3>
            <p className="text-sm text-muted-foreground">Select Foundation to view detailed Week/Month mapping. Other levels will be added as content is modeled.</p>
          </Card>
        )}
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicSyllabus;