import CosmicHeader from "@/components/CosmicHeader";
import CosmicFooter from "@/components/CosmicFooter";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { geocodeLocation } from "@/components/GeocodingService";
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
  Eye,
  ChevronDown,
  ChevronUp,
  Save
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
  const [savedData, setSavedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [sampleChart, setSampleChart] = useState<any>(null);

  useEffect(() => {
    const fetchSavedData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_birth_data')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSavedData(data);
        }
      }
    };
    fetchSavedData();
  }, [user]);

  const loadSavedDataForEdit = () => {
    if (savedData) {
      setFormData({
        name: savedData.name,
        date: savedData.date,
        time: savedData.time,
        location: savedData.location,
        astrologicalSystem: formData.astrologicalSystem, // Keep the current selection
      });
      toast({
        title: "Saved Data Loaded",
        description: "Your saved birth information has been loaded into the form for editing.",
      });
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save your birth data.", variant: "destructive" });
      return;
    }
    if (!formData.name || !formData.date || !formData.location) {
      toast({ title: "Missing Information", description: "Please fill in name, date, and location to save.", variant: "destructive" });
      return;
    }

    setIsGenerating(true); // Use isGenerating to disable buttons during save
    try {
      const birthTime = formData.time || '12:00';
      const { error: saveError } = await supabase.from('user_birth_data').upsert({ 
        user_id: user.id,
        name: formData.name,
        date: formData.date,
        time: birthTime,
        location: formData.location,
      }, { onConflict: 'user_id' });

      if (saveError) {
        console.error('Error saving birth data:', saveError);
        throw new Error(saveError.message);
      }

      // Re-fetch saved data to update the display
      const { data, error } = await supabase
        .from('user_birth_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setSavedData(data);
      }
      if (error) console.error('Error re-fetching saved data:', error);

      toast({ title: "Birth Data Saved!", description: "Your birth information has been successfully saved." });
    } catch (error) {
      toast({ title: "Save Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to delete your birth data.", variant: "destructive" });
      return;
    }

    setIsGenerating(true); // Use isGenerating to disable buttons during delete
    try {
      const { error } = await supabase
        .from('user_birth_data')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting birth data:', error);
        throw new Error(error.message);
      }

      setSavedData(null);
      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        astrologicalSystem: 'western'
      });
      setGeneratedChart(null);
      setShowChart(false);

      toast({ title: "Birth Data Deleted!", description: "Your birth information has been successfully deleted." });
    } catch (error) {
      toast({ title: "Delete Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.date || !formData.location || !formData.astrologicalSystem) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to generate your chart.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGeneratedChart(null);
    setShowChart(false);

    try {
      const birthTime = formData.time || '12:00';
      
      // Get coordinates for the location
      const geocodingResult = await geocodeLocation(formData.location);
      
      // Save birth data
      const { error: saveError } = await supabase.from('user_birth_data').upsert({ 
        user_id: user.id,
        name: formData.name,
        date: formData.date,
        time: birthTime,
        location: formData.location,
      }, { onConflict: 'user_id' });

      if (saveError) console.error('Error saving birth data:', saveError);

      const { data, error } = await supabase.functions.invoke('calculate-birth-chart', {
        body: { 
          ...formData, 
          time: birthTime,
          latitude: geocodingResult.latitude,
          longitude: geocodingResult.longitude,
          timezone: 'UTC' // Default timezone - in production this would be calculated from location
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate birth chart');

      if (!data || !data.chart || !data.chart.chartData || !data.chart.chartData.planets) {
        throw new Error('Invalid chart data received from the server. Please check the input and try again.');
      }

      setGeneratedChart({ 
        name: formData.name, 
        astrologicalSystem: formData.astrologicalSystem, 
        planets: data.chart.chartData.planets 
      });
      setShowChart(true);

      toast({ 
        title: "Chart Generated Successfully!",
        description: !geocodingResult.found ? "Used approximate coordinates for location." : "Your birth chart has been calculated."
      });

      if (data.chart?.id) {
        const { data: interpretationData, error: interpretationError } = await supabase.functions.invoke('generate-chart-interpretation', {
          body: { chartId: data.chart.id, interpretationType: 'full' }
        });

        if (!interpretationError) {
          setGeneratedChart(prev => ({ ...prev, interpretation: interpretationData.interpretation?.interpretation_text }));
          toast({ title: "AI Interpretation Ready!" });
        }
      }
    } catch (error) {
      toast({ title: "Generation Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          {/* Other components... */}
          {!showSample && (
            <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">Birth Chart Calculator</CardTitle>
                <CardDescription className="text-muted-foreground">Enter your birth details for a personalized cosmic blueprint</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {user && savedData && (
                  <Card className="mb-6 bg-secondary/10 border-secondary/30 shadow-inner-glow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-secondary" /> Your Saved Birth Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p><strong>Name:</strong> {savedData.name}</p>
                      <p><strong>Date:</strong> {savedData.date}</p>
                      <p><strong>Time:</strong> {savedData.time}</p>
                      <p><strong>Location:</strong> {savedData.location}</p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={loadSavedDataForEdit} disabled={isGenerating}>
                          <Eye className="w-4 h-4 mr-2" /> Edit Saved Data
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isGenerating}>
                          <Zap className="w-4 h-4 mr-2" /> Delete Saved Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date of Birth</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time of Birth (Optional)</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location of Birth (City, State/Country)</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., New York, NY, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="astrologicalSystem">Astrological System</Label>
                    <Select
                      value={formData.astrologicalSystem}
                      onValueChange={(value) => setFormData({ ...formData, astrologicalSystem: value as 'western' | 'vedic' })}
                    >
                      <SelectTrigger id="astrologicalSystem">
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="western">Western</SelectItem>
                        <SelectItem value="vedic">Vedic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={user ? handleGenerate : () => window.location.href = '/auth'} disabled={isGenerating || (user && (!formData.name || !formData.date || !formData.location)) } className="flex-1 bg-gradient-cosmic text-white font-semibold py-6 text-lg">
                    {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : (user ? <><Star className="w-5 h-5 mr-2" />Generate Chart</> : <><UserPlus className="w-5 h-5 mr-2" />Sign In to Generate</>)}
                  </Button>
                  {user && (
                    <Button onClick={handleSave} disabled={isGenerating || (!formData.name || !formData.date || !formData.location)} className="flex-1 bg-gradient-celestial text-white font-semibold py-6 text-lg">
                      {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Details</>}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedChart && (
            <div className="mt-6 space-y-4">
                <Card className="w-full max-w-2xl mx-auto bg-card/50 border-primary/20 shadow-stellar">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">Your Generated Birth Chart</CardTitle>
                                <CardDescription>View, download, or share your chart below.</CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => setShowChart(!showChart)}>
                                {showChart ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </Button>
                        </div>
                    </CardHeader>
                    {showChart && (
                        <CardContent>
                            <ChartPreview chartData={generatedChart} />
                        </CardContent>
                    )}
                </Card>
            </div>
          )}
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default BirthChartCalculator;