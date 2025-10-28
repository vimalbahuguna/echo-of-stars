import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, 
  Youtube, Linkedin, Send, ExternalLink, ArrowRight
} from 'lucide-react';
import VedicAcademyLogo from './VedicAcademyLogo';

const VedicAcademyFooter: React.FC = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/40 mt-20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <VedicAcademyLogo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering seekers worldwide with authentic spiritual education through 
              traditional wisdom and modern technology.
            </p>
            <div className="space-y-2">
              <a href="mailto:info@sosvedicacademy.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                info@sosvedicacademy.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Spiritual Way, Wisdom City, SC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link to="/academy/astrology/vedic" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                Home
              </Link></li>
              <li><Link to="/academy/astrology/vedic/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                About Us
              </Link></li>
              <li><Link to="/academy/astrology/vedic/curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                Curriculum
              </Link></li>
              <li><Link to="/academy/astrology/vedic/syllabus" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                Syllabus
              </Link></li>
              <li><Link to="/academy/vedic/student" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                Student Portal
              </Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                Contact
              </Link></li>
            </ul>
          </div>

          {/* Disciplines */}
          <div>
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Disciplines
            </h3>
            <ul className="space-y-2">
              <li><Link to="/academy/astrology/vedic" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                🔮 <span className="group-hover:underline">Astrology Studies</span>
              </Link></li>
              <li><Link to="/spiritual-practices" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                🧘 <span className="group-hover:underline">Yoga & Meditation</span>
              </Link></li>
              <li><Link to="/academy/languages" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                📖 <span className="group-hover:underline">Language Learning</span>
              </Link></li>
              <li><Link to="/academy/scriptures" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                📜 <span className="group-hover:underline">Scriptures & Philosophy</span>
              </Link></li>
            </ul>
            <div className="mt-6">
              <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                Visit SOS Astral Astro Platform
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Stay Connected
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive course updates, spiritual insights, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                Subscribe <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
            
            {/* Social Media */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Follow Us</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild className="hover:bg-blue-500 hover:text-white transition-colors">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:bg-sky-500 hover:text-white transition-colors">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:bg-pink-500 hover:text-white transition-colors">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:bg-red-600 hover:text-white transition-colors">
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:bg-blue-700 hover:text-white transition-colors">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="container mx-auto" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SOS Vedic Academy. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            <Link to="/accessibility" className="hover:text-foreground transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VedicAcademyFooter;
