import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Stars, 
  Sparkles, 
  Moon, 
  Sun,
  Zap,
  Brain,
  MessageSquare
} from "lucide-react";
import cosmicHero from "@/assets/cosmic-hero.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${cosmicHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Stars className="w-6 h-6 text-primary/30 animate-twinkle" />
        </div>
        <div className="absolute top-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-8 h-8 text-accent/40 animate-pulse-glow" />
        </div>
        <div className="absolute bottom-20 left-20 animate-orbit">
          <Moon className="w-5 h-5 text-secondary/50" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <Sun className="w-7 h-7 text-primary/30 animate-twinkle" />
        </div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-display-xl md:text-display-2xl font-bold mb-6 leading-tight">
              <span className="text-foreground">
                Unlock 
              </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                {" "}Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
            </h1>
            <p className="text-heading-md md:text-heading-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the world's most advanced AI-powered astrological platform. 
              Combining ancient wisdom with cutting-edge technology.
            </p>
          </div>

          {/* SOS Oracle Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
            <Card 
              className="group relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,69,19,0.6)] cursor-pointer hover:scale-110 p-6 h-48 flex flex-col items-center justify-center text-center animate-pulse-glow"
              onClick={() => navigate("/oracle")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse"></div>
              <div className="relative mb-4 z-10">
                <Brain className="w-16 h-16 text-primary animate-bounce group-hover:animate-spin transition-all duration-500 drop-shadow-glow" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-twinkle" />
                <Stars className="absolute -bottom-1 -left-1 w-6 h-6 text-accent animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 z-10 relative bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SOS Oracle</h3>
              <p className="text-sm text-muted-foreground z-10 relative font-medium">🔮 AI-powered cosmic guidance</p>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-primary/80 animate-pulse z-10">✨ Most Popular ✨</div>
            </Card>
            
            <Card 
              className="group relative overflow-hidden bg-card/50 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-glow-accent cursor-pointer hover:scale-105 p-6 h-48 flex flex-col items-center justify-center text-center"
              onClick={() => navigate("/daily-horoscopes")}
            >
              <div className="relative mb-4">
                <Zap className="w-12 h-12 text-accent animate-pulse group-hover:animate-bounce transition-all duration-300" />
                <Stars className="absolute -top-1 -right-1 w-6 h-6 text-accent/60 animate-twinkle" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">Real-time Predictions</h3>
              <p className="text-sm text-muted-foreground">Live cosmic insights</p>
            </Card>
            
            <Card 
              className="group relative overflow-hidden bg-card/50 border-secondary/20 hover:border-secondary/40 transition-all duration-300 cursor-pointer hover:scale-105 p-6 h-48 flex flex-col items-center justify-center text-center"
              onClick={() => navigate("/contact-us")}
            >
              <div className="relative mb-4">
                <MessageSquare className="w-12 h-12 text-secondary animate-pulse group-hover:animate-bounce transition-all duration-300" />
                <Moon className="absolute -top-1 -right-1 w-6 h-6 text-secondary/60 animate-twinkle" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">Voice Consultations</h3>
              <p className="text-sm text-muted-foreground">Personal astro sessions</p>
            </Card>
            
            <Card 
              className="group relative overflow-hidden bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow cursor-pointer hover:scale-105 p-6 h-48 flex flex-col items-center justify-center text-center"
              onClick={() => navigate("/birth-chart")}
            >
              <div className="relative mb-4">
                <Stars className="w-12 h-12 text-primary animate-pulse group-hover:animate-bounce transition-all duration-300" />
                <Sun className="absolute -top-1 -right-1 w-6 h-6 text-primary/60 animate-twinkle" />
              </div>
              <h3 className="text-heading-sm font-semibold text-foreground mb-2">Start Your Reading</h3>
              <p className="text-sm text-muted-foreground">Personalized birth chart</p>
            </Card>
          </div>

          {/* Enhanced Main CTA Button */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-xl opacity-75 animate-pulse"></div>
              <Button 
                size="lg" 
                className="relative bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white text-xl px-16 py-8 h-auto font-bold hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(139,69,19,0.8)] border-2 border-primary/50 hover:border-primary animate-pulse-glow"
                onClick={() => navigate("/oracle")}
              >
                <div className="flex items-center gap-4">
                  <Brain className="w-8 h-8 animate-bounce" />
                  <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent font-extrabold">
                    🚀 Chat with SOS Oracle NOW! 🚀
                  </span>
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary animate-bounce">
              <Stars className="w-4 h-4" />
              <span className="font-semibold">⚡ Instant AI Predictions • 24/7 Available • Free to Start ⚡</span>
              <Stars className="w-4 h-4" />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-body-md text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>99.9% Accuracy Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Stars className="w-4 h-4 text-accent" />
              <span>1M+ Readings Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-secondary" />
              <span>24/7 AI Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
