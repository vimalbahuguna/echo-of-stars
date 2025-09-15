import CosmicHeader from "@/components/CosmicHeader";
import CosmicFooter from "@/components/CosmicFooter";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, CalendarDays } from "lucide-react";

interface EphemerisEntry {
  date: string;
  planets: Array<{
    name: string;
    longitude: number;
    sign: string;
    degrees: number;
    isRetrograde: boolean;
  }>;
  aspects: Array<{
    from: string;
    to: string;
    aspect: string;
    orb: number;
  }>;
}

const EphemerisViewer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("34.0522"); // Default to Los Angeles
  const [longitude, setLongitude] = useState<string>("-118.2437"); // Default to Los Angeles
  const [timezone, setTimezone] = useState<string>("America/Los_Angeles"); // Default to Los Angeles
  const [ephemerisData, setEphemerisData] = useState<EphemerisEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set default dates to current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
  }, []);

  const handleGetEphemeris = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view the ephemeris.",
        variant: "destructive",
      });
      return;
    }
    if (!startDate || !endDate || !latitude || !longitude || !timezone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (dates, latitude, longitude, timezone).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setEphemerisData(null); // Clear previous data

    try {
      const { data, error } = await supabase.functions.invoke('get-ephemeris-data', {
        body: {
          startDate,
          endDate,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone,
        },
      });

      if (error) {
        console.error('Error calling get-ephemeris-data function:', error);
        throw new Error(error.message || 'Failed to get ephemeris data from the server.');
      }

      if (!data || !data.ephemeris) {
        console.error('Invalid data structure from ephemeris function', data);
        throw new Error('The ephemeris function returned an invalid or empty response.');
      }

      setEphemerisData(data.ephemeris);

    } catch (error) {
      console.error('Error getting ephemeris:', error);
      toast({
        title: "Ephemeris Error",
        description: error instanceof Error ? error.message : "An unknown error occurred while fetching ephemeris.",
        variant: "destructive",
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
                <CalendarDays className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle className="text-xl bg-gradient-nebula bg-clip-text text-transparent">
                    Astrological Ephemeris
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">View daily planetary positions and aspects</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    Sign in to view the astrological ephemeris.
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
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g., 34.0522"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g., -118.2437"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="timezone">Timezone (e.g., America/Los_Angeles)</Label>
                      <Input
                        id="timezone"
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="e.g., America/Los_Angeles"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGetEphemeris}
                    disabled={isLoading || !startDate || !endDate || !latitude || !longitude || !timezone}
                    className="w-full bg-gradient-nebula hover:shadow-glow-accent"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Ephemeris...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Get Ephemeris
                      </>
                    )}
                  </Button>

                  {ephemerisData && ephemerisData.length > 0 && (
                    <ScrollArea className="h-[400px] p-4 border border-border/40 rounded-lg bg-muted/30">
                      <h3 className="text-lg font-semibold mb-2 text-accent">Ephemeris Data:</h3>
                      {ephemerisData.map((entry, index) => (
                        <div key={index} className="mb-4 pb-2 border-b border-border/20 last:border-b-0">
                          <p className="font-medium text-primary-foreground">{entry.date}</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {entry.planets.map((p, pIdx) => (
                              <li key={pIdx}>
                                {p.name}: {p.sign} {p.degrees.toFixed(2)}° {p.isRetrograde ? "(R)" : ""} (Long: {p.longitude.toFixed(2)}°)
                              </li>
                            ))}
                          </ul>
                          {entry.aspects.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-primary-foreground">Aspects:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {entry.aspects.map((a, aIdx) => (
                                  <li key={aIdx}>
                                    {a.from} {a.aspect} {a.to} (Orb: {a.orb.toFixed(2)}°)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
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

export default EphemerisViewer;