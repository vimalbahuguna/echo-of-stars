import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, HeartHandshake, Globe2 } from 'lucide-react';
import AcademyBreadcrumbs from '@/components/academy/Breadcrumbs';

const VedicAcademyAbout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <AcademyBreadcrumbs />
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAcademy')} — About
          </h1>
        </div>

        <p className="text-muted-foreground mb-6 max-w-3xl">
-          The SOS Astro Academy provides a rigorous, compassionate environment to learn and teach
-          Vedic Astrology. We focus on ethical practice, scholarly depth, and practical application.
-          This section introduces our purpose, community, and long-term commitments.
+          Academy Overview — Certification Levels:
+          Foundation Certificate (3 months), Practitioner Diploma (6 months), Professional Certification (9 months), Master Astrologer Certification (12 months). Total duration: 30 months for complete mastery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Purpose</h3>
            <p className="text-sm text-muted-foreground">
              Empower learners and educators with a coherent curriculum, modern tooling,
              and a supportive cohort experience.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">Scholarship</Badge>
              <Badge variant="outline">Ethics</Badge>
              <Badge variant="outline">Practice</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              The Academy is multi-tenant and global, welcoming diverse backgrounds and
              aligned organizations to collaborate responsibly.
            </p>
            <Globe2 className="w-14 h-14 text-accent mt-3" />
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Commitments</h3>
            <p className="text-sm text-muted-foreground">
              Transparent assessment, cohort health, accessible resources, and mentorship for
              sustained growth.
            </p>
            <HeartHandshake className="w-14 h-14 text-secondary mt-3" />
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="default" onClick={() => window.history.back()}>Back</Button>
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicAcademyAbout;