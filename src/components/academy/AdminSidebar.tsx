import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Users, BookOpen, GraduationCap,
  Package, FileCheck, FolderOpen, CreditCard,
  Video, BarChart3, Star, Briefcase, Settings,
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
  { title: 'Dashboard', url: '/academy/astrology/vedic/admin-dashboard', icon: Home },
  { title: 'Student Management', url: '/academy/astrology/vedic/admin/students', icon: Users },
  { title: 'Curriculum Management', url: '/academy/astrology/vedic/admin/curriculum', icon: BookOpen },
  { title: 'Faculty Management', url: '/academy/astrology/vedic/admin/faculty', icon: GraduationCap },
  { title: 'Course Packages', url: '/academy/astrology/vedic/admin/packages', icon: Package },
  { title: 'Assessment Management', url: '/academy/astrology/vedic/admin/assessments', icon: FileCheck },
  { title: 'Resources Library', url: '/academy/astrology/vedic/admin/resources', icon: FolderOpen },
  { title: 'Payment Management', url: '/academy/astrology/vedic/admin/payments', icon: CreditCard },
  { title: 'Live Sessions', url: '/academy/astrology/vedic/admin/sessions', icon: Video },
  { title: 'Reports & Analytics', url: '/academy/astrology/vedic/admin/reports', icon: BarChart3 },
  { title: 'Quality Assurance', url: '/academy/astrology/vedic/admin/quality', icon: Star },
  { title: 'Career Center', url: '/academy/astrology/vedic/admin/career', icon: Briefcase },
  { title: 'System Settings', url: '/academy/astrology/vedic/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-accent" />
            {open && <span className="font-semibold">Admin Portal</span>}
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
                            ? 'bg-accent text-accent-foreground font-medium'
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
