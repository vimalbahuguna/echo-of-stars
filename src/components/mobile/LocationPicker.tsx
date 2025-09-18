import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, Crosshair } from 'lucide-react';
import { MobileLocationService } from '@/services/mobileServices';
import { useToast } from '@/hooks/use-toast';
import MobileButton from './MobileButton';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; city: string }) => void;
  initialCity?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialCity = '' }) => {
  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGPSLocation = async () => {
    setLoading(true);
    try {
      // Request permissions first
      const hasPermission = await MobileLocationService.requestPermissions();
      if (!hasPermission) {
        toast({
          title: 'Location Permission Required',
          description: 'Please allow location access to use GPS feature.',
          variant: 'destructive',
        });
        return;
      }

      // Get current position
      const position = await MobileLocationService.getCurrentPosition();
      
      // Reverse geocode to get city name (simplified for demo)
      // In production, you'd use a proper geocoding service
      const cityName = `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`;
      
      setCity(cityName);
      onLocationSelect({
        latitude: position.latitude,
        longitude: position.longitude,
        city: cityName
      });

      toast({
        title: 'Location Found',
        description: 'Successfully obtained your current location.',
      });

    } catch (error) {
      console.error('GPS Error:', error);
      toast({
        title: 'GPS Error',
        description: 'Could not get your current location. Please enter manually.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Birth Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name or use GPS"
            className="flex-1"
          />
          <MobileButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGPSLocation}
            disabled={loading}
            hapticFeedback="light"
            className="px-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          </MobileButton>
        </div>
        <p className="text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 inline mr-1" />
          Tap GPS button to use your current location
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;