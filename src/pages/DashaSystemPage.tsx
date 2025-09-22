import React from 'react';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import DashaSystem from '@/components/charts/DashaSystem';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashaSystemPage = () => {
  // Mock planets data for demonstration - in a real app this would come from user's birth chart
  const mockPlanets = [
    { name: 'Sun', longitude: 120.5, sign: 'Leo', house: 1 },
    { name: 'Moon', longitude: 45.2, sign: 'Taurus', house: 10 },
    { name: 'Mars', longitude: 200.8, sign: 'Scorpio', house: 4 },
    { name: 'Mercury', longitude: 110.3, sign: 'Cancer', house: 12 },
    { name: 'Jupiter', longitude: 75.6, sign: 'Gemini', house: 11 },
    { name: 'Venus', longitude: 95.4, sign: 'Cancer', house: 12 },
    { name: 'Saturn', longitude: 280.1, sign: 'Capricorn', house: 6 },
    { name: 'Rahu', longitude: 15.7, sign: 'Aries', house: 9 },
    { name: 'Ketu', longitude: 195.7, sign: 'Libra', house: 3 }
  ];

  // Mock birth date and moon longitude for demonstration
  const mockBirthDate = new Date('1990-06-15');
  const mockMoonLongitude = 45.2; // Moon's longitude in degrees

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/astrology">
              <Button variant="outline">
                ← Back to Astrology
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                Dashboard
              </Button>
            </Link>
          </div>

          <Card className="w-full max-w-6xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                Dasha System
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Vimshottari Dasha timing system - planetary periods and their influences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashaSystem 
                planets={mockPlanets} 
                birthDate={mockBirthDate}
                moonLongitude={mockMoonLongitude}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default DashaSystemPage;