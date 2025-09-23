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
  Leaf
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
        variant: "destructive"
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
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/astrology")}>
        <Stars className="w-5 h-5 mr-2" />
        {t("header.navigation.astrology")}
      </Button>
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/daily-horoscopes")}>
        <Sun className="w-5 h-5 mr-2" />
        {t("header.navigation.dailyHoroscopes")}
      </Button>
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => { navigate("/"); setTimeout(() => window.location.hash = "oracle", 100); }}>
        <MessageCircle className="w-5 h-5 mr-2" />
        {t("header.navigation.oracle")}
      </Button>
      <Button variant="ghost" size="default" className="hover:bg-accent/10 hover:text-accent text-base" onClick={() => navigate("/spiritual-practices")}>
        <Leaf className="w-5 h-5 mr-2" />
        {t("header.navigation.spiritualPractices")}
      </Button>

      <Button 
        variant="ghost" 
        size="default" 
        className="hover:bg-accent/10 hover:text-accent text-base"
        onClick={() => navigate("/contact-us")}
      >
        <Mail className="w-5 h-5 mr-2" />
        {t("header.navigation.contact")}
      </Button>
      {isAdmin() && (
        <Button 
          variant="ghost" 
          size="default" 
          className="hover:bg-destructive/10 hover:text-destructive text-base"
          onClick={() => navigate("/admin")}
        >
          <Shield className="w-5 h-5 mr-2" />
          {t("header.navigation.admin")}
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <Stars className="h-7 w-7 text-primary animate-pulse-glow" />
            <div className="absolute top-1 right-1">
              <Sparkles className="h-4 w-4 text-accent animate-twinkle" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-heading-xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              {t("header.appTitle")}
            </h1>
            <p className="text-body-md text-muted-foreground">{t("header.appSubtitle")}</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <NavigationItems />
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};

export default CosmicHeader;