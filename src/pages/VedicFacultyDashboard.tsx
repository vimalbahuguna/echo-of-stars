import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Users, ClipboardList, Megaphone, BookOpen } from 'lucide-react';

const VedicFacultyDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicFacultyDashboard')}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">Manage courses, sections, cohort progress, assignments, and announcements.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Course Builder</h3>
            <p className="text-sm text-muted-foreground">Create and edit Vedic courses and lessons.</p>
            <Button variant="outline" size="sm" className="mt-4">Open Builder</Button>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Section Manager</h3>
            <p className="text-sm text-muted-foreground">Offer course sections by term and schedule.</p>
            <LayoutGrid className="w-16 h-16 text-primary mt-2" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Assignments</h3>
            <p className="text-sm text-muted-foreground">Publish assignments and review submissions.</p>
            <ClipboardList className="w-16 h-16 text-foreground mt-2" />
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Announcements</h3>
            <p className="text-sm text-muted-foreground">Communicate updates to your cohorts.</p>
            <Megaphone className="w-16 h-16 text-secondary mt-2" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <p className="text-sm text-muted-foreground">Share reading lists, charts, and case studies.</p>
            <BookOpen className="w-16 h-16 text-accent mt-2" />
          </Card>
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicFacultyDashboard;