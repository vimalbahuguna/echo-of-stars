// Admin client for Supabase admin operations
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rxrcvowwztaxobuihygj.supabase.co";
// You need to replace this with your SERVICE ROLE KEY from Supabase Dashboard
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cmN2b3d3enRheG9idWloeWdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MjQyMSwiZXhwIjoyMDczMjM4NDIxfQ.I5dsulOYYm-Ea26nK4IeUq6qg9bpHtyeGYt_t9rzSZQ";

export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
