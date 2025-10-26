import React from 'react';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const AcademyScriptures = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-foreground" />
              <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">{t("header.navigation.academyScriptures")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">Read Upanishads, Vedas, Gita, Yoga Sutras with contextual commentary and Echo Vedanta insights.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Library</CardTitle>
              <CardDescription>Dual-view (Text + Commentary), concept search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bhagavad Gita</CardTitle>
                    <CardDescription>Chapters with commentary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Open
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upanishads</CardTitle>
                    <CardDescription>Mundaka, Katha, Isha, etc.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Open
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Yoga Sutras</CardTitle>
                    <CardDescription>Four Padas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Open
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forums & Discussions</CardTitle>
              <CardDescription>Share insights and ask questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" disabled>
                Enter Discussion Forum
              </Button>
              <Button variant="ghost" className="w-full justify-start" disabled>
                Ask Echo Vedanta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AcademyScriptures;