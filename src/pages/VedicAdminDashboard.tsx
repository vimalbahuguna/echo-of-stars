import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Settings, Users, Building2 } from 'lucide-react';
import AdminAcademyPanels from "@/components/academy/AdminAcademyPanels";

const VedicAdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-7 h-7 text-foreground" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
            {t('header.navigation.vedicAdminDashboard')}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">Administer the Vedic Academy: roles, memberships, terms, compliance.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Roles & Memberships</h3>
            <p className="text-sm text-muted-foreground">Manage user roles within the academy.</p>
            <Users className="w-16 h-16 text-accent mt-2" />
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Academy Settings</h3>
            <p className="text-sm text-muted-foreground">Cohorts and access policies.</p>
            <Settings className="w-16 h-16 text-accent mt-2" />
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur border-border/30">
            <h3 className="text-lg font-semibold mb-2">Organizations</h3>
            <p className="text-sm text-muted-foreground">Manage tenants and org metadata.</p>
            <ShieldCheck className="w-16 h-16 text-accent mt-2" />
          </Card>
        </div>

        {/* New admin CRUD panels */}
        <div className="mt-8">
          <AdminAcademyPanels />
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default VedicAdminDashboard;