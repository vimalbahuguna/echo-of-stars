import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  tenant_id: string;
  organization_id?: string;
  role: 'super_admin' | 'tenant_admin' | 'organization_admin' | 'franchise_admin' | 'manager' | 'customer' | 'end_user';
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  address?: string;
  birth_date?: string;
  birth_time?: string;
  birth_city_id?: string;
  timezone?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  isAdmin: () => boolean;
  isTenantAdmin: () => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user logs in
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!profile) return false;
    
    // Super admins have all permissions
    if (profile.role === 'super_admin') return true;
    
    // Basic permission logic - in production this would check the role_permissions table
    const permissions: Record<string, string[]> = {
      'tenant_admin': ['tenants', 'organizations', 'users', 'charts'],
      'organization_admin': ['users', 'charts', 'organizations'],
      'franchise_admin': ['users', 'charts'],
      'manager': ['charts'],
      'customer': ['charts'],
      'end_user': ['charts']
    };
    
    const roleResources = permissions[profile.role] || [];
    return roleResources.includes(resource);
  };

  const isAdmin = (): boolean => {
    return profile?.role === 'super_admin' || 
           profile?.role === 'tenant_admin' || 
           profile?.role === 'organization_admin';
  };

  const isTenantAdmin = (): boolean => {
    return profile?.role === 'super_admin' || profile?.role === 'tenant_admin';
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signOut,
    hasPermission,
    isAdmin,
    isTenantAdmin,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};