import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users, GraduationCap, Video, FileCheck,
  BookOpen, BarChart3, MessageSquare, Settings,
  Home, Calendar
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
  { title: 'Dashboard', url: '/academy/vedic/faculty', icon: Home },
  { title: 'My Students', url: '/academy/vedic/faculty/students', icon: Users },
  { title: 'Mentorship Sessions', url: '/academy/vedic/faculty/mentorship', icon: GraduationCap },
  { title: 'Assessment Grading', url: '/academy/vedic/faculty/grading', icon: FileCheck },
  { title: 'Content Management', url: '/academy/vedic/faculty/content', icon: BookOpen },
  { title: 'Live Sessions Schedule', url: '/academy/vedic/faculty/schedule', icon: Calendar },
  { title: 'Analytics & Reports', url: '/academy/vedic/faculty/analytics', icon: BarChart3 },
  { title: 'Messages', url: '/academy/vedic/faculty/messages', icon: MessageSquare },
  { title: 'Profile', url: '/academy/vedic/faculty/profile', icon: Settings },
];

export function FacultySidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-3">
            <Users className="w-5 h-5 text-secondary" />
            {open && <span className="font-semibold">Faculty Portal</span>}
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
                            ? 'bg-secondary text-secondary-foreground font-medium'
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
