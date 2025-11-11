import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ChevronRight, PlusCircle, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Progress } from "@/components/ui/progress";

interface SavedFactCheck {
  id: string;
  claim: string;
  verdict: string;
  confidence_level: number;
  created_at: string;
  full_data: any;
}

export default function SavedResults() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedChecks, setSavedChecks] = useState<SavedFactCheck[]>([]);
  const [profileData, setProfileData] = useState<any>({});

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
    await fetchSavedChecks(user.id);
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

  const fetchSavedChecks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("saved_fact_checks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedChecks(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading saved results",
        description: error.message,
      });
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-verified";
    if (confidence >= 40) return "text-unverified";
    return "text-false";
  };

  const getProgressColor = (confidence: number) => {
    if (confidence >= 80) return "bg-verified";
    if (confidence >= 40) return "bg-unverified";
    return "bg-false";
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Saved Fact-Checks
                </h1>
                <p className="text-muted-foreground">
                  Review your past investigations or start a new one.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Fact-Check
              </Button>
            </div>

            {/* Saved Checks List */}
            <div className="space-y-4">
              {savedChecks.length === 0 ? (
                <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-12 text-center">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No saved fact-checks yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start investigating claims to build your fact-check library.
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Fact-Check
                  </Button>
                </div>
              ) : (
                savedChecks.map((check) => (
                  <div
                    key={check.id}
                    className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-6 hover:bg-card/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          Saved on: {formatDate(check.created_at)}
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          "{check.claim}"
                        </h3>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${getConfidenceColor(check.confidence_level)}`}>
                            {check.confidence_level}%
                          </p>
                          <div className="w-32 mt-2">
                            <Progress 
                              value={check.confidence_level} 
                              className="h-2"
                            />
                            <style>{`
                              .progress-bar-${check.id} [data-state="complete"] {
                                background-color: ${getProgressColor(check.confidence_level)};
                              }
                            `}</style>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
