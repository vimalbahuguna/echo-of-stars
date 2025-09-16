export interface BirthData {
  id?: number; // Optional for new records, present for existing
  user_id?: string; // Supabase user ID, optional as it's added by backend
  name: string;
  date: string;
  time: string;
  location: string;
  relationship: string;
  astrologicalSystem: 'western' | 'vedic';
  created_at?: string; // Optional, managed by Supabase
}