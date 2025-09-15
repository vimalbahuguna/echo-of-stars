import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HoroscopeData {
  sign: string;
  date: string;
  prediction: string;
  mood: string;
  luckyNumber: number;
  luckyColor: string;
}

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const DailyHoroscopes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [horoscopes, setHoroscopes] = useState<Record<string, HoroscopeData | null>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSign, setSelectedSign] = useState<string>(zodiacSigns[0]);

  useEffect(() => {
    const fetchHoroscopes = async () => {
      setLoading(true);
      // In a real application, you would fetch this from an API or a Supabase function
      // For now, we'll use mock data.
      const mockHoroscopeData: Record<string, HoroscopeData> = {};
      zodiacSigns.forEach(sign => {
        mockHoroscopeData[sign] = {
          sign: sign,
          date: new Date().toISOString().split('T')[0],
          prediction: `This is a mock prediction for ${sign}. Expect a day filled with cosmic energy and unexpected opportunities. Focus on your inner self and trust your intuition.`, 
          mood: "Optimistic",
          luckyNumber: Math.floor(Math.random() * 100),
          luckyColor: "Blue",
        };
      });
      setHoroscopes(mockHoroscopeData);
      setLoading(false);
    };

    fetchHoroscopes();
  }, []);

  const currentHoroscope = horoscopes[selectedSign];

  return (
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
            <Sun className="h-8 w-8 text-yellow-400 animate-pulse-light" />
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
                Daily Horoscopes
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Your cosmic forecast for today</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={selectedSign} onValueChange={setSelectedSign} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <TabsList className="w-full justify-start">
                {zodiacSigns.map((sign) => (
                  <TabsTrigger key={sign} value={sign}>{sign}</TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-2 text-muted-foreground">Loading horoscopes...</span>
              </div>
            ) : (
              <TabsContent value={selectedSign} className="mt-4">
                {currentHoroscope ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{currentHoroscope.sign} Horoscope for {currentHoroscope.date}</h3>
                    <p className="text-muted-foreground leading-relaxed">{currentHoroscope.prediction}</p>
                    <div className="flex flex-wrap gap-4">
                      <Badge variant="secondary" className="text-sm">Mood: {currentHoroscope.mood}</Badge>
                      <Badge variant="secondary" className="text-sm">Lucky Number: {currentHoroscope.luckyNumber}</Badge>
                      <Badge variant="secondary" className="text-sm">Lucky Color: {currentHoroscope.luckyColor}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No horoscope available for {selectedSign} today.</p>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyHoroscopes;
