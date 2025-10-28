import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import FacultyAcademyPanels from '@/components/academy/FacultyAcademyPanels';
import { Users, Calendar, FileCheck, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VedicFacultyDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-7 h-7 text-secondary" />
            <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Faculty Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage courses, sections, cohort progress, assignments, and announcements.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '45', icon: Users, color: 'text-blue-500' },
            { label: 'Pending Evaluations', value: '8', icon: FileCheck, color: 'text-orange-500' },
            { label: 'Upcoming Sessions', value: '3', icon: Calendar, color: 'text-purple-500' },
            { label: 'Unread Messages', value: '12', icon: MessageSquare, color: 'text-green-500' }
          ].map((stat, i) => (
            <Card key={i} className="p-5 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/academy/vedic/faculty/students">View Students</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/academy/vedic/faculty/grading">Grade Assessments</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/academy/vedic/faculty/schedule">Schedule Session</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/academy/vedic/faculty/messages">View Messages</Link>
            </Button>
          </div>
        </Card>

        {/* Faculty Panels */}
        <FacultyAcademyPanels />
      </div>
    </DashboardLayout>
  );
};

export default VedicFacultyDashboard;