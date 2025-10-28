import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import SOSOracle from '@/components/SOSOracle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Stars, Brain, BookOpen, Flower, Trophy } from 'lucide-react';

const SpiritualAcademy = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <CosmicHeader />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent">{t("header.navigation.spiritualAcademy")}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              A unified learning sanctuary for Astrology, Meditation, Sanskrit, and Scriptures — guided by Echo AI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">Back to Platform</Link>
            </Button>
            <Badge variant="outline" className="animate-shimmer">Beta</Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choose Your Path</CardTitle>
            <CardDescription>Select a discipline to begin or continue learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/academy/astrology">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Stars className="w-5 h-5 text-primary" />
                      <CardTitle>Astrology Studies</CardTitle>
                    </div>
                    <CardDescription>Vedic, Western, Chinese — charts, transits, and AI tutor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Go to Module</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/academy/meditation">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-secondary" />
                      <CardTitle>Meditation & Mindfulness</CardTitle>
                    </div>
                    <CardDescription>Guided sessions, breathwork, chakras, progress tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Go to Module</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/academy/sanskrit">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Flower className="w-5 h-5 text-accent" />
                      <CardTitle>Sanskrit Learning</CardTitle>
                    </div>
                    <CardDescription>Devanagari, grammar, pronunciation, and transliteration tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Go to Module</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/academy/scriptures">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-foreground" />
                      <CardTitle>Scriptures & Philosophy</CardTitle>
                    </div>
                    <CardDescription>Readings, commentary, search by concept, and forums</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Go to Module</Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Learning Dashboard</CardTitle>
              <CardDescription>Your current progress across disciplines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Astrology Path</CardTitle>
                    <CardDescription>Beginner → Intermediate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-muted rounded overflow-hidden">
                      <div className="h-2 bg-primary w-2/3" />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">66% complete</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Meditation Streak</CardTitle>
                    <CardDescription>Daily mindful consistency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-secondary" />
                      <span>12 days</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scripture Readings</CardTitle>
                    <CardDescription>Gita, Upanishads, Yoga Sutras</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Last read: Bhagavad Gita 2.47</div>
                  </CardContent>
                </Card>
              </div>
              <Separator className="my-6" />
              <div className="text-sm text-muted-foreground">Certificates and enrollments will appear here.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Echo AI Companion</CardTitle>
              <CardDescription>Ask for guidance, interpretations, or study help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/40 overflow-hidden">
                <SOSOracle />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default SpiritualAcademy;