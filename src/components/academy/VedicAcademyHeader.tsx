import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, X, ChevronDown, BookOpen, GraduationCap, 
  Users, Award, Phone, LogIn, User, ArrowLeft
} from 'lucide-react';
import VedicAcademyLogo from './VedicAcademyLogo';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const VedicAcademyHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const disciplines = [
    { name: 'Astrology Studies', icon: '🔮', link: '/academy/astrology/vedic' },
    { name: 'Yoga & Meditation', icon: '🧘', link: '/spiritual-practices' },
    { name: 'Language Learning', icon: '📖', link: '/academy/languages' },
    { name: 'Scriptures & Philosophy', icon: '📜', link: '/academy/scriptures' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/academy/astrology/vedic" className="flex items-center hover:opacity-80 transition-opacity">
            <VedicAcademyLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Disciplines <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {disciplines.map((disc) => (
                  <DropdownMenuItem key={disc.name} asChild>
                    <Link to={disc.link} className="flex items-center gap-3 cursor-pointer">
                      <span className="text-2xl">{disc.icon}</span>
                      <span>{disc.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/academy/astrology/vedic/curriculum">
              <Button variant="ghost">
                <BookOpen className="w-4 h-4 mr-2" />
                Curriculum
              </Button>
            </Link>

            <Link to="/academy/astrology/vedic/about">
              <Button variant="ghost">
                <Users className="w-4 h-4 mr-2" />
                About
              </Button>
            </Link>

            <Link to="/contact">
              <Button variant="ghost">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Back to SOS Astral */}
            <Button variant="outline" size="sm" asChild className="hidden lg:flex">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                SOS Astral Astro
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/academy/vedic/student">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  <Link to="/academy/astrology/vedic/register">
                    <Award className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <div className="px-2 py-2 text-sm font-semibold text-muted-foreground">Disciplines</div>
              {disciplines.map((disc) => (
                <Link
                  key={disc.name}
                  to={disc.link}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{disc.icon}</span>
                  <span>{disc.name}</span>
                </Link>
              ))}
              <Link to="/academy/astrology/vedic/curriculum" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Curriculum
              </Link>
              <Link to="/academy/astrology/vedic/about" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <div className="border-t border-border/40 my-2" />
              <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Back to SOS Astral Astro
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Tagline Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-b border-border/20">
        <div className="container mx-auto px-4 py-2">
          <p className="text-center text-sm text-muted-foreground">
            🌟 <span className="font-medium">Transform Your Life Through Sacred Knowledge</span> • 
            Professional Certifications • Multiple Disciplines • Lifetime Access
          </p>
        </div>
      </div>
    </header>
  );
};

export default VedicAcademyHeader;
