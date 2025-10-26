import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stars, Calendar, Globe, BookOpen } from 'lucide-react';

const AcademyAstrology = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-3 mb-6">
          <Stars className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">{t("header.navigation.academyAstrology")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">Structured curricula for Vedic, Western, and Chinese astrology — with charts, transits, and AI tutor.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Curriculum Tracks</CardTitle>
              <CardDescription>Start where you are — Beginner to Advanced</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vedic Astrology</CardTitle>
                    <CardDescription>Nakshatra, Dasha, Panchang</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/astrology">Open Practice Section</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Western Astrology</CardTitle>
                    <CardDescription>Natal, Transit, Synastry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/transits">Transit Tools</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chinese Astrology</CardTitle>
                    <CardDescription>Ba Zi, Elements, Zodiac</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Tools</CardTitle>
              <CardDescription>Quick links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/birth-chart"><BookOpen className="w-4 h-4 mr-2" />Live Chart Generator</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/compatibility"><Globe className="w-4 h-4 mr-2" />Compatibility Analyzer</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/ephemeris"><Calendar className="w-4 h-4 mr-2" />Ephemeris Viewer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AcademyAstrology;