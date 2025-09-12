import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Stars, 
  MessageCircle,
  Calendar,
  User,
  Menu
} from "lucide-react";

const CosmicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
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
            <p className="text-xs text-muted-foreground">AI-Powered Cosmic Insights</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
            <Calendar className="w-4 h-4 mr-2" />
            Charts
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent">
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Oracle
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-secondary/20 hover:text-secondary-foreground">
            <Moon className="w-4 h-4 mr-2" />
            Readings
          </Button>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:flex animate-shimmer bg-gradient-cosmic">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
          <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CosmicHeader;