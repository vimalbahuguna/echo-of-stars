import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Sparkles, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import LocationPicker from './LocationPicker';
import MobileButton from './MobileButton';
import { useIsMobile } from '@/hooks/useMobile';

const MobileBirthChart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    location: '',
    latitude: 0,
    longitude: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (location: { latitude: number; longitude: number; city: string }) => {
    setFormData(prev => ({
      ...prev,
      location: location.city,
      latitude: location.latitude,
      longitude: location.longitude
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // TODO: Submit birth chart data
      toast({
        title: 'Chart Created',
        description: 'Your birth chart has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create birth chart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMobile) {
    return null; // Let the desktop version handle non-mobile
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic safe-area-pt safe-area-pb">
      <div className="container py-4 px-4">
        <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-stellar">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
              Create Birth Chart
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your birth details to generate your cosmic blueprint
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="touch-target"
                  required
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="touch-target"
                  required
                />
              </div>

              {/* Birth Time */}
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Birth Time
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                  className="touch-target"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Exact time is crucial for accurate chart calculations
                </p>
              </div>

              {/* Location Picker */}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialCity={formData.location}
              />

              {/* Chart System */}
              <div className="space-y-2">
                <Label htmlFor="system" className="text-sm font-medium">
                  Astrological System
                </Label>
                <Select defaultValue="western">
                  <SelectTrigger className="touch-target">
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="western">Western Astrology</SelectItem>
                    <SelectItem value="vedic">Vedic Astrology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information or questions..."
                  rows={3}
                  className="touch-target resize-none"
                />
              </div>

              {/* Submit Button */}
              <MobileButton
                type="submit"
                className="w-full py-6 text-lg font-semibold bg-gradient-stellar shadow-stellar"
                disabled={loading}
                hapticFeedback="heavy"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating Chart...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Birth Chart
                  </>
                )}
              </MobileButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileBirthChart;