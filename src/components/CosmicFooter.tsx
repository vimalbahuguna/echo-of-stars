import { 
  Stars, 
  Moon, 
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const CosmicFooter = () => {
  return (
    <footer className="relative border-t border-border/20 bg-card/30 mt-20">
      {/* Animated stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-10 animate-twinkle">
          <Stars className="w-3 h-3 text-primary/30" />
        </div>
        <div className="absolute top-8 right-20 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Moon className="w-4 h-4 text-accent/30" />
        </div>
        <div className="absolute bottom-4 left-1/3 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Stars className="w-2 h-2 text-secondary/30" />
        </div>
      </div>

      <div className="container relative z-10 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Stars className="h-8 w-8 text-primary animate-pulse-glow" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-stellar bg-clip-text text-transparent">
                  SOS Astral Astro
                </h3>
                <p className="text-xs text-muted-foreground">Cosmic AI Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unlock your cosmic destiny with the world's most advanced AI-powered astrological platform.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>for cosmic seekers</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Birth Chart Analysis</li>
              <li className="hover:text-accent transition-colors cursor-pointer">SOS Oracle Consultations</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Predictive Readings</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Compatibility Reports</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Transit Forecasts</li>
            </ul>
          </div>

          {/* Astrology Types */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Astrology Systems</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Vedic Astrology</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Western Astrology</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Chinese Astrology</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Mayan Astrology</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Hellenistic</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>oracle@sosastral.com</span>
              </div>
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>+1 (555) COSMIC</span>
              </div>
              <div className="flex items-center gap-2 hover:text-secondary transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Cosmic Headquarters</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
                <span>Global Service 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            <p>&copy; 2024 SOS Astral Astro. All cosmic rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-accent transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-secondary transition-colors cursor-pointer">Cosmic Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CosmicFooter;