import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Sliders, Brain, Eye, Sun, Moon, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme, language, setLanguage } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>({});
  
  // Settings state
  const [aiModel, setAiModel] = useState("auto");
  const [explanationDetail, setExplanationDetail] = useState("detailed");
  const [showConfidence, setShowConfidence] = useState(true);
  const [showCitations, setShowCitations] = useState(true);

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
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfileData(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
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

  const handleSaveSettings = () => {
    // Here you would save settings to database or localStorage
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleCancel = () => {
    navigate("/profile");
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
        <ProfileSidebar user={user} displayName={getUserDisplayName()} />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your preferences for a personalized experience.
              </p>
            </div>

            <div className="space-y-6">
              {/* General Preferences */}
              <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      General Preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize the look and feel of the application.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Theme Mode */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Theme Mode</Label>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                      <Sun className={`w-5 h-5 ${theme === "light" ? "text-foreground" : "text-muted-foreground"}`} />
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={(checked) =>
                          setTheme(checked ? "dark" : "light")
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                      <Moon className={`w-5 h-5 ${theme === "dark" ? "text-foreground" : "text-muted-foreground"}`} />
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Language Selection</Label>
                    <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                      <SelectTrigger className="bg-background/50 border-border/30 text-foreground">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* AI Model */}
              <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      AI Model
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select the core engine for fact-checking and analysis.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground">Model Selection</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-card border-border">
                          <p className="max-w-xs">
                            Auto Select chooses the best model for each task automatically.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="bg-background/50 border-border/30 text-foreground md:max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="auto">Auto Select</SelectItem>
                      <SelectItem value="gemini-flash">Gemini 2.5 Flash</SelectItem>
                      <SelectItem value="gemini-pro">Gemini 2.5 Pro</SelectItem>
                      <SelectItem value="gpt-5">GPT-5</SelectItem>
                      <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Response & Display Settings */}
              <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Response & Display Settings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Control how information is presented in your results.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Explanation Detail */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Explanation Detail</Label>
                    <Select value={explanationDetail} onValueChange={setExplanationDetail}>
                      <SelectTrigger className="bg-background/50 border-border/30 text-foreground md:max-w-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Show Confidence Level */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
                      <Label htmlFor="confidence" className="text-foreground cursor-pointer">
                        Show Confidence Level
                      </Label>
                      <Switch
                        id="confidence"
                        checked={showConfidence}
                        onCheckedChange={setShowConfidence}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {/* Show Citations */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
                      <Label htmlFor="citations" className="text-foreground cursor-pointer">
                        Show Citations
                      </Label>
                      <Switch
                        id="citations"
                        checked={showCitations}
                        onCheckedChange={setShowCitations}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
