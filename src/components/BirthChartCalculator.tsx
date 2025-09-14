import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ChartPreview from "@/components/charts/ChartPreview";
import { 
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Star,
  Loader2,
  CheckCircle,
  Brain,
  UserPlus,
  Eye
} from "lucide-react";

const BirthChartCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    astrologicalSystem: 'western'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<any>(null);
  const [showSample, setShowSample] = useState(false);
  const [sampleChart, setSampleChart] = useState<any>(null);

  const loadSampleChart = async () => {
    try {
      setIsGenerating(true);
      console.log('Loading sample chart...');
      
      // First seed sample data
      const { data: seedResult, error: seedError } = await supabase.functions.invoke('seed-sample-data');
      
      if (seedError) {
        console.error('Error seeding sample data:', seedError);
        throw seedError;
      }
      
      console.log('Sample data seeded:', seedResult);
      
      // Load the sample chart
      const { data: charts } = await supabase
        .from('birth_charts')
        .select(`
          *,
          planetary_positions(*),
          chart_interpretations(*)
        `)
        .eq('is_public', true)
        .eq('metadata->>sample', 'true')
        .limit(1);

      if (charts && charts[0]) {
        const chart = charts[0];
        setSampleChart({
          chartData: chart.chart_data,
          planets: chart.planetary_positions,
          interpretation: chart.chart_interpretations?.[0]?.content
        });
        setShowSample(true);
        toast({
          title: "Sample Chart Loaded",
          description: "Viewing Jane Doe's birth chart as an example.",
        });
      }
    } catch (error) {
      console.error('Error loading sample chart:', error);
      toast({
        title: "Error Loading Sample",
        description: "Failed to load sample chart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      name: 'Jane Doe',
      date: '1990-05-15',
      time: '14:30',
      location: 'New York, NY, USA',
      astrologicalSystem: 'western'
    });
    toast({
      title: "Sample Data Filled",
      description: "Form filled with sample birth information.",
    });
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.date || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your chart.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate your personalized birth chart.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedChart(null);

    try {
      console.log('Generating birth chart with data:', formData);

      // Use default time if not provided
      const birthTime = formData.time || '12:00';

      const { data, error } = await supabase.functions.invoke('calculate-birth-chart', {
        body: {
          name: formData.name,
          date: formData.date,
          time: birthTime,
          location: formData.location,
          astrologicalSystem: formData.astrologicalSystem
        }
      });

      if (error) {
        console.error('Error generating chart:', error);
        if (error.message?.includes('Unauthorized') || error.message?.includes('JWT')) {
          throw new Error('Please sign in to generate your birth chart');
        }
        throw new Error(error.message || 'Failed to generate birth chart');
      }

      console.log('Chart generated successfully:', data);
      setGeneratedChart(data.chart);

      toast({
        title: "Chart Generated Successfully!",
        description: `Your ${formData.astrologicalSystem} birth chart has been calculated and saved.`,
      });

      // Generate AI interpretation
      if (data.chart?.id) {
        try {
          console.log('Generating AI interpretation...');
          const { data: interpretationData, error: interpretationError } = await supabase.functions.invoke('generate-chart-interpretation', {
            body: {
              chartId: data.chart.id,
              interpretationType: 'full'
            }
          });

          if (interpretationError) {
            console.error('Error generating interpretation:', interpretationError);
          } else {
            console.log('Interpretation generated:', interpretationData);
            // Update the generated chart with interpretation
            setGeneratedChart(prev => ({
              ...prev,
              interpretation: interpretationData.interpretation?.content
            }));
            toast({
              title: "AI Interpretation Ready!",
              description: "Your personalized astrological analysis has been generated.",
            });
          }
        } catch (interpretationError) {
          console.error('Failed to generate interpretation:', interpretationError);
        }
      }

    } catch (error) {
      console.error('Error generating birth chart:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate birth chart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth Status and Sample Options */}
      {!user && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Sign in for personalized charts</p>
                  <p className="text-sm text-muted-foreground">Get AI-powered interpretations and save your charts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadSampleChart}
                  disabled={isGenerating}
                  className="border-secondary/50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Eye className="w-4 h-4 mr-1" />
                  )}
                  View Sample Chart
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Sample Chart */}
      {showSample && sampleChart && (
        <div className="space-y-4">
          <ChartPreview chartData={sampleChart} isDemo={true} />
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowSample(false)}
              className="mr-2"
            >
              Hide Sample
            </Button>
            <Button 
              variant="default"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In to Generate Your Chart
            </Button>
          </div>
        </div>
      )}

      {!showSample && (
        <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Star className="h-12 w-12 text-primary animate-pulse-glow" />
            <Sparkles className="absolute inset-0 h-12 w-12 text-accent animate-twinkle" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
          Birth Chart Calculator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your birth details to generate your personalized cosmic blueprint
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Birth Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Birth Time
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="bg-input/50 border-border/50 focus:border-accent/50 focus:ring-accent/20"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            Birth Location
          </Label>
          <Input
            id="location"
            placeholder="City, Country (e.g., New York, USA)"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="bg-input/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20"
          />
        </div>

        {/* Astrological System */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Astrological System
          </Label>
          <Select
            value={formData.astrologicalSystem}
            onValueChange={(value) => setFormData(prev => ({ ...prev, astrologicalSystem: value }))}
          >
            <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="western">Western Astrology</SelectItem>
              <SelectItem value="vedic">Vedic (Hindu) Astrology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 py-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Analysis
          </Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Zap className="w-3 h-3 mr-1" />
            Instant Results
          </Badge>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
            <Star className="w-3 h-3 mr-1" />
            Vedic & Western
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!user && (
            <Button 
              variant="outline"
              onClick={fillSampleData}
              className="flex-1 border-accent/50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Use Sample Data
            </Button>
          )}
          
          <Button 
            onClick={user ? handleGenerate : () => window.location.href = '/auth'}
            disabled={(!user && !formData.name) || (user && (!formData.name || !formData.date || !formData.location)) || isGenerating}
            className={`${user ? 'w-full' : 'flex-1'} bg-gradient-cosmic hover:shadow-stellar text-white font-semibold py-6 text-lg hover:scale-105 transition-transform disabled:opacity-50`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating Cosmic Positions...
              </>
            ) : user ? (
              <>
                <Star className="w-5 h-5 mr-2" />
                Generate Birth Chart
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Sign In to Generate
              </>
            )}
          </Button>
        </div>

        {/* Generated Chart Display */}
        {generatedChart && (
          <ChartPreview chartData={generatedChart} />
        )}

        {/* Success Message */}
        {generatedChart && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Chart Generated Successfully!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your personalized birth chart with AI interpretation is ready!
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center">
          Birth time is optional but recommended for accuracy. Without it, we'll use noon as default.
        </p>
      </CardContent>
    </Card>
      )}
    </div>
  );
};

export default BirthChartCalculator;