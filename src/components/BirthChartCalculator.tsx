import CosmicHeader from "@/components/CosmicHeader";
import CosmicFooter from "@/components/CosmicFooter";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  Save,
  Search,
  Users
} from "lucide-react";

const BirthChartCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    relationship: 'Self',
    astrologicalSystem: 'western'
  });
  const [savedCharts, setSavedCharts] = useState<any[]>([]);
  const [editingChartId, setEditingChartId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [sampleChart, setSampleChart] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSavedCharts = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('user_birth_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) {
        setSavedCharts(data);
      }
      if (error) {
        console.error("Error fetching saved charts:", error);
      }
    }
  };

  useEffect(() => {
    fetchSavedCharts();
  }, [user]);

  const filteredCharts = savedCharts.filter(chart =>
    chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chart.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chart.location && chart.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (chart.relationship && chart.relationship.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loadChartForEdit = (chart: any) => {
    setEditingChartId(chart.id);
    setFormData({
      name: chart.name,
      date: chart.date,
      time: chart.time,
      location: chart.location,
      relationship: chart.relationship || 'Self',
      astrologicalSystem: formData.astrologicalSystem, // Keep current selection
    });
    toast({
      title: "Chart Loaded",
      description: `Chart "${chart.name}" has been loaded for editing.`,
    });
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

    setIsGenerating(true);
    try {
      const birthTime = formData.time || '12:00';
      
      // Check for duplicates before saving/updating
      const existingQuery = supabase
        .from('user_birth_data')
        .select('id')
        .eq('user_id', user?.id || '')
        .ilike('name', formData.name.toLowerCase())
        .eq('date', formData.date)
        .eq('time', birthTime)
        .ilike('location', formData.location.toLowerCase());

      if (editingChartId) {
        existingQuery.neq('id', editingChartId);
      }

      const { data: duplicates } = await existingQuery;

      if (duplicates && duplicates.length > 0) {
        toast({
          title: "Duplicate Entry",
          description: "A birth record with identical details already exists.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      let error;
      if (editingChartId) {
        // Update existing chart
        const chartData = {
            name: formData.name,
            date: formData.date,
            time: birthTime,
            location: formData.location,
            relationship: formData.relationship,
        };
        const { error: updateError } = await supabase
          .from('user_birth_data')
          .update(chartData)
          .eq('id', editingChartId)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Create new chart
        const chartData = {
            user_id: user.id,
            name: formData.name,
            date: formData.date,
            time: birthTime,
            location: formData.location,
            relationship: formData.relationship,
        };
        const { error: insertError } = await supabase
          .from('user_birth_data')
          .insert(chartData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving birth data:', error);
        throw new Error(error.message);
      }

      await fetchSavedCharts(); // Refresh the list
      setEditingChartId(null); // Reset editing state
      setFormData({ name: '', date: '', time: '', location: '', relationship: 'Self', astrologicalSystem: 'western' }); // Clear form

      toast({ title: "Birth Data Saved!", description: `Chart "${formData.name}" has been successfully saved.` });
    } catch (error) {
      toast({ title: "Save Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (chartId: number) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to delete your birth data.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { error } = await supabase
        .from('user_birth_data')
        .delete()
        .eq('id', chartId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting birth data:', error);
        throw new Error(error.message);
      }

      await fetchSavedCharts(); // Refresh the list
      toast({ title: "Birth Data Deleted!", description: "The selected chart has been deleted." });
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
      const geocodingResult = await geocodeLocation(formData.location);

      // Don't auto-save on generate, let the user explicitly save.

      const { data, error } = await supabase.functions.invoke('calculate-birth-chart', {
        body: {
          ...formData,
          time: birthTime,
          latitude: geocodingResult.latitude,
          longitude: geocodingResult.longitude,
          timezone: 'UTC'
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate birth chart');

      if (!data || !data.chart || !data.chart.chartData || !data.chart.chartData.planets) {
        throw new Error('Invalid chart data received from the server. Please check the input and try again.');
      }

      setGeneratedChart({
        name: formData.name,
        astrologicalSystem: formData.astrologicalSystem,
        planets: data.chart.chartData.planets.map((planet: any) => ({
          ...planet,
          degree: planet.degrees || planet.degree || 0,
          house: planet.house_number || planet.house || 1,
          retrograde: planet.isRetrograde || planet.retrograde || false,
        }))
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
                <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
                  {editingChartId ? 'Edit Birth Chart' : 'Birth Chart Calculator'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {editingChartId ? 'Update the details for your saved chart.' : 'Enter birth details for a personalized cosmic blueprint.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {user && (
                  <Card className="mb-6 bg-secondary/10 border-secondary/30 shadow-inner-glow">
                    <CardHeader className="pb-3 space-y-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-secondary" /> Your Saved Charts
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search charts by name, date, or location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-full bg-background/50"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredCharts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredCharts.map(chart => (
                            <Card key={chart.id} className="bg-background/60 border-border/30">
                              <CardHeader>
                                <CardTitle className="text-base font-semibold">{chart.name}</CardTitle>
                                <CardDescription className="text-xs">{new Date(chart.date).toLocaleDateString()}</CardDescription>
                              </CardHeader>
                              <CardContent className="text-sm space-y-1">
                                <p className="text-muted-foreground flex items-center"><Users className="inline w-4 h-4 mr-2"/>{chart.relationship || 'Not specified'}</p>
                                <p className="text-muted-foreground flex items-center truncate"><MapPin className="inline w-4 h-4 mr-2"/>{chart.location}</p>
                              </CardContent>
                              <CardFooter className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => loadChartForEdit(chart)} disabled={isGenerating} className="w-full">
                                  <Eye className="w-4 h-4 mr-2" /> Select
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(chart.id)} disabled={isGenerating}>
                                  <Zap className="w-4 h-4" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">{savedCharts.length > 0 ? 'No charts found matching your search.' : 'You have no saved charts yet.'}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., My Chart, Partner's Chart"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      >
                        <SelectTrigger id="relationship">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Self">Self</SelectItem>
                          <SelectItem value="Partner">Partner</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Brother">Brother</SelectItem>
                          <SelectItem value="Sister">Sister</SelectItem>
                          <SelectItem value="Son">Son</SelectItem>
                          <SelectItem value="Daughter">Daughter</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Relative">Relative</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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