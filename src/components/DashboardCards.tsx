import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Sparkles
} from "lucide-react";

const DashboardCards = () => {
  const todaysInsights = [
    {
      type: "Love",
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
      insight: "Venus aligns favorably for romantic connections",
      strength: 85
    },
    {
      type: "Career", 
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
      insight: "Mars energizes your professional ambitions",
      strength: 92
    },
    {
      type: "Health",
      icon: Sun,
      color: "text-accent",
      bg: "bg-accent/10", 
      insight: "Lunar cycles support emotional healing",
      strength: 78
    }
  ];

  const upcomingTransits = [
    { planet: "Mercury", event: "Enters Gemini", date: "Dec 15", impact: "Communication boost" },
    { planet: "Venus", event: "Conjunct Jupiter", date: "Dec 18", impact: "Love & abundance" },
    { planet: "Mars", event: "Trine Saturn", date: "Dec 22", impact: "Disciplined action" }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Today's Cosmic Energy */}
      <Card className="md:col-span-2 lg:col-span-1 bg-card/50 border-primary/20 shadow-stellar">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-twinkle" />
              Today's Energy
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Active
            </Badge>
          </div>
          <CardDescription>Your cosmic forecast for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysInsights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${insight.bg}`}>
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <span className="font-medium text-sm">{insight.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">{insight.strength}%</span>
              </div>
              <Progress value={insight.strength} className="h-2" />
              <p className="text-xs text-muted-foreground">{insight.insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Birth Chart Status */}
      <Card className="bg-card/50 border-accent/20 shadow-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent animate-pulse-glow" />
            Birth Chart
          </CardTitle>
          <CardDescription>Your cosmic blueprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-nebula rounded-full flex items-center justify-center">
              <Globe className="w-10 h-10 text-white animate-orbit" />
            </div>
            <div>
              <h3 className="font-semibold">Chart Generated</h3>
              <p className="text-sm text-muted-foreground">Last updated: Today</p>
            </div>
            <Button variant="outline" size="sm" className="w-full border-accent/50 hover:bg-accent/10">
              View Full Chart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Consultation */}
      <Card className="bg-card/50 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary animate-float" />
            AI Oracle
          </CardTitle>
          <CardDescription>24/7 cosmic guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Ask me anything about your cosmic journey
              </p>
              <div className="flex justify-center mb-4">
                <div className="animate-pulse-glow">
                  <Moon className="w-12 h-12 text-secondary" />
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-stellar hover:shadow-glow">
              Start Conversation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Transits */}
      <Card className="md:col-span-2 bg-card/50 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Transits
          </CardTitle>
          <CardDescription>Important planetary movements ahead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTransits.map((transit, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-sm">{transit.planet} {transit.event}</p>
                    <p className="text-xs text-muted-foreground">{transit.impact}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
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
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Cosmic Learning
          </CardTitle>
          <CardDescription>Expand your astrological knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Today's Lesson</p>
              <p className="text-xs text-muted-foreground">
                Understanding Mercury Retrograde: Communication & Technology
              </p>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">65% complete</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card className="bg-card/50 border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Cosmic Community
          </CardTitle>
          <CardDescription>Connect with fellow seekers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1.2M</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">Trending Discussion</p>
              <p className="text-xs text-muted-foreground">
                "How to harness the power of this week's New Moon"
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Join Discussion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;