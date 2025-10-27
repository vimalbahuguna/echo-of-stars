import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Award, BookOpen, CalendarDays } from 'lucide-react';
import StudentAcademyPanels from "@/components/academy/StudentAcademyPanels";

const VedicStudentDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicStudentDashboard')}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">Your courses, progress, assignments, and certificates.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Vedic Fundamentals</Badge>
              <Badge variant="outline">Chart Analysis</Badge>
              <Badge variant="outline">Dasha Systems</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-4">View Catalog</Button>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <p className="text-sm text-muted-foreground">Track lesson completions and daily streaks.</p>
            <LineChart className="w-16 h-16 text-secondary mt-2" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Certificates</h3>
            <p className="text-sm text-muted-foreground">Completed course certificates appear here.</p>
            <Award className="w-16 h-16 text-foreground mt-2" />
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
            <p className="text-sm text-muted-foreground">Next sessions and assignment deadlines.</p>
            <CalendarDays className="w-16 h-16 text-accent mt-2" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Announcements</h3>
            <p className="text-sm text-muted-foreground">Faculty and academy-wide updates.</p>
          </Card>
        </div>

        {/* New student panels hooked to Supabase tables */}
        <div className="mt-8">
          <StudentAcademyPanels />
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicStudentDashboard;