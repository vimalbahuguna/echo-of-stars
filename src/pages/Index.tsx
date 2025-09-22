import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CosmicHeader from "@/components/CosmicHeader";
import HeroSection from "@/components/HeroSection";
import BirthChartCalculator from "@/components/BirthChartCalculator";
import SOSOracle from "@/components/SOSOracle";
import DashboardCards from "@/components/DashboardCards";
import CosmicFooter from "@/components/CosmicFooter";
import { Button } from "@/components/ui/button";
import { 
  Star,
  MessageSquare,
  BarChart3,
  Calendar,
  Sparkles
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const validTabs = ['dashboard', 'chart', 'oracle', 'readings'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      
      {/* Hero Section - Only show on dashboard */}
      {activeTab === "dashboard" && <HeroSection />}
      
      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mb-8 bg-card/50 border border-border/20">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chart" 
              className="flex items-center gap-2 data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Chart</span>
            </TabsTrigger>
            <TabsTrigger 
              value="oracle" 
              className="flex items-center gap-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">SOS Oracle</span>
            </TabsTrigger>
            <TabsTrigger 
              value="readings" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Readings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your Cosmic Dashboard
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track your astrological insights, upcoming transits, and personalized predictions all in one place.
              </p>
            </div>
            <DashboardCards setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="chart" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-stellar bg-clip-text text-transparent mb-4">
                Birth Chart Generator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create your personalized birth chart with AI-powered interpretations using both Vedic and Western astrology.
              </p>
            </div>
            <BirthChartCalculator />
          </TabsContent>

          <TabsContent value="oracle" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-nebula bg-clip-text text-transparent mb-4">
                SOS Oracle Consultation
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have real-time conversations with our advanced AI astrologer. Get personalized insights based on your birth chart, current transits, and cosmic influences.
              </p>
            </div>
            <SOSOracle />
          </TabsContent>

          <TabsContent value="readings" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
                Personalized Readings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access your detailed astrological readings, predictions, and cosmic insights tailored to your unique birth chart.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Sample reading cards */}
              {[
                { title: "Weekly Forecast", icon: Calendar, desc: "Your cosmic week ahead", color: "primary" },
                { title: "Love & Relationships", icon: Sparkles, desc: "Venus influences on your heart", color: "accent" },
                { title: "Career Predictions", icon: Star, desc: "Professional growth opportunities", color: "secondary" }
              ].map((reading, index) => (
                <div key={index} className="p-6 rounded-lg bg-card/50 border border-border/20 text-center space-y-4">
                  <reading.icon className={`w-12 h-12 mx-auto text-${reading.color} animate-pulse-glow`} />
                  <h3 className="text-lg font-semibold">{reading.title}</h3>
                  <p className="text-sm text-muted-foreground">{reading.desc}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Reading
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default Index;
