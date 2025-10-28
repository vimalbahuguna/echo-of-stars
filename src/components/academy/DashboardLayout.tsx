import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { StudentSidebar } from './StudentSidebar';
import { FacultySidebar } from './FacultySidebar';
import { AdminSidebar } from './AdminSidebar';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Menu } from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: 'student' | 'faculty' | 'admin';
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const getSidebar = () => {
    switch (role) {
      case 'student':
        return <StudentSidebar />;
      case 'faculty':
        return <FacultySidebar />;
      case 'admin':
        return <AdminSidebar />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <CosmicHeader />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-[calc(100vh-4rem)]">
          {getSidebar()}
          
          <div className="flex-1 flex flex-col">
            {/* Mobile trigger */}
            <div className="lg:hidden border-b bg-card/50 backdrop-blur-sm">
              <SidebarTrigger className="m-2">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
            </div>
            
            {/* Main content */}
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
      
      <CosmicFooter />
    </div>
  );
}
