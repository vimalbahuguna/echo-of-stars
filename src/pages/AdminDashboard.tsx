import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Building, 
  Globe, 
  Settings, 
  Shield, 
  Activity,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: "active" | "suspended" | "inactive" | "trial";
  subscription_tier: "basic" | "professional" | "enterprise" | "custom";
  contact_email?: string;
  contact_phone?: string;
  max_users: number;
  max_organizations: number;
  created_at: string;
}

interface Organization {
  id: string;
  name: string;
  type: "headquarters" | "franchise" | "branch" | "partner";
  tenant_id: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "super_admin" | "tenant_admin" | "organization_admin" | "franchise_admin" | "manager" | "customer" | "end_user";
  tenant_id: string;
  organization_id?: string;
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states for CRUD operations
  const [tenantForm, setTenantForm] = useState<{
    name: string;
    slug: string;
    domain: string;
    status: "active" | "suspended" | "inactive" | "trial";
    subscription_tier: "basic" | "professional" | "enterprise" | "custom";
    contact_email: string;
    contact_phone: string;
    max_users: number;
    max_organizations: number;
  }>({
    name: "",
    slug: "",
    domain: "",
    status: "trial",
    subscription_tier: "basic",
    contact_email: "",
    contact_phone: "",
    max_users: 10,
    max_organizations: 1
  });
  
  const [organizationForm, setOrganizationForm] = useState<{
    name: string;
    type: "headquarters" | "franchise" | "branch" | "partner";
    tenant_id: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    is_active: boolean;
  }>({
    name: "",
    type: "branch",
    tenant_id: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    is_active: true
  });
  
