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

const HeroSection = () => {
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-cosmic bg-clip-text text-transparent animate-shimmer">
                Unlock Your
              </span>
              <br />
              <span className="bg-gradient-stellar bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the world's most advanced AI-powered astrological platform. 
              Combining ancient wisdom with cutting-edge technology.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Card className="px-4 py-2 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-primary" />
                <span>AI Oracle</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/50 border-accent/20 hover:border-accent/40 transition-all hover:shadow-glow-accent">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span>Real-time Predictions</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/50 border-secondary/20 hover:border-secondary/40 transition-all">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-secondary" />
                <span>Voice Consultations</span>
              </div>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-cosmic hover:shadow-stellar text-lg px-8 py-6 h-auto font-semibold hover:scale-105 transition-transform"
            >
              <Stars className="w-5 h-5 mr-2" />
              Start Your Reading
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6 h-auto font-semibold hover:scale-105 transition-transform"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat with AI Oracle
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
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