import React from 'react';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  HeartHandshake, 
  Globe, 
  Moon,
  Star,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';

const AstrologySection = () => {
  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-8">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Astrology Section
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore various astrological tools and insights
            </p>
          </div>

          {/* Main Cards Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/birth-chart">
              <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:bg-secondary/10 transition-colors duration-200 group">
                <Calendar className="w-16 h-16 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl mb-4">Charts</CardTitle>
                <CardDescription className="text-base">
                  Generate and view birth charts
                </CardDescription>
              </Card>
            </Link>

            <Link to="/" onClick={() => setTimeout(() => window.location.hash = "readings", 100)}>
              <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:bg-secondary/10 transition-colors duration-200 group">
                <Moon className="w-16 h-16 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl mb-4">Readings</CardTitle>
                <CardDescription className="text-base">
                  Get personalized astrological readings
                </CardDescription>
              </Card>
            </Link>

            <Link to="/compatibility">
              <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:bg-secondary/10 transition-colors duration-200 group">
                <HeartHandshake className="w-16 h-16 text-green-500 mb-6 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl mb-4">Compatibility</CardTitle>
                <CardDescription className="text-base">
                  Analyze relationship compatibility
                </CardDescription>
              </Card>
            </Link>

            <Link to="/ephemeris">
              <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:bg-secondary/10 transition-colors duration-200 group">
                <Globe className="w-16 h-16 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl mb-4">Ephemeris</CardTitle>
                <CardDescription className="text-base">
                  View planetary positions and movements
                </CardDescription>
              </Card>
            </Link>
          </div>

          {/* Additional Astrological Features */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Advanced Astrological Features
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Dive deeper into the cosmos with our comprehensive suite of advanced astrological tools and insights
              </p>
            </div>

            {/* Advanced Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <Star className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">Transit Tracking</CardTitle>
                    <CardDescription className="text-sm">Monitor planetary movements</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track current planetary transits and their effects on your natal chart with real-time updates.
                </p>
              </Card>

              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">Solar Returns</CardTitle>
                    <CardDescription className="text-sm">Annual birthday charts</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate and analyze your solar return charts to understand the themes of your upcoming year.
                </p>
              </Card>

              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <Brain className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">AI Predictions</CardTitle>
                    <CardDescription className="text-sm">Machine learning insights</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced AI-powered predictions based on complex astrological patterns and historical data.
                </p>
              </Card>

              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">Progressions</CardTitle>
                    <CardDescription className="text-sm">Secondary progressions</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore your evolving personality through secondary progressions and symbolic directions.
                </p>
              </Card>

              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">Market Astrology</CardTitle>
                    <CardDescription className="text-sm">Financial forecasting</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Apply astrological principles to financial markets and investment timing strategies.
                </p>
              </Card>

              <Card className="p-6 hover:bg-secondary/10 transition-colors duration-200 group">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <CardTitle className="text-lg">Electional</CardTitle>
                    <CardDescription className="text-sm">Optimal timing selection</CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Find the most auspicious times for important events, decisions, and new beginnings.
                </p>
              </Card>
            </div>

            {/* Feature Highlights */}
            <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg p-8 border border-border/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  ✨ Premium Features Included
                </h3>
                <p className="text-muted-foreground">
                  Unlock the full potential of cosmic wisdom with our advanced feature set
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Multi-person synastry analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Comprehensive aspect interpretations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">27 Nakshatra analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Real-time planetary calculations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-pink-500" />
                  <span className="text-sm">AI-powered pattern recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Personalized remedial suggestions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AstrologySection;
