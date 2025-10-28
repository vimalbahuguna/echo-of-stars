import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import FacultyAcademyPanels from '@/components/academy/FacultyAcademyPanels';
import { Users } from 'lucide-react';

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

        <div className="mt-8">
          <FacultyAcademyPanels />
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicFacultyDashboard;