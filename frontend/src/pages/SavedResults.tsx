import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  PlusCircle, 
  Bookmark, 
  Search,
  Calendar,
  TrendingUp,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SavedFactCheck {
  id: string;
  claim: string;
  verdict: string;
  confidence_level: number;
  created_at: string;
  full_data: any;
}

const getVerdictInfo = (verdict: string) => {
  const normalized = verdict?.toLowerCase() || "";
  if (normalized.includes("true") || normalized.includes("verified")) {
    return {
      label: "Verified",
      icon: CheckCircle2,
      color: "text-verified",
      bgColor: "bg-verified/10",
      borderColor: "border-verified/50"
    };
  }
  if (normalized.includes("false") || normalized.includes("misleading")) {
    return {
      label: "False",
      icon: XCircle,
      color: "text-false",
      bgColor: "bg-false/10",
      borderColor: "border-false/50"
    };
  }
  return {
    label: "Unverified",
    icon: AlertCircle,
    color: "text-unverified",
    bgColor: "bg-unverified/10",
    borderColor: "border-unverified/50"
  };
};

export default function SavedResults() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedChecks, setSavedChecks] = useState<SavedFactCheck[]>([]);
  const [filteredChecks, setFilteredChecks] = useState<SavedFactCheck[]>([]);
  const [profileData, setProfileData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<string>("all");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchQuery, filterVerdict, savedChecks]);

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
      setFilteredChecks(data || []);
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

  const filterResults = () => {
    let filtered = [...savedChecks];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(check => 
        check.claim.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Verdict filter
    if (filterVerdict !== "all") {
      filtered = filtered.filter(check => {
        const info = getVerdictInfo(check.verdict);
        return info.label.toLowerCase() === filterVerdict.toLowerCase();
      });
    }

    setFilteredChecks(filtered);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this fact-check?")) return;

    try {
      const { error } = await supabase
        .from("saved_fact_checks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedChecks(prev => prev.filter(check => check.id !== id));
      toast({
        title: "Deleted successfully",
        description: "The fact-check has been removed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting",
        description: error.message,
      });
    }
  };

  const handleViewResult = (check: SavedFactCheck) => {
    // Navigate to results page with this data
    // You'll need to implement this navigation
    console.log("View result:", check);
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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading your saved results...</p>
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Saved Fact-Checks
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {savedChecks.length} saved investigation{savedChecks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white shadow-lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Fact-Check
              </Button>
            </div>

            {/* Stats Cards */}
            {savedChecks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    label: "Total Checks", 
                    value: savedChecks.length, 
                    icon: Bookmark,
                    color: "text-primary" 
                  },
                  { 
                    label: "Verified", 
                    value: savedChecks.filter(c => getVerdictInfo(c.verdict).label === "Verified").length,
                    icon: CheckCircle2,
                    color: "text-verified" 
                  },
                  { 
                    label: "False", 
                    value: savedChecks.filter(c => getVerdictInfo(c.verdict).label === "False").length,
                    icon: XCircle,
                    color: "text-false" 
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-effect rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
                  >
                    <stat.icon className={cn("w-8 h-8 mb-3", stat.color)} />
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Search and Filter */}
            {savedChecks.length > 0 && (
              <div className="glass-effect rounded-xl border border-border/50 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search your fact-checks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>

                  {/* Filter */}
                  <div className="flex gap-2">
                    <Button
                      variant={filterVerdict === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterVerdict("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterVerdict === "verified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterVerdict("verified")}
                      className={filterVerdict === "verified" ? "bg-verified hover:bg-verified/90" : ""}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified
                    </Button>
                    <Button
                      variant={filterVerdict === "false" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterVerdict("false")}
                      className={filterVerdict === "false" ? "bg-false hover:bg-false/90" : ""}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      False
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {filteredChecks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-2xl border border-border/50 p-12 text-center"
                >
                  <Bookmark className="w-20 h-20 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {savedChecks.length === 0 
                      ? "No saved fact-checks yet" 
                      : "No results found"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {savedChecks.length === 0 
                      ? "Start investigating claims to build your fact-check library."
                      : "Try adjusting your search or filters."}
                  </p>
                  {savedChecks.length === 0 && (
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Start Your First Fact-Check
                    </Button>
                  )}
                  {savedChecks.length > 0 && filteredChecks.length === 0 && (
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterVerdict("all");
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                filteredChecks.map((check, index) => {
                  const verdictInfo = getVerdictInfo(check.verdict);
                  const VerdictIcon = verdictInfo.icon;

                  return (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleViewResult(check)}
                      className="glass-effect rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left: Content */}
                        <div className="flex-1 space-y-4">
                          {/* Date and Verdict Badge */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatRelativeTime(check.created_at)}
                            </div>
                            <div className={cn(
                              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                              verdictInfo.bgColor,
                              verdictInfo.color
                            )}>
                              <VerdictIcon className="w-3.5 h-3.5" />
                              {verdictInfo.label}
                            </div>
                          </div>

                          {/* Claim */}
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            "{check.claim}"
                          </h3>

                          {/* Confidence */}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Confidence</span>
                                <span className={cn("text-sm font-bold", verdictInfo.color)}>
                                  {check.confidence_level}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full transition-all duration-500", verdictInfo.bgColor.replace('/10', '/50'))}
                                  style={{ width: `${check.confidence_level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewResult(check);
                            }}
                            className="group-hover:border-primary/50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(check.id, e)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Pagination Placeholder */}
            {filteredChecks.length > 10 && (
              <div className="flex justify-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredChecks.length} results
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}