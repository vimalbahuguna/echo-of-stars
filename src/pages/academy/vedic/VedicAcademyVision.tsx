import React from 'react';
import { useTranslation } from 'react-i18next';
import VedicAcademyHeader from '@/components/academy/VedicAcademyHeader';
import VedicAcademyFooter from '@/components/academy/VedicAcademyFooter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Target, Lightbulb } from 'lucide-react';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';

const VedicAcademyVision: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <VedicAcademyHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — Vision
          </h1>
        </div>

        <p className="text-muted-foreground mb-6 max-w-3xl">
-          Our vision is an enterprise-grade academy where Vedic Astrology is studied with depth,
-          kindness, and modern rigor. We bridge shastra and software, supporting research, practice,
-          and responsible teaching.
+          To create world-class Vedic astrologers who combine traditional wisdom with modern understanding, ethical practice, and technological proficiency using the SOS Astro platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Guiding Principles</h3>
            <div className="flex flex-wrap gap-2">
-              <Badge variant="outline">Compassion</Badge>
-              <Badge variant="outline">Clarity</Badge>
-              <Badge variant="outline">Rigor</Badge>
-              <Badge variant="outline">Service</Badge>
+              <Badge variant="outline">Traditional + Modern</Badge>
+              <Badge variant="outline">Practical Focus</Badge>
+              <Badge variant="outline">Ethical Foundation</Badge>
+              <Badge variant="outline">Global Community</Badge>
+              <Badge variant="outline">Research Opportunities</Badge>
            </div>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Objectives</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2"><Target className="w-4 h-4" /> Cohorts with measurable outcomes</li>
              <li className="flex items-center gap-2"><Target className="w-4 h-4" /> Faculty-led sections and mentorship</li>
              <li className="flex items-center gap-2"><Target className="w-4 h-4" /> Research & case study publishing</li>
            </ul>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              Integrated AI assistants, chart tooling, and curriculum management to reduce friction and
              increase learning focus.
            </p>
            <Lightbulb className="w-14 h-14 text-accent mt-3" />
          </Card>
        </div>
      </main>
      <VedicAcademyFooter />
    </div>
  );
};

export default VedicAcademyVision;