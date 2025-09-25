import CosmicHeader from "@/components/CosmicHeader";
import CosmicFooter from "@/components/CosmicFooter";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, HeartCrack, HeartHandshake } from "lucide-react";

interface BirthChart {
  id: string;
  chart_name: string;
}

const CompatibilityAnalyzer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCharts, setUserCharts] = useState<BirthChart[]>([]);
  const [selectedChart1, setSelectedChart1] = useState<string | null>(null);
  const [selectedChart2, setSelectedChart2] = useState<string | null>(null);
  const [compatibilityReport, setCompatibilityReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserCharts = async () => {
      if (!user) {
        setUserCharts([]);
        return;
      }

      const { data, error } = await supabase
        .from('birth_charts')
        .select('id, chart_name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user charts:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved birth charts.",
          variant: "destructive",
        });
      } else {
        setUserCharts(data || []);
        if (data && data.length > 0) {
          setSelectedChart1(data[0].id); // Auto-select first chart for convenience
          if (data.length > 1) {
            setSelectedChart2(data[1].id); // Auto-select second chart if available
          }
        }
      }
    };

    fetchUserCharts();
  }, [user, toast]);

  const handleAnalyzeCompatibility = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze compatibility.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedChart1 || !selectedChart2) {
      toast({
        title: "Selection Required",
        description: "Please select two charts for analysis.",
        variant: "destructive",
      });
      return;
    }
    if (selectedChart1 === selectedChart2) {
      toast({
        title: "Invalid Selection",
        description: "Please select two different charts for compatibility analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCompatibilityReport(null); // Clear previous report

    try {
      const { data, error } = await supabase.functions.invoke('analyze-compatibility', {
        body: {
          chartId1: selectedChart1,
          chartId2: selectedChart2,
        },
      });

      if (error) {
        console.error('Error calling analyze-compatibility function:', error);
        throw new Error(error.message || 'Failed to get compatibility report from the server.');
      }

      if (!data || !data.compatibilityReport || !data.compatibilityReport.text) {
        console.error('Invalid data structure from compatibility function', data);
        throw new Error('The compatibility function returned an invalid or empty response.');
      }

      setCompatibilityReport(data.compatibilityReport.text);

    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      toast({
        title: "Compatibility Analysis Error",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis.",
        variant: "destructive",
        showCopyButton: true,
        copyMessage: error instanceof Error ? error.message : "An unknown error occurred during analysis."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Card className="w-full max-w-4xl mx-auto bg-card/50 border-accent/20 shadow-cosmic">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle className="text-xl bg-gradient-nebula bg-clip-text text-transparent">
                    Compatibility Analyzer
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Discover the cosmic connection between two charts</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    Sign in to analyze compatibility between birth charts.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => window.location.href = '/auth'}
                    className="bg-gradient-cosmic hover:shadow-glow-primary"
                  >
                    Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="chart1" className="block text-sm font-medium text-muted-foreground mb-1">
                        Chart 1:
                      </label>
                      <Select onValueChange={setSelectedChart1} value={selectedChart1 || ""}>
                        <SelectTrigger id="chart1" className="w-full bg-input/50 border-border/50">
                          <SelectValue placeholder="Select first chart" />
                        </SelectTrigger>
                        <SelectContent>
                          {userCharts.map((chart) => (
                            <SelectItem key={chart.id} value={chart.id}>
                              {chart.chart_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="chart2" className="block text-sm font-medium text-muted-foreground mb-1">
                        Chart 2:
                      </label>
                      <Select onValueChange={setSelectedChart2} value={selectedChart2 || ""}>
                        <SelectTrigger id="chart2" className="w-full bg-input/50 border-border/50">
                          <SelectValue placeholder="Select second chart" />
                        </SelectTrigger>
                        <SelectContent>
                          {userCharts.map((chart) => (
                            <SelectItem key={chart.id} value={chart.id}>
                              {chart.chart_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyzeCompatibility}
                    disabled={isLoading || !selectedChart1 || !selectedChart2 || selectedChart1 === selectedChart2}
                    className="w-full bg-gradient-nebula hover:shadow-glow-accent"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <HeartHandshake className="w-4 h-4 mr-2" />
                        Analyze Compatibility
                      </>
                    )}
                  </Button>

                  {compatibilityReport && (
                    <ScrollArea className="h-[300px] p-4 border border-border/40 rounded-lg bg-muted/30">
                      <h3 className="text-lg font-semibold mb-2 text-accent">Compatibility Report:</h3>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{compatibilityReport}</p>
                    </ScrollArea>
                  )}

                  {userCharts.length < 2 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      You need at least two saved birth charts to perform a compatibility analysis.
                      <br />
                      Please calculate and save more charts in the Birth Chart Calculator section.
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default CompatibilityAnalyzer;