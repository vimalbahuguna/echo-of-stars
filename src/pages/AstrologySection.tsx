import React from 'react';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, HeartHandshake, Globe, Moon } from 'lucide-react';

const AstrologySection = () => {
  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="w-full max-w-4xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                Astrology Section
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Explore various astrological tools and insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Link to="/birth-chart">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Calendar className="w-12 h-12 text-blue-500 mb-4" />
                  <CardTitle className="text-xl">Charts</CardTitle>
                  <CardDescription>Generate and analyze your birth chart.</CardDescription>
                </Card>
              </Link>
              <Link to="/" onClick={() => setTimeout(() => window.location.hash = "readings", 100)}>
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Moon className="w-12 h-12 text-purple-500 mb-4" />
                  <CardTitle className="text-xl">Readings</CardTitle>
                  <CardDescription>Get personalized astrological readings.</CardDescription>
                </Card>
              </Link>
              <Link to="/compatibility">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <HeartHandshake className="w-12 h-12 text-green-500 mb-4" />
                  <CardTitle className="text-xl">Compatibility</CardTitle>
                  <CardDescription>Analyze relationship compatibility.</CardDescription>
                </Card>
              </Link>
              <Link to="/ephemeris">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Globe className="w-12 h-12 text-orange-500 mb-4" />
                  <CardTitle className="text-xl">Ephemeris</CardTitle>
                  <CardDescription>View planetary positions and movements.</CardDescription>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AstrologySection;
