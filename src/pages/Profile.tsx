import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, User, Mail, FileText, Save, X, CheckCircle2, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileSidebar } from "@/components/ProfileSidebar";

interface ProfileData {
  first_name: string;
  last_name: string;
  bio: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    bio: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await fetchProfile(user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          bio: profileData.bio,
        });

      if (error) throw error;

      toast({
        title: "Profile updated successfully! 🎉",
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (profileData.first_name && profileData.last_name) {
      return `${profileData.first_name} ${profileData.last_name}`;
    }
    return user?.email || "User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 glass-effect-strong">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-official rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-official flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-bold">TruthLens</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white font-semibold">
                {user && getInitials(user.email || "U")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - Fixed on desktop, hidden on mobile */}
        <aside className="hidden lg:block w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm min-h-[calc(100vh-4rem)] sticky top-16">
          <ProfileSidebar user={user} displayName={getUserDisplayName()} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-official/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Your Profile
                </h1>
              </div>
              <p className="text-muted-foreground ml-13">
                Manage your personal information and preferences
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: CheckCircle2, label: "Claims Verified", value: "42", color: "text-verified" },
                { icon: TrendingUp, label: "This Month", value: "12", color: "text-official" },
                { icon: Award, label: "Accuracy", value: "98%", color: "text-primary" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl glass-effect border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Profile Form */}
            <div className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
              </div>

              <div className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, first_name: e.target.value })
                      }
                      className="glass-effect border-border/50 focus:border-primary/50 text-foreground h-12 transition-all duration-300"
                      placeholder="Alex"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, last_name: e.target.value })
                      }
                      className="glass-effect border-border/50 focus:border-primary/50 text-foreground h-12 transition-all duration-300"
                      placeholder="Thompson"
                    />
                  </div>
                </div>

                {/* Email Address (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="glass-effect border-border/30 text-muted-foreground cursor-not-allowed h-12 pr-24"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-verified bg-verified/10 px-2 py-1 rounded-md">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="glass-effect border-border/50 focus:border-primary/50 text-foreground min-h-32 resize-none transition-all duration-300"
                    placeholder="Tell us about yourself... Fact-checker and truth seeker. Passionate about leveraging technology to combat misinformation."
                  />
                  <p className="text-xs text-muted-foreground">
                    {profileData.bio.length} / 500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="border-border/50 text-foreground hover:bg-accent/50 h-12 px-6"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 h-12 px-6 transition-all duration-300"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Security Info Card */}
            <div className="glass-effect rounded-2xl border border-border/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Your Data is Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    We use industry-standard encryption to protect your personal information. Your data is never shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}