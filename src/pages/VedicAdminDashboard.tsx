import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import AdminAcademyPanels from '@/components/academy/AdminAcademyPanels';
import { ShieldCheck, Users, GraduationCap, Building, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VedicAdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-7 h-7 text-secondary" />
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage all academy operations, roles, and organizational settings.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '342', icon: Users, color: 'text-blue-500', trend: '+12%' },
            { label: 'Active Enrollments', value: '289', icon: GraduationCap, color: 'text-purple-500', trend: '+8%' },
            { label: 'Revenue (MTD)', value: '$45.2K', icon: DollarSign, color: 'text-green-500', trend: '+15%' },
            { label: 'Avg Satisfaction', value: '4.7/5', icon: BarChart3, color: 'text-orange-500', trend: '+0.2' }
          ].map((stat, i) => (
            <Card key={i} className="p-5 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow group">
            <Users className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">Roles & Memberships</h2>
            <p className="text-sm text-muted-foreground mb-4">Manage user roles, permissions, and access levels.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/academy/vedic/admin/roles">Manage Roles</Link>
            </Button>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow group">
            <GraduationCap className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">Academy Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">Configure courses, levels, and academic policies.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/academy/vedic/admin/settings">View Settings</Link>
            </Button>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow group">
            <Building className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">Organizations</h2>
            <p className="text-sm text-muted-foreground mb-4">Manage affiliated organizations and partners.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/academy/vedic/admin/organizations">View Organizations</Link>
            </Button>
          </Card>
        </div>

        {/* Recent Activities Alert */}
        <Card className="p-5 bg-orange-500/5 border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-500 mb-1">Pending Actions Required</h3>
              <p className="text-sm text-muted-foreground">
                8 assessments awaiting approval • 5 student applications pending review • 2 payment disputes
              </p>
            </div>
          </div>
        </Card>

        {/* Admin Panels */}
        <AdminAcademyPanels />
      </div>
    </DashboardLayout>
  );
};

export default VedicAdminDashboard;