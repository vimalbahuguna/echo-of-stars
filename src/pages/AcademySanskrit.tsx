import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flower } from 'lucide-react';

const AcademySanskrit = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-3 mb-6">
          <Flower className="w-7 h-7 text-accent" />
          <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">{t("header.navigation.academySanskrit")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">Devanagari script, grammar, dhatus, and transliteration tools. With pronunciation coaching via Echo Vani.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course Tracks</CardTitle>
              <CardDescription>Structured curriculum (Beginner → Advanced)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Devanagari Script</CardTitle>
                    <CardDescription>Letters, vowels, diacritics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Grammar Essentials</CardTitle>
                    <CardDescription>Sandhi, Samasa, Dhatu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pronunciation Lab</CardTitle>
                    <CardDescription>Echo Vani tutor</CardDescription>
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
              <CardTitle>Tools</CardTitle>
              <CardDescription>Transliteration, dictionaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" disabled>
                Transliteration (IAST ⇄ Devanagari)
              </Button>
              <Button variant="ghost" className="w-full justify-start" disabled>
                Sanskrit Dictionary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AcademySanskrit;