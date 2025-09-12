import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Star
} from "lucide-react";

const BirthChartCalculator = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate chart generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
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
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="bg-input/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20"
          />
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
          disabled={!formData.name || !formData.date || !formData.time || !formData.location || isGenerating}
          className="w-full bg-gradient-cosmic hover:shadow-stellar text-white font-semibold py-6 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2">
                <Sparkles className="w-5 h-5" />
              </div>
              Generating Your Chart...
            </>
          ) : (
            <>
              <Star className="w-5 h-5 mr-2" />
              Generate Birth Chart
            </>
          )}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Your birth time is crucial for accurate chart calculations. If unknown, we'll use noon.
        </p>
      </CardContent>
    </Card>
  );
};

export default BirthChartCalculator;