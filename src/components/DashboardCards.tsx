import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  TrendingUp,
  Heart,
  Briefcase,
  Moon,
  Sun,
  Star,
  Zap,
  Calendar,
  Users,
  Globe,
  BookOpen,
  Sparkles,
  MessageSquare,
  Clock,
  Gem,
  Activity
} from "lucide-react";

interface DashboardCardsProps {
  setActiveTab: (tab: string) => void;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ setActiveTab }) => {
  const { t } = useTranslation();
  
  const todaysInsights = [
    {
      type: t("dashboard.insights.love.type"),
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      insight: t("dashboard.insights.love.insight"),
      strength: 85
    },
    {
      type: t("dashboard.insights.career.type"),
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      insight: t("dashboard.insights.career.insight"),
      strength: 72
    },
    {
      type: t("dashboard.insights.health.type"),
      icon: Sun,
      color: "text-accent",
      bg: "bg-accent/10", 
      insight: t("dashboard.insights.health.insight"),
      strength: 78
    }
  ];

  const upcomingTransits = [
    { planet: "Mercury", event: "Enters Gemini", date: "Dec 15", impact: "Communication boost" },
    { planet: "Venus", event: "Conjunct Jupiter", date: "Dec 18", impact: "Love & abundance" },
    { planet: "Mars", event: "Trine Saturn", date: "Dec 22", impact: "Disciplined action" }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Today's Cosmic Energy */}
      <Card className="bg-card/50 border-primary/20 shadow-stellar">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-heading-md">
              <Sparkles className="w-5 h-5 text-primary animate-twinkle" />
              Today's Energy
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-caption">
              Active
            </Badge>
          </div>
          <CardDescription className="text-body-sm">Your cosmic forecast for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysInsights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${insight.bg}`}>
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <span className="font-medium text-body-md">{insight.type}</span>
                </div>
                <span className="text-body-sm text-muted-foreground">{insight.strength}%</span>
              </div>
              <Progress value={insight.strength} className="h-2" />
              <p className="text-caption text-muted-foreground">{insight.insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Birth Chart Status */}
      <Card className="bg-card/50 border-accent/20 shadow-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heading-md">
              <Star className="w-5 h-5 text-primary animate-twinkle" />
              Birth Chart
            </CardTitle>
            <CardDescription className="text-body-sm">Your cosmic blueprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-nebula rounded-full flex items-center justify-center">
              <Globe className="w-10 h-10 text-white animate-orbit" />
            </div>
            <div>
              <h3 className="font-semibold text-body-lg">Chart Generated</h3>
              <p className="text-body-sm text-muted-foreground">Last Full Chart</p>
            </div>
            <Button variant="outline" size="sm" className="w-full border-accent/50 hover:bg-accent/10 text-body-sm" onClick={() => setActiveTab('chart')}>
              View Full Chart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Consultation */}
      <Card className="bg-card/50 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-md">
            <MessageSquare className="w-5 h-5 text-secondary animate-float" />
            Chat With SOS Oracle
          </CardTitle>
          <CardDescription className="text-body-sm">Get anything about your cosmic journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-body-sm text-muted-foreground mb-3">
                Ask me anything about your cosmic journey
              </p>
              <div className="flex justify-center mb-4">
                <div className="animate-pulse-glow">
                  <Moon className="w-12 h-12 text-secondary" />
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-stellar hover:shadow-glow text-body-md" onClick={() => { console.log('Setting active tab to oracle'); setActiveTab('oracle'); }}>
              Chat with SOS Oracle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Transits */}
      <Card className="md:col-span-2 bg-card/50 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-md">
            <Calendar className="w-5 h-5 text-primary" />
            {t("dashboard.cards.upcomingTransits.title")}
          </CardTitle>
          <CardDescription className="text-body-sm">{t("dashboard.cards.upcomingTransits.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTransits.map((transit, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-body-md">{transit.planet} {transit.event}</p>
                    <p className="text-caption text-muted-foreground">{transit.impact}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-caption">
                  {transit.date}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Center */}
      <Card className="bg-card/50 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-md">
            <BookOpen className="w-5 h-5 text-primary" />
            Learning Center
          </CardTitle>
          <CardDescription className="text-body-sm">Expand your astrological knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-body-md font-medium">Today's Lesson</p>
              <p className="text-caption text-muted-foreground">
                Understanding Mercury Retrograde: Communication & Technology
              </p>
              <Progress value={65} className="h-2" />
              <p className="text-caption text-muted-foreground">65% complete</p>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('readings')}>
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Astrology Features */}
      <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary animate-twinkle" />
            {t("dashboard.cards.advancedTools.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.cards.advancedTools.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/divisional-charts">
              <Card className="h-full hover:bg-secondary/10 transition-colors duration-200 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-medium text-body-md mb-1">Divisional Charts</h4>
                  <p className="text-caption text-muted-foreground mb-2">D9, D10 & 16 Vargas</p>
                  <Badge variant="secondary" className="text-caption">Vedic</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dasha-system">
              <Card className="h-full hover:bg-secondary/10 transition-colors duration-200 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-medium text-body-md mb-1">Dasha System</h4>
                  <p className="text-caption text-muted-foreground mb-2">Vimshottari Timing</p>
                  <Badge variant="secondary" className="text-caption">Timing</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transits">
              <Card className="h-full hover:bg-secondary/10 transition-colors duration-200 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-medium text-body-md mb-1">Transit Analysis</h4>
                  <p className="text-caption text-muted-foreground mb-2">Current Influences</p>
                  <Badge variant="secondary" className="text-caption">Live</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/remedial-measures">
              <Card className="h-full hover:bg-secondary/10 transition-colors duration-200 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Gem className="w-8 h-8 text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-medium text-body-md mb-1">Remedial Measures</h4>
                  <p className="text-caption text-muted-foreground mb-2">Gems & Mantras</p>
                  <Badge variant="secondary" className="text-caption">Healing</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/astrology">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Activity className="w-4 h-4 mr-2" />
                View All Astrology Tools
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card className="bg-card/50 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            {t("dashboard.cards.community.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.cards.community.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1.2M</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.cards.community.activeMembers")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">{t("dashboard.cards.community.trendingDiscussion")}</p>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.cards.community.discussionText")}
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              {t("dashboard.cards.community.joinDiscussion")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;