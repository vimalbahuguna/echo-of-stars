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
  const { i18n } = useTranslation();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "See you in the cosmos!"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out error",
        description: "There was an error signing out.",
        variant: "destructive"
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'super_admin': { label: 'Super Admin', variant: 'destructive' },
      'tenant_admin': { label: 'Tenant Admin', variant: 'default' },
      'organization_admin': { label: 'Org Admin', variant: 'secondary' },
      'franchise_admin': { label: 'Franchise Admin', variant: 'outline' },
      'manager': { label: 'Manager', variant: 'outline' },
      'customer': { label: 'Customer', variant: 'secondary' },
      'end_user': { label: 'User', variant: 'outline' }
    };
    return roleMap[role] || { label: 'User', variant: 'outline' as const };
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const NavigationItems = () => (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-primary/10 hover:text-primary"
        onClick={() => navigate("/")}
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-primary/10 hover:text-primary"
        onClick={() => navigate("/astrology")}
      >
        <Stars className="w-4 h-4 mr-2" />
        Astrology
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary" onClick={() => navigate("/birth-chart")}> 
        <Calendar className="w-4 h-4 mr-2" />
        Charts
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent" onClick={() => navigate("/compatibility")}> 
        <HeartHandshake className="w-4 h-4 mr-2" />
        Compatibility
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent" onClick={() => navigate("/ephemeris")}> {/* New Button */}
        <Globe className="w-4 h-4 mr-2" />
        Ephemeris
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent" onClick={() => { navigate("/"); setTimeout(() => window.location.hash = "oracle", 100); }}>
        <MessageCircle className="w-4 h-4 mr-2" />
        SOS Oracle
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent" onClick={() => navigate("/spiritual-practices")}>
        <Leaf className="w-4 h-4 mr-2" />
        Spiritual Practices
      </Button>
      <Button variant="ghost" size="sm" className="hover:bg-secondary/20 hover:text-secondary-foreground" onClick={() => { navigate("/"); setTimeout(() => window.location.hash = "readings", 100); }}>
        <Moon className="w-4 h-4 mr-2" />
        Readings
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-accent/10 hover:text-accent"
        onClick={() => navigate("/contact-us")}
      >
        <Mail className="w-4 h-4 mr-2" />
        Contact
      </Button>
      {isAdmin() && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-destructive/10 hover:text-destructive"
          onClick={() => navigate("/admin")}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <Stars className="h-8 w-8 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 animate-twinkle">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              SOS Astral Astro
            </h1>
            <p className="text-xs text-muted-foreground">Enterprise Astrological Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
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
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/50 hover:bg-primary/10"
              onClick={() => window.location.href = '/auth'}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="text-lg font-semibold">Navigation</div>
                <div className="flex flex-col gap-2">
                  <NavigationItems />
                </div>
                
                {user && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <div className="text-lg font-semibold mb-2">Account</div>
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start" onClick={() => navigate("/profile")}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate("/settings")}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button variant="ghost" className="justify-start text-destructive" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
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