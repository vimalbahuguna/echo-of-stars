import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, Clock, Settings } from 'lucide-react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    birth_date: '',
    birth_time: '',
    timezone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        birth_date: profile.birth_date || '',
        birth_time: profile.birth_time || '',
        timezone: profile.timezone || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      'super_admin': { label: 'Super Admin', variant: 'destructive' as const },
      'tenant_admin': { label: 'Tenant Admin', variant: 'default' as const },
      'organization_admin': { label: 'Org Admin', variant: 'secondary' as const },
      'franchise_admin': { label: 'Franchise Admin', variant: 'secondary' as const },
      'manager': { label: 'Manager', variant: 'outline' as const },
      'customer': { label: 'Customer', variant: 'outline' as const },
      'end_user': { label: 'User', variant: 'outline' as const },
    };
    return roleMap[role as keyof typeof roleMap] || { label: role, variant: 'outline' as const };
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <CosmicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p>Loading profile...</p>
          </div>
        </div>
        <CosmicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <CosmicHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-white">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {profile.email}
                  </CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge variant={getRoleDisplay(profile.role).variant}>
                      {getRoleDisplay(profile.role).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                  <Separator className="bg-white/20" />
                  <div className="text-xs text-gray-400">
                    <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
                    {profile.last_login_at && (
                      <p>Last login: {new Date(profile.last_login_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details Card */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Manage your personal information and preferences
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "secondary" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name" className="text-gray-300">First Name</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name" className="text-gray-300">Last Name</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                        <Input
                          id="timezone"
                          value={formData.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="e.g., America/New_York"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="address" className="text-gray-300">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Birth Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Birth Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="birth_date" className="text-gray-300">Birth Date</Label>
                        <Input
                          id="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => handleInputChange('birth_date', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birth_time" className="text-gray-300">Birth Time</Label>
                        <Input
                          id="birth_time"
                          type="time"
                          value={formData.birth_time}
                          onChange={(e) => handleInputChange('birth_time', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CosmicFooter />
    </div>
  );
};

export default ProfilePage;