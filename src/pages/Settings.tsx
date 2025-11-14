import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Shield, 
  Sliders, 
  Brain, 
  Eye, 
  Sun, 
  Moon, 
  Info,
  Save,
  X,
  Bell,
  Lock,
  Globe,
  Zap,
  Check,
  ChevronRight,
  TrendingUp
} from "lucide-react";
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
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme, language, setLanguage } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Store initial settings
  const initialSettings = useRef({
    aiModel: "auto",
    explanationDetail: "detailed",
    showConfidence: true,
    showCitations: true,
    emailNotifications: true,
    autoSave: false,
  });
  
  // Settings state
  const [aiModel, setAiModel] = useState(initialSettings.current.aiModel);
  const [explanationDetail, setExplanationDetail] = useState(initialSettings.current.explanationDetail);
  const [showConfidence, setShowConfidence] = useState(initialSettings.current.showConfidence);
  const [showCitations, setShowCitations] = useState(initialSettings.current.showCitations);
  const [emailNotifications, setEmailNotifications] = useState(initialSettings.current.emailNotifications);
  const [autoSave, setAutoSave] = useState(initialSettings.current.autoSave);

  useEffect(() => {
    checkUser();
    loadSettings();
  }, []);

  // Load saved settings from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem('truthlens_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setAiModel(settings.aiModel || "auto");
        setExplanationDetail(settings.explanationDetail || "detailed");
        setShowConfidence(settings.showConfidence ?? true);
        setShowCitations(settings.showCitations ?? true);
        setEmailNotifications(settings.emailNotifications ?? true);
        setAutoSave(settings.autoSave ?? false);
        
        // Update initial values
        initialSettings.current = {
          aiModel: settings.aiModel || "auto",
          explanationDetail: settings.explanationDetail || "detailed",
          showConfidence: settings.showConfidence ?? true,
          showCitations: settings.showCitations ?? true,
          emailNotifications: settings.emailNotifications ?? true,
          autoSave: settings.autoSave ?? false,
        };
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  };

  // Detect if any settings have changed
  useEffect(() => {
    const hasChanged = 
      aiModel !== initialSettings.current.aiModel ||
      explanationDetail !== initialSettings.current.explanationDetail ||
      showConfidence !== initialSettings.current.showConfidence ||
      showCitations !== initialSettings.current.showCitations ||
      emailNotifications !== initialSettings.current.emailNotifications ||
      autoSave !== initialSettings.current.autoSave;
    
    setHasChanges(hasChanged);
  }, [aiModel, explanationDetail, showConfidence, showCitations, emailNotifications, autoSave]);

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

  const handleSaveSettings = async () => {
    setSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSettings = {
      aiModel,
      explanationDetail,
      showConfidence,
      showCitations,
      emailNotifications,
      autoSave
    };
    
    localStorage.setItem('truthlens_settings', JSON.stringify(newSettings));
    
    // Update initial values after successful save
    initialSettings.current = { ...newSettings };

    setSaving(false);
    setHasChanges(false);
    
    toast({
      title: "Settings saved successfully! 🎉",
      description: "Your preferences have been updated.",
    });
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        // Reset to initial values
        setAiModel(initialSettings.current.aiModel);
        setExplanationDetail(initialSettings.current.explanationDetail);
        setShowConfidence(initialSettings.current.showConfidence);
        setShowCitations(initialSettings.current.showCitations);
        setEmailNotifications(initialSettings.current.emailNotifications);
        setAutoSave(initialSettings.current.autoSave);
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 gradient-orb gradient-orb-primary opacity-10 animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 gradient-orb gradient-orb-official opacity-10 animate-float" style={{ animationDelay: '3s' }} />

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

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm min-h-[calc(100vh-4rem)] sticky top-16">
          <ProfileSidebar user={user} displayName={getUserDisplayName()} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Settings
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Customize your TruthLens experience
                </p>
              </div>
              
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-unverified/10 border border-unverified/50"
                >
                  <div className="w-2 h-2 rounded-full bg-unverified animate-pulse" />
                  <span className="text-xs font-semibold text-unverified">Unsaved changes</span>
                </motion.div>
              )}
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Appearance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-official/20 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Appearance
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how TruthLens looks and feels
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        theme === "dark" ? "bg-primary/20" : "bg-unverified/20"
                      )}>
                        {theme === "dark" ? (
                          <Moon className="w-5 h-5 text-primary" />
                        ) : (
                          <Sun className="w-5 h-5 text-unverified" />
                        )}
                      </div>
                      <div>
                        <Label className="text-foreground font-semibold">Theme Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          {theme === "dark" ? "Dark mode" : "Light mode"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="text-foreground font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Language
                    </Label>
                    <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                      <SelectTrigger className="bg-background/50 border-border/30 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="english">🇺🇸 English</SelectItem>
                        <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                        <SelectItem value="french">🇫🇷 French</SelectItem>
                        <SelectItem value="german">🇩🇪 German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>

              {/* AI Model */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-official/20 to-social/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-official" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      AI Model
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose the AI model for fact-checking analysis
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-foreground font-semibold">Model Selection</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-card border-border max-w-xs">
                          <p className="text-sm">
                            Auto Select automatically chooses the best model for each task. Pro models offer higher accuracy but may be slower.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="bg-background/50 border-border/30 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span>Auto Select (Recommended)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gemini-flash">Gemini 2.5 Flash</SelectItem>
                      <SelectItem value="gemini-pro">Gemini 2.5 Pro</SelectItem>
                      <SelectItem value="gpt-5">GPT-5</SelectItem>
                      <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Response & Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-verified/20 to-primary/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-verified" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Response & Display
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Control how information is presented in results
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Explanation Detail */}
                  <div>
                    <Label className="text-foreground font-semibold mb-3 block">
                      Explanation Detail Level
                    </Label>
                    <Select value={explanationDetail} onValueChange={setExplanationDetail}>
                      <SelectTrigger className="bg-background/50 border-border/30 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="brief">
                          <div className="flex items-center justify-between w-full">
                            <span>Brief</span>
                            <span className="text-xs text-muted-foreground ml-4">Quick summary</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="moderate">
                          <div className="flex items-center justify-between w-full">
                            <span>Moderate</span>
                            <span className="text-xs text-muted-foreground ml-4">Balanced details</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="detailed">
                          <div className="flex items-center justify-between w-full">
                            <span>Detailed</span>
                            <span className="text-xs text-muted-foreground ml-4">Full analysis</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Display Toggles */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold block mb-3">
                      Display Options
                    </Label>
                    
                    {[
                      {
                        id: "confidence",
                        label: "Show Confidence Level",
                        description: "Display trust percentage in results",
                        checked: showConfidence,
                        onChange: setShowConfidence,
                        icon: TrendingUp
                      },
                      {
                        id: "citations",
                        label: "Show Source Citations",
                        description: "Include links to original sources",
                        checked: showCitations,
                        onChange: setShowCitations,
                        icon: Globe
                      },
                      {
                        id: "autosave",
                        label: "Auto-save Results",
                        description: "Automatically save fact-checks to your library",
                        checked: autoSave,
                        onChange: setAutoSave,
                        icon: Save
                      }
                    ].map((toggle) => (
                      <div
                        key={toggle.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <toggle.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <Label 
                              htmlFor={toggle.id} 
                              className="text-foreground font-semibold cursor-pointer block"
                            >
                              {toggle.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {toggle.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={toggle.id}
                          checked={toggle.checked}
                          onCheckedChange={toggle.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-social/20 to-unverified/20 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-social" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Notifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage how you receive updates
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-social/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-social" />
                    </div>
                    <div>
                      <Label htmlFor="notifications" className="text-foreground font-semibold cursor-pointer block">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get updates about new features and fact-checks
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-effect rounded-xl border border-border/50 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Your Data is Secure</h3>
                    <p className="text-sm text-muted-foreground">
                      All settings are encrypted and stored securely. We never share your preferences with third parties.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={cn(
                "sticky bottom-4 glass-effect-strong rounded-2xl border-2 p-4 shadow-2xl transition-all",
                hasChanges ? "border-primary/50" : "border-border/50"
              )}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {hasChanges ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-unverified animate-pulse" />
                    <span className="text-muted-foreground">
                      You have unsaved changes
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-verified" />
                    <span>All changes saved</span>
                  </div>
                )}

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving || !hasChanges}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-official hover:opacity-90 text-white shadow-lg shadow-primary/25"
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
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}