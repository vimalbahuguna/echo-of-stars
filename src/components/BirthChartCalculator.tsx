import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Star,
  Loader2,
  CheckCircle,
  Brain
} from "lucide-react";

const BirthChartCalculator = () => {
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

  const handleGenerate = async () => {
    if (!formData.name || !formData.date || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your chart.",
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

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={!formData.name || !formData.date || !formData.location || isGenerating}
          className="w-full bg-gradient-cosmic hover:shadow-stellar text-white font-semibold py-6 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Calculating Cosmic Positions...
            </>
          ) : (
            <>
              <Star className="w-5 h-5 mr-2" />
              Generate Birth Chart
            </>
          )}
        </Button>

        {/* Success Message */}
        {generatedChart && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Chart Generated Successfully!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your birth chart has been calculated and saved. Check the SOS Oracle for personalized insights!
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Birth time is optional but recommended for accuracy. Without it, we'll use noon as default.
        </p>
      </CardContent>
    </Card>
  );
};

export default BirthChartCalculator;