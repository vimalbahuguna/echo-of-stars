import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Flower, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcademyMeditation = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">{t("header.navigation.academyMeditation")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">Guided practices from Vedic, Buddhist, and Yogic traditions. Breathwork, chakras, and mindfulness.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Explore structured learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Breathwork</CardTitle>
                    <CardDescription>Pranayama, Ujjayi, Nadi Shodhana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/spiritual-practices/pranayama">Open Practice</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mindfulness</CardTitle>
                    <CardDescription>Vipassana, Loving-Kindness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/spiritual-practices/meditation">Guided Meditations</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chakra Healing</CardTitle>
                    <CardDescription>Energy centers and balancing</CardDescription>
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
                <Link to="/spiritual-practices/yoga-nidra"><Zap className="w-4 h-4 mr-2" />Yoga Nidra</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/spiritual-practices/asana"><Flower className="w-4 h-4 mr-2" />Asana Practice</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AcademyMeditation;