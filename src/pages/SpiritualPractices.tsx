import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Leaf, Heart, Sun, Moon, MessageSquare } from 'lucide-react';

const SpiritualPractices = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                {t("spiritualPracticesPage.backToDashboard")}
              </Button>
            </Link>
          </div>

          <Card className="w-full max-w-4xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                {t("spiritualPracticesPage.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {t("spiritualPracticesPage.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/spiritual-practices/pranayama">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Leaf className="w-12 h-12 text-green-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.pranayama.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.pranayama.description")}</CardDescription>
                </Card>
              </Link>
              <Link to="/spiritual-practices/meditation">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Brain className="w-12 h-12 text-blue-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.meditation.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.meditation.description")}</CardDescription>
                </Card>
              </Link>
              <Link to="/spiritual-practices/yoga-nidra">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Moon className="w-12 h-12 text-purple-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.yogaNidra.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.yogaNidra.description")}</CardDescription>
                </Card>
              </Link>
              <Link to="/spiritual-practices/asana">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Heart className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.asana.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.asana.description")}</CardDescription>
                </Card>
              </Link>
              <Link to="/spiritual-practices/mantra-japa">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <MessageSquare className="w-12 h-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.mantraJapa.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.mantraJapa.description")}</CardDescription>
                </Card>
              </Link>
              <Link to="/spiritual-practices/upanishad-teachings">
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:bg-secondary/10 transition-colors duration-200">
                  <Sun className="w-12 h-12 text-orange-500 mb-4" />
                  <CardTitle className="text-xl">{t("spiritualPracticesPage.practices.upanishadTeachings.title")}</CardTitle>
                  <CardDescription>{t("spiritualPracticesPage.practices.upanishadTeachings.description")}</CardDescription>
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

export default SpiritualPractices;
