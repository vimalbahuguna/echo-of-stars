import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import GoldenLogo3D from '@/components/GoldenLogo3D';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const BrandingShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyTagline = () => {
    navigator.clipboard.writeText('Where Ancient Wisdom Meets Cosmic Intelligence');
    setCopied(true);
    toast.success('Tagline copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-stellar bg-clip-text text-transparent">
            SOS Astral - Brand Assets
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our beautiful 3D golden embossed logo and branding elements designed for world-class astrological platform
          </p>
        </div>

        {/* Hero Logo Display */}
        <Card className="mb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-amber-500/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/cosmic-hero.jpg')] opacity-10 bg-cover bg-center"></div>
          <CardContent className="py-16 relative z-10">
            <GoldenLogo3D size="xl" showTagline={true} />
          </CardContent>
        </Card>

        {/* Size Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Large Size</CardTitle>
              <CardDescription>Perfect for hero sections and landing pages</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12 bg-black/20">
              <GoldenLogo3D size="lg" showTagline={false} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Medium Size</CardTitle>
              <CardDescription>Ideal for headers and navigation</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12 bg-black/20">
              <GoldenLogo3D size="md" showTagline={false} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Small Size</CardTitle>
              <CardDescription>Compact version for mobile and icons</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12 bg-black/20">
              <GoldenLogo3D size="sm" showTagline={false} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">With Tagline</CardTitle>
              <CardDescription>Complete branding with tagline</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12 bg-black/20">
              <GoldenLogo3D size="md" showTagline={true} />
            </CardContent>
          </Card>
        </div>

        {/* Tagline Section */}
        <Card className="mb-12 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400 text-2xl">Official Tagline</CardTitle>
            <CardDescription>Our brand promise and mission statement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black/40 p-8 rounded-lg border-2 border-amber-500/30">
              <p className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ✨ Where Ancient Wisdom Meets Cosmic Intelligence ✨
              </p>
              <p className="text-lg text-center text-amber-400/80 mb-6">
                🌟 Astrology • Spiritual Practice • Vedic Academy 🌟
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="border-amber-500/50 hover:bg-amber-500/10"
                  onClick={handleCopyTagline}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Tagline'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Attributes */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400 text-2xl">Brand Attributes</CardTitle>
            <CardDescription>Core values and visual identity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-black/30 rounded-lg border border-amber-500/20">
                <h3 className="text-xl font-bold text-amber-400 mb-2">✨ Premium & Luxurious</h3>
                <p className="text-muted-foreground">Golden 3D effects convey quality and sophistication</p>
              </div>
              <div className="text-center p-6 bg-black/30 rounded-lg border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-2">🌟 Mystical & Spiritual</h3>
                <p className="text-muted-foreground">Cosmic elements reflect ancient wisdom</p>
              </div>
              <div className="text-center p-6 bg-black/30 rounded-lg border border-blue-500/20">
                <h3 className="text-xl font-bold text-blue-400 mb-2">🚀 Modern & Innovative</h3>
                <p className="text-muted-foreground">Animations show cutting-edge technology</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <div className="mt-12 text-center">
          <Card className="bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
              <CardDescription>Best practices for using our brand assets</CardDescription>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-bold text-green-400 mb-2">✅ Do:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use on dark or cosmic backgrounds</li>
                    <li>• Maintain proper spacing around logo</li>
                    <li>• Keep animations smooth and elegant</li>
                    <li>• Use provided size variations</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-bold text-red-400 mb-2">❌ Don't:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Alter the golden color scheme</li>
                    <li>• Stretch or distort the logo</li>
                    <li>• Remove embossed effects</li>
                    <li>• Use on clashing backgrounds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <CosmicFooter />
    </div>
  );
};

export default BrandingShowcase;