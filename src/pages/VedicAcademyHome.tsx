import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Sparkles, Stars, GraduationCap, Users, LayoutDashboard, BookOpen } from 'lucide-react';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';
// import ProtectedRoute from '@/components/ProtectedRoute';

const VedicAcademyHome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              {t('header.navigation.vedicAcademy')}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            To create world-class Vedic astrologers who combine traditional wisdom with modern understanding, ethical practice, and technological proficiency using the SOS Astro platform.
            Professional, enterprise-grade academy for Vedic Astrology learners and educators.
            Explore courses, track progress, manage cohorts, and collaborate with faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">{t('header.navigation.vedicStudentDashboard')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View enrolled courses, lesson progress, assignments, and certificates.
            </p>
            <Button variant="default" onClick={() => navigate('/academy/vedic/student')}>
              <LayoutDashboard className="w-4 h-4 mr-2" /> {t('header.navigation.vedicStudentDashboard')}
            </Button>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">{t('header.navigation.vedicFacultyDashboard')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Manage courses, sections, assignments, cohorts, and announcements.
            </p>
            <Button variant="default" onClick={() => navigate('/academy/vedic/faculty')}>
              <LayoutDashboard className="w-4 h-4 mr-2" /> {t('header.navigation.vedicFacultyDashboard')}
            </Button>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Stars className="w-5 h-5 text-foreground" />
              <h2 className="text-xl font-semibold">{t('header.navigation.vedicAdminDashboard')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Oversee academy settings, RBAC, memberships, terms, and compliance.
            </p>
            <Button variant="default" onClick={() => navigate('/academy/vedic/admin')}>
              <LayoutDashboard className="w-4 h-4 mr-2" /> {t('header.navigation.vedicAdminDashboard')}
            </Button>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Core Tracks</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Fundamentals (Graha, Rashi, Nakshatra)</Badge>
              <Badge variant="outline">Chart Analysis (D1–D9)</Badge>
              <Badge variant="outline">Predictive Methods (Dasha, Transit)</Badge>
              <Badge variant="outline">Remedial (Mantra, Yajna, Lifestyle)</Badge>
              <Badge variant="outline">Research & Case Studies</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Student Services</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Admissions</Badge>
              <Badge variant="secondary">Advising</Badge>
              <Badge variant="secondary">Certificates</Badge>
              <Badge variant="secondary">Alumni</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Faculty Toolkit</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Course Builder</Badge>
              <Badge>Section Manager</Badge>
              <Badge>Assignments</Badge>
              <Badge>Announcements</Badge>
            </div>
          </Card>
        </div>

        {/* Certification Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle>Foundation</CardTitle>
              <CardDescription>3 months · Beginner</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/curriculum?level=foundation">View Curriculum</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/syllabus?level=foundation">View Syllabus</Link></Button>
            </CardContent>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle>Practitioner</CardTitle>
              <CardDescription>6 months · Intermediate</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/curriculum?level=practitioner">View Curriculum</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/syllabus?level=practitioner">View Syllabus</Link></Button>
            </CardContent>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>9 months · Advanced</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/curriculum?level=professional">View Curriculum</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/syllabus?level=professional">View Syllabus</Link></Button>
            </CardContent>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle>Master</CardTitle>
              <CardDescription>12 months · Advanced</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/curriculum?level=master">View Curriculum</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to="/academy/astrology/vedic/syllabus?level=master">View Syllabus</Link></Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicAcademyHome;