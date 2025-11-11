import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  PlusCircle, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  Shield,
  Pencil
} from "lucide-react";
import { Link } from "react-router-dom";

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
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
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

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/");
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
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-official flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">TruthLens</span>
          </Link>

          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white font-semibold">
              {user && getInitials(user.email || "U")}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 flex flex-col">
          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white font-semibold text-2xl">
                  {user && getInitials(user.email || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-official flex items-center justify-center border-2 border-background cursor-pointer">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {getUserDisplayName()}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            <Link 
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>New Claim</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
              <Bookmark className="w-5 h-5" />
              <span>Saved Results</span>
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-foreground font-medium transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-accent hover:text-foreground transition-colors mt-4 border-t border-border/50 pt-6"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">User Profile</h1>

            <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-8">
              <div className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, first_name: e.target.value })
                      }
                      className="bg-background/50 border-border text-foreground"
                      placeholder="Alex"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, last_name: e.target.value })
                      }
                      className="bg-background/50 border-border text-foreground"
                      placeholder="Thompson"
                    />
                  </div>
                </div>

                {/* Email Address (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-background/30 border-border text-muted-foreground cursor-not-allowed"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="bg-background/50 border-border text-foreground min-h-32"
                    placeholder="Fact-checker and truth seeker. Passionate about leveraging technology to combat misinformation. Researcher at the Digital Inquiry Institute."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="border-border text-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