  const [userForm, setUserForm] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: "super_admin" | "tenant_admin" | "organization_admin" | "franchise_admin" | "manager" | "customer" | "end_user";
    tenant_id: string;
    organization_id: string;
    is_active: boolean;
    email_verified: boolean;
    send_reset_password: boolean;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "end_user",
    tenant_id: "",
    organization_id: "",
    is_active: true,
    email_verified: true,
    send_reset_password: false
  });

  // Dialog states
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (profile?.role !== 'super_admin' && profile?.role !== 'tenant_admin') {
      navigate("/");
      return;
    }
    console.log("Current user profile:", profile); // Add this line
    fetchData();
  }, [profile, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let tenantsQuery = supabase.from('tenants').select('*');
      if (profile?.role === 'tenant_admin') {
        tenantsQuery = tenantsQuery.eq('id', profile.tenant_id);
      }
      const { data: tenantsData, error: tenantsError } = await tenantsQuery.order('created_at', { ascending: false });

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }
      console.log('Tenants loaded:', tenantsData);
      setTenants(tenantsData || []);

      let orgsQuery = supabase.from('organizations').select('*');
      if (profile?.role === 'tenant_admin') {
        orgsQuery = orgsQuery.eq('tenant_id', profile.tenant_id);
      }
      const { data: orgsData, error: orgsError } = await orgsQuery.order('created_at', { ascending: false });

      if (orgsError) {
        console.error('Error fetching organizations:', orgsError);
        throw orgsError;
      }
      console.log('Organizations loaded:', orgsData);
      setOrganizations(orgsData || []);

      let profilesQuery = supabaseAdmin.from('profiles').select('*');
      if (profile?.role === 'tenant_admin') {
        profilesQuery = profilesQuery.eq('tenant_id', profile.tenant_id);
      }
      const { data: profilesData, error: profilesError } = await profilesQuery.order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      console.log('Profiles loaded:', profilesData);
      setProfiles(profilesData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Tenant CRUD operations
  const handleCreateTenant = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenantForm])
        .select()
        .single();

      if (error) throw error;

      setTenants([data, ...tenants]);
      setTenantDialogOpen(false);
      resetTenantForm();
      toast({
        title: "Success",
        description: "Tenant created successfully",
      });
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTenant = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .update(tenantForm)
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;

      setTenants(tenants.map(t => t.id === editingItem.id ? data : t));
      setTenantDialogOpen(false);
      resetTenantForm();
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTenant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTenants(tenants.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive"
      });
    }
  };

  const resetTenantForm = () => {
    setTenantForm({
      name: "",
      slug: "",
      domain: "",
      status: "trial",
      subscription_tier: "basic",
      contact_email: "",
      contact_phone: "",
      max_users: 10,
      max_organizations: 1
    });
  };

  const openTenantDialog = (tenant?: Tenant) => {
    if (tenant) {
      setTenantForm({
        name: tenant.name || "",
        slug: tenant.slug || "",
        domain: tenant.domain || "",
        status: tenant.status || "trial",
        subscription_tier: tenant.subscription_tier || "basic",
        contact_email: tenant.contact_email || "",
        contact_phone: tenant.contact_phone || "",
        max_users: tenant.max_users || 10,
        max_organizations: tenant.max_organizations || 1
      });
      setEditingItem(tenant);
    } else {
      resetTenantForm();
      setEditingItem(null);
    }
    setTenantDialogOpen(true);
  };

  // Organization CRUD operations
  const handleCreateOrganization = async () => {
    // Validation
    if (!organizationForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name is required",
        variant: "destructive"
      });
      return;
    }

    if (!organizationForm.tenant_id) {
      toast({
        title: "Validation Error", 
        description: "Please select a tenant",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Creating organization with data:', organizationForm);
      console.log('Current user profile:', profile);
      
      const { data, error } = await supabase
        .from('organizations')
        .insert([{
          name: organizationForm.name.trim(),
          type: organizationForm.type,
          tenant_id: organizationForm.tenant_id,
          contact_email: organizationForm.contact_email || null,
          contact_phone: organizationForm.contact_phone || null,
          address: organizationForm.address || null,
          is_active: organizationForm.is_active
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Organization created successfully:', data);
      setOrganizations([data, ...organizations]);
      setOrganizationDialogOpen(false);
      resetOrganizationForm();
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
        showCopyButton: true,
        copyMessage: error.message || "Failed to create organization"
      });
    }
  };

  const handleUpdateOrganization = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(organizationForm)
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;

      setOrganizations(organizations.map(o => o.id === editingItem.id ? data : o));
      setOrganizationDialogOpen(false);
      resetOrganizationForm();
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOrganizations(organizations.filter(o => o.id !== id));
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive"
      });
    }
  };

  const resetOrganizationForm = () => {
    setOrganizationForm({
      name: "",
      type: "branch",
      tenant_id: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      is_active: true
    });
  };

  const openOrganizationDialog = (organization?: Organization) => {
    if (organization) {
      setOrganizationForm({
        name: organization.name || "",
        type: (organization.type || "branch") as "headquarters" | "franchise" | "branch" | "partner",
        tenant_id: organization.tenant_id || "",
        contact_email: organization.contact_email || "",
        contact_phone: organization.contact_phone || "",
        address: organization.address || "",
        is_active: organization.is_active ?? true
      });
      setEditingItem(organization);
    } else {
      resetOrganizationForm();
      setEditingItem(null);
    }
    setOrganizationDialogOpen(true);
  };

  // User CRUD operations
  const handleCreateUser = async () => {
    // Validation
    if (!userForm.first_name.trim() || !userForm.last_name.trim() || !userForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "First name, last name, and email are required",
        variant: "destructive"
      });
      return;
    }

    if (!userForm.tenant_id) {
      toast({
        title: "Validation Error",
        description: "Please select a tenant",
        variant: "destructive"
      });
      return;
    }

    // Check if user already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', userForm.email)
      .single();

    if (existingProfile) {
      toast({
        title: "Error",
        description: `User with email ${userForm.email} already exists`,
        variant: "destructive"
      });
      return;
    }

    // Generate password if not provided
    const password = userForm.password || generateSecurePassword();

    try {
      console.log('Creating user with data:', { ...userForm, password: '[HIDDEN]' });
      
      // Create auth user with enhanced options using admin client
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userForm.email,
        password: password,
        email_confirm: userForm.email_verified,
        user_metadata: {
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          role: userForm.role
        }
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        throw authError;
      }

      // The trigger `on_auth_user_created` already creates a profile.
      // We just need to update it with the correct details from the form.
      console.log('Updating profile for user:', authUser.user.id);
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          email: userForm.email,
          phone: userForm.phone || null,
          role: userForm.role,
          tenant_id: userForm.tenant_id,
          organization_id: userForm.organization_id || null,
          is_active: userForm.is_active
        })
        .eq('id', authUser.user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        console.error('Auth user ID:', authUser.user.id);
        console.error('User form data:', userForm);
        
        // If profile creation fails, try to clean up the auth user
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
          console.log('Cleaned up orphaned auth user');
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        
        throw error;
      }

      // Send password reset email if requested
      if (userForm.send_reset_password) {
        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: userForm.email,
          options: {
            redirectTo: `${window.location.origin}/auth?mode=reset`
          }
        });
        
        if (resetError) {
          console.warn('Failed to send password reset email:', resetError);
        }
      }

      console.log('User created successfully:', data);
      setProfiles([data, ...profiles]);
      setUserDialogOpen(false);
      resetUserForm();
      
      toast({
        title: "Success",
        description: `User created successfully${userForm.send_reset_password ? ' and password reset email sent' : ''}`,
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  };

  // Generate secure password
  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleUpdateUser = async () => {
    console.log("Updating user with form data:", userForm);
    console.log("Editing item:", editingItem);
    try {
      // Destructure userForm to exclude email_verified, send_reset_password, and password for profiles table update
      const { email_verified, send_reset_password, password, ...profileUpdateForm } = userForm;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdateForm) // Use the filtered object
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;

      // Handle password update separately if password is provided
      if (password) {
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(editingItem.id, {
          password: password
        });
        if (authUpdateError) {
          console.error('Error updating auth user password:', authUpdateError);
          toast({
            title: "Error",
            description: authUpdateError.message || "Failed to update user password",
            variant: "destructive"
          });
          // Do not re-throw, as profile update might have succeeded
        }
      }

      setProfiles(profiles.map(p => p.id === editingItem.id ? data : p));
      setUserDialogOpen(false);
      resetUserForm();
      setEditingItem(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

      if (error) throw error;

      setProfiles(profiles.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const resetUserForm = () => {
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role: "end_user",
      tenant_id: "",
      organization_id: "",
      is_active: true,
      email_verified: true,
      send_reset_password: false
    });
  };

  // Password management functions
  const handleResetUserPassword = async (userId: string, email: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${window.location.origin}/auth?mode=reset`
        }
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: `Password reset email sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserPassword = async (userId: string, newPassword: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "User password has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: isActive ? 'none' : '876000h' // Ban for 100 years if inactive
      });

      if (error) throw error;

      // Update profile status
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update local state
      setProfiles(profiles.map(p => 
        p.id === userId ? { ...p, is_active: isActive } : p
      ));

      toast({
        title: "User Status Updated",
        description: `User has been ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const openUserDialog = (user?: Profile) => {
    if (user) {
      setUserForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Don't show existing password
        role: (user.role || "end_user") as "super_admin" | "tenant_admin" | "organization_admin" | "franchise_admin" | "manager" | "customer" | "end_user",
        tenant_id: user.tenant_id || "",
        organization_id: user.organization_id || "",
        is_active: user.is_active ?? true,
        email_verified: true, // Assume verified for existing users
        send_reset_password: false
      });
      setEditingItem(user);
    } else {
      resetUserForm();
      if (profile?.role === 'tenant_admin') {
        setUserForm(prev => ({ ...prev, tenant_id: profile.tenant_id }));
      }
      setEditingItem(null);
    }
    setUserDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      trial: "secondary",
      suspended: "destructive",
      inactive: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      super_admin: "destructive",
      tenant_admin: "default",
      organization_admin: "secondary"
    };
    return <Badge variant={variants[role] || "outline"}>{role.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Multi-tenant system management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-muted-foreground">{getRoleBadge(profile?.role || '')}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Tenants
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tenants.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organizations.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profiles.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tenants.filter(t => t.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tenant Management</CardTitle>
                    <CardDescription>Manage multi-tenant organizations</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2" onClick={() => openTenantDialog()} disabled={profile?.role !== 'super_admin'}>
                    <Plus className="w-4 h-4" />
                    Add Tenant
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{tenant.name}</h3>
                          {getStatusBadge(tenant.status)}
                          <Badge variant="outline">{tenant.subscription_tier}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">/{tenant.slug}</p>
                        <p className="text-xs text-muted-foreground">
                          {tenant.max_users} max users • {tenant.max_organizations} max orgs
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openTenantDialog(tenant)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{tenant.name}"? This action cannot be undone and will also delete all associated organizations and users.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTenant(tenant.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tenant Form Dialog */}
            <Dialog open={tenantDialogOpen} onOpenChange={setTenantDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Tenant' : 'Create New Tenant'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update tenant information' : 'Add a new tenant to the system'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-name">Name *</Label>
                      <Input
                        id="tenant-name"
                        value={tenantForm.name}
                        onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})}
                        placeholder="Tenant name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-slug">Slug *</Label>
                      <Input
                        id="tenant-slug"
                        value={tenantForm.slug}
                        onChange={(e) => setTenantForm({...tenantForm, slug: e.target.value})}
                        placeholder="tenant-slug"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-domain">Domain</Label>
                      <Input
                        id="tenant-domain"
                        value={tenantForm.domain}
                        onChange={(e) => setTenantForm({...tenantForm, domain: e.target.value})}
                        placeholder="example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-status">Status</Label>
                      <Select value={tenantForm.status} onValueChange={(value: any) => setTenantForm({...tenantForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-tier">Subscription Tier</Label>
                      <Select value={tenantForm.subscription_tier} onValueChange={(value: any) => setTenantForm({...tenantForm, subscription_tier: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-email">Contact Email</Label>
                      <Input
                        id="tenant-email"
                        type="email"
                        value={tenantForm.contact_email}
                        onChange={(e) => setTenantForm({...tenantForm, contact_email: e.target.value})}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-phone">Contact Phone</Label>
                      <Input
                        id="tenant-phone"
                        value={tenantForm.contact_phone}
                        onChange={(e) => setTenantForm({...tenantForm, contact_phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-max-users">Max Users</Label>
                      <Input
                        id="tenant-max-users"
                        type="number"
                        value={tenantForm.max_users}
                        onChange={(e) => setTenantForm({...tenantForm, max_users: parseInt(e.target.value) || 10})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant-max-orgs">Max Organizations</Label>
                    <Input
                      id="tenant-max-orgs"
                      type="number"
                      value={tenantForm.max_organizations}
                      onChange={(e) => setTenantForm({...tenantForm, max_organizations: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTenantDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdateTenant : handleCreateTenant}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Update' : 'Create'} Tenant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Organization Management</CardTitle>
                    <CardDescription>Manage organizations within tenants</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2" onClick={() => openOrganizationDialog()}>
                    <Plus className="w-4 h-4" />
                    Add Organization
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{org.name}</h3>
                          <Badge variant="outline">{org.type}</Badge>
                          <Badge variant={org.is_active ? "default" : "secondary"}>
                            {org.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(org.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openOrganizationDialog(org)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{org.name}"? This action cannot be undone and will also delete all associated users.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteOrganization(org.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Organization Form Dialog */}
            <Dialog open={organizationDialogOpen} onOpenChange={setOrganizationDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Organization' : 'Create New Organization'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update organization information' : 'Add a new organization to the system'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Name *</Label>
                      <Input
                        id="org-name"
                        value={organizationForm.name}
                        onChange={(e) => setOrganizationForm({...organizationForm, name: e.target.value})}
                        placeholder="Organization name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-type">Type</Label>
                      <Select value={organizationForm.type} onValueChange={(value: any) => setOrganizationForm({...organizationForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="headquarters">Headquarters</SelectItem>
                          <SelectItem value="franchise">Franchise</SelectItem>
                          <SelectItem value="branch">Branch</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-tenant">Tenant *</Label>
                      <Select value={organizationForm.tenant_id} onValueChange={(value) => setOrganizationForm({...organizationForm, tenant_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenants.length === 0 ? (
                            <SelectItem value="" disabled>
                              No tenants available - Create a tenant first
                            </SelectItem>
                          ) : (
                            tenants.map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                {tenant.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {tenants.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          You need to create a tenant before creating an organization.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Contact Email</Label>
                      <Input
                        id="org-email"
                        type="email"
                        value={organizationForm.contact_email}
                        onChange={(e) => setOrganizationForm({...organizationForm, contact_email: e.target.value})}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-phone">Contact Phone</Label>
                      <Input
                        id="org-phone"
                        value={organizationForm.contact_phone}
                        onChange={(e) => setOrganizationForm({...organizationForm, contact_phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-active">Status</Label>
                      <Select value={organizationForm.is_active.toString()} onValueChange={(value) => setOrganizationForm({...organizationForm, is_active: value === 'true'})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-address">Address</Label>
                    <Textarea
                      id="org-address"
                      value={organizationForm.address}
                      onChange={(e) => setOrganizationForm({...organizationForm, address: e.target.value})}
                      placeholder="Organization address"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOrganizationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdateOrganization : handleCreateOrganization}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Update' : 'Create'} Organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and permissions</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2" onClick={() => openUserDialog()}>
                    <Plus className="w-4 h-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                          {getRoleBadge(user.role)}
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openUserDialog(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleResetUserPassword(user.id, user.email)}
                          title="Send password reset email"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                          title={user.is_active ? "Deactivate user" : "Activate user"}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{user.first_name} {user.last_name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Form Dialog */}
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit User' : 'Create New User'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update user information' : 'Add a new user to the system'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-firstname">First Name *</Label>
                      <Input
                        id="user-firstname"
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-lastname">Last Name *</Label>
                      <Input
                        id="user-lastname"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email *</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-phone">Phone</Label>
                      <Input
                        id="user-phone"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  {!editingItem && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password</Label>
                        <div className="flex gap-2">
                          <Input
                            id="user-password"
                            type="password"
                            value={userForm.password}
                            onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                            placeholder="Leave empty for auto-generated"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setUserForm({...userForm, password: generateSecurePassword()})}
                          >
                            Generate
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Leave empty to auto-generate a secure password
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Email Verification</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-verified"
                            checked={userForm.email_verified}
                            onChange={(e) => setUserForm({...userForm, email_verified: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="email-verified" className="text-sm">
                            Email verified
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Role *</Label>
                      <Select value={userForm.role} onValueChange={(value: any) => setUserForm({...userForm, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                          <SelectItem value="organization_admin">Organization Admin</SelectItem>
                          <SelectItem value="franchise_admin">Franchise Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="end_user">End User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-tenant">Tenant *</Label>
                      <Select value={userForm.tenant_id} onValueChange={(value) => setUserForm({...userForm, tenant_id: value})} disabled={profile?.role === 'tenant_admin'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-organization">Organization</Label>
                      <Select value={userForm.organization_id} onValueChange={(value) => setUserForm({...userForm, organization_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations
                            .filter(org => org.tenant_id === userForm.tenant_id)
                            .map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-active">Status</Label>
                      <Select value={userForm.is_active.toString()} onValueChange={(value) => setUserForm({...userForm, is_active: value === 'true'})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!editingItem && (
                      <div className="space-y-2">
                        <Label>Password Reset Email</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="send-reset-password"
                            checked={userForm.send_reset_password}
                            onChange={(e) => setUserForm({...userForm, send_reset_password: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="send-reset-password" className="text-sm">
                            Send password reset email
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdateUser : handleCreateUser}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Update' : 'Create'} User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;