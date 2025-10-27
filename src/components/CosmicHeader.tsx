import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Stars, 
  MessageCircle,
  Calendar,
  User,
  Menu,
  Settings,
  LogOut,
  Shield,
  Building,
  Mail,
  Home,
  HeartHandshake,
  Globe,
  Leaf,
  Brain,
  Flower,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const CosmicHeader = () => {
  const { i18n, t } = useTranslation();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast({
        title: t("header.toasts.signedOut"),
        description: t("header.toasts.signOutSuccess.description")
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: t("header.toasts.signOutError.title"),
        description: t("header.toasts.signOutError.description"),
        variant: "destructive",
        showCopyButton: true,
        copyMessage: t("header.toasts.signOutError.description")
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'super_admin': { label: t("roles.super_admin"), variant: 'destructive' },
      'tenant_admin': { label: t("roles.tenant_admin"), variant: 'default' },
      'organization_admin': { label: t("roles.organization_admin"), variant: 'secondary' },
      'franchise_admin': { label: t("roles.franchise_admin"), variant: 'outline' },
      'manager': { label: t("roles.manager"), variant: 'outline' },
      'customer': { label: t("roles.customer"), variant: 'secondary' },
      'end_user': { label: t("roles.end_user"), variant: 'outline' }
    };
    return roleMap[role] || { label: t("roles.end_user"), variant: 'outline' as const };
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const NavigationItems = () => (
    <>
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/")}>
        <Home className="w-5 h-5 mr-2" />
        {t("header.navigation.home")}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="default" 
            className="hover:bg-accent/10 hover:text-accent text-base"
            onClick={() => navigate("/astrology")}
          >
            <Stars className="w-5 h-5 mr-2" />
            {t("header.navigation.astrology")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate("/birth-chart")}>
            <Moon className="w-4 h-4 mr-2" />
            <span>{t("birthChartCalculator.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/compatibility")}>
            <HeartHandshake className="w-4 h-4 mr-2" />
            <span>{t("compatibility.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/ephemeris")}>
            <Calendar className="w-4 h-4 mr-2" />
            <span>{t("ephemeris.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/daily-horoscopes")}>
            <Sun className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.dailyHoroscopes")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/oracle")}>
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.oracle")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/spiritual-practices")}>
        <Leaf className="w-5 h-5 mr-2" />
        {t("header.navigation.spiritualPractices")}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="default" 
            className="hover:bg-accent/10 hover:text-accent text-base"
            onClick={() => navigate("/academy")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t("header.navigation.spiritualAcademy")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate("/academy/astrology")}>
            <Stars className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyAstrology")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/meditation")}>
            <Brain className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyMeditation")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/sanskrit")}>
            <Flower className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academySanskrit")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/scriptures")}>
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyScriptures")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button 
        variant="ghost" 
        size="default" 
        className="hover:bg-accent/10 hover:text-accent text-base"
        onClick={() => navigate("/contact-us")}
      >
        <Mail className="w-5 h-5 mr-2" />
        {t("header.navigation.contact")}
      </Button>
    </>
  );

  // XL and up: full navigation row
  const NavigationFull = () => (
    <div className="hidden xl:flex items-center gap-4">
      <NavigationItems />
    </div>
  );

  // LG only: compact navigation with a More dropdown to reduce overflow
  const NavigationCompact = () => (
    <div className="hidden lg:flex xl:hidden items-center gap-3">
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/")}>
        <Home className="w-5 h-5 mr-2" />
        {t("header.navigation.home")}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="default" 
            className="hover:bg-accent/10 hover:text-accent text-base"
            onClick={() => navigate("/astrology")}
          >
            <Stars className="w-5 h-5 mr-2" />
            {t("header.navigation.astrology")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate("/birth-chart")}>
            <Moon className="w-4 h-4 mr-2" />
            <span>{t("birthChartCalculator.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/compatibility")}>
            <HeartHandshake className="w-4 h-4 mr-2" />
            <span>{t("compatibility.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/ephemeris")}>
            <Calendar className="w-4 h-4 mr-2" />
            <span>{t("ephemeris.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/daily-horoscopes")}>
            <Sun className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.dailyHoroscopes")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/oracle")}>
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.oracle")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="default" 
            className="hover:bg-accent/10 hover:text-accent text-base"
            onClick={() => navigate("/academy")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t("header.navigation.spiritualAcademy")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate("/academy/astrology")}>
            <Stars className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyAstrology")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/meditation")}>
            <Brain className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyMeditation")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/sanskrit")}>
            <Flower className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academySanskrit")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/academy/scriptures")}>
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.academyScriptures")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* More dropdown holds less critical items on lg */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base">
            <Menu className="w-5 h-5 mr-2" />
            <span>More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate("/spiritual-practices")}>
            <Leaf className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.spiritualPractices")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/contact-us")}>
            <Mail className="w-4 h-4 mr-2" />
            <span>{t("header.navigation.contact")}</span>
          </DropdownMenuItem>
          {isAdmin() && (
            <DropdownMenuItem onClick={() => navigate("/admin")}>
              <Shield className="w-4 h-4 mr-2" />
              <span>{t("header.userMenu.adminDashboard")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col gap-2 py-2">
        {/* Top Row: Logo & Title on left, User Section on right */}
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <Stars className="h-7 w-7 text-primary animate-pulse-glow" />
              <div className="absolute top-1 right-1">
                <Sparkles className="h-4 w-4 text-accent animate-twinkle" />
              </div>
            </div>
            <div className="flex flex-col">
              {/* Prominent title: Vedic Astrology Oracle */}
              <h1 className="text-heading-xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                {t("header.appSubtitle")}
              </h1>
              <p className="text-body-md text-muted-foreground">{t("header.appTitle")}</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
          {/* Prominent Admin access (always visible for admins) */}
          {isAdmin() && (
            <Button
              variant="outline"
              size="default"
              className="hidden md:flex border-destructive/50 hover:bg-destructive/10 hover:text-destructive text-base"
              onClick={() => navigate("/admin")}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t("header.userMenu.adminDashboard")}
            </Button>
          )}
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage('hi')}>
                हिन्दी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Badge */}
          {profile && (
            <Badge 
              variant={getRoleDisplay(profile.role).variant} 
              className="hidden sm:flex animate-shimmer"
            >
              <Shield className="w-3 h-3 mr-1" />
              {getRoleDisplay(profile.role).label}
            </Badge>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-cosmic text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("header.userMenu.profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("header.userMenu.settings")}</span>
                </DropdownMenuItem>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>{t("header.userMenu.adminDashboard")}</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("header.userMenu.signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="default" 
              className="border-primary/50 hover:bg-primary/10 text-base"
              onClick={() => window.location.href = '/auth'}
            >
              <User className="w-5 h-5 mr-2" />
              {t("header.userMenu.signIn")}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="default" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="text-xl font-semibold">{t("header.mobileMenu.navigation")}</div>
                <div className="flex flex-col gap-2">
                  <NavigationItems />
                </div>
                
                {user && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <div className="text-xl font-semibold mb-2">{t("header.mobileMenu.account")}</div>
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start text-base" onClick={() => navigate("/profile")}>
                          <User className="mr-2 h-5 w-5" />
                          {t("header.userMenu.profile")}
                        </Button>
                        <Button variant="ghost" className="justify-start text-base" onClick={() => navigate("/settings")}>
                          <Settings className="mr-2 h-5 w-5" />
                          {t("header.userMenu.settings")}
                        </Button>
                        {isAdmin() && (
                          <Button variant="ghost" className="justify-start text-base" onClick={() => navigate("/admin")}>
                            <Shield className="mr-2 h-5 w-5" />
                            {t("header.userMenu.adminDashboard")}
                          </Button>
                        )}
                        <Button variant="ghost" className="justify-start text-destructive text-base" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-5 w-5" />
                          {t("header.userMenu.signOut")}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Close Top Row container */}
        </div>

        {/* Second Row: Desktop Navigation under Logo/Title */}
        <nav className="hidden lg:flex items-center gap-4 border-t border-border/40 pt-2 mt-2">
          <NavigationCompact />
          <NavigationFull />
        </nav>
      </div>
    </header>
  );
};

export default CosmicHeader;