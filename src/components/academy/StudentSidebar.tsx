import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  GraduationCap, BookOpen, TrendingUp, FileCheck,
  FolderOpen, Video, MessageSquare, Users,
  CreditCard, Award, Briefcase, Settings,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/academy/vedic/student', icon: Home },
  { title: 'My Courses', url: '/academy/vedic/student/courses', icon: BookOpen },
  { title: 'Progress Tracker', url: '/academy/vedic/student/progress', icon: TrendingUp },
  { title: 'Assessments', url: '/academy/vedic/student/assessments', icon: FileCheck },
  { title: 'Resources Library', url: '/academy/vedic/student/resources', icon: FolderOpen },
  { title: 'Live Sessions', url: '/academy/vedic/student/sessions', icon: Video },
  { title: 'Discussion Forum', url: '/academy/vedic/student/forum', icon: MessageSquare },
  { title: 'Mentorship', url: '/academy/vedic/student/mentorship', icon: Users },
  { title: 'Payments', url: '/academy/vedic/student/payments', icon: CreditCard },
  { title: 'Certificates', url: '/academy/vedic/student/certificates', icon: Award },
  { title: 'Career Center', url: '/academy/vedic/student/career', icon: Briefcase },
  { title: 'Profile Settings', url: '/academy/vedic/student/settings', icon: Settings },
];

export function StudentSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            {open && <span className="font-semibold">Student Portal</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted/50'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
