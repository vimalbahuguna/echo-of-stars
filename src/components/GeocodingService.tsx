// Simple geocoding service for birth chart locations
interface GeocodingResult {
  latitude: number;
  longitude: number;
  found: boolean;
}

// Common cities with coordinates for fallback
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Major world cities
  'london': { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'thane': { lat: 19.2183, lng: 72.9781 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'san antonio': { lat: 29.4241, lng: -98.4936 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'melbourne': { lat: -37.8136, lng: 144.9631 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'vancouver': { lat: 49.2827, lng: -123.1207 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'moscow': { lat: 55.7558, lng: 37.6173 },
  'beijing': { lat: 39.9042, lng: 116.4074 },
  'shanghai': { lat: 31.2304, lng: 121.4737 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'cairo': { lat: 30.0444, lng: 31.2357 },
  'johannesburg': { lat: -26.2041, lng: 28.0473 },
  'lagos': { lat: 6.5244, lng: 3.3792 },
  'sao paulo': { lat: -23.5558, lng: -46.6396 },
  'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
  'mexico city': { lat: 19.4326, lng: -99.1332 },
  'buenos aires': { lat: -34.6118, lng: -58.3960 }
};

export const geocodeLocation = async (location: string): Promise<GeocodingResult> => {
  try {
    // Normalize the location string
    const normalizedLocation = location.toLowerCase().trim();
    
    // Check if we have coordinates for this city
    if (CITY_COORDINATES[normalizedLocation]) {
      const coords = CITY_COORDINATES[normalizedLocation];
      return {
        latitude: coords.lat,
        longitude: coords.lng,
        found: true
      };
    }

    // Try to extract city name from longer strings
    for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
      if (normalizedLocation.includes(city)) {
        return {
          latitude: coords.lat,
          longitude: coords.lng,
          found: true
        };
      }
    }

    // If no match found, return a default location (Greenwich, UK)
    console.warn(`No coordinates found for location: ${location}, using default`);
    return {
      latitude: 51.4769,
      longitude: -0.0005,
      found: false
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    // Return default location on error
    return {
      latitude: 51.4769,
      longitude: -0.0005,
      found: false
    };
  }
};

export default geocodeLocation;