import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  PlusCircle, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  Pencil
} from "lucide-react";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileSidebarProps {
  user: any;
  displayName: string;
}

export const ProfileSidebar = ({ user, displayName }: ProfileSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full h-full p-6 flex flex-col">
      {/* User Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-official rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <Avatar className="relative h-24 w-24 border-4 border-background ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white font-semibold text-2xl">
              {user && getInitials(user.email || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-official to-official/80 flex items-center justify-center border-2 border-background cursor-pointer hover:scale-110 transition-transform shadow-lg">
            <Pencil className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1 text-center">
          {displayName}
        </h2>
        <p className="text-sm text-muted-foreground text-center">{user?.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <Link 
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-accent/50 hover:text-foreground transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <PlusCircle className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">New Claim</span>
        </Link>
        <Link
          to="/saved"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive("/saved")
              ? "bg-primary/10 text-foreground font-semibold"
              : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isActive("/saved") ? "bg-primary/20" : "bg-accent/30 group-hover:bg-accent/50"
          }`}>
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">Saved Results</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive("/profile")
              ? "bg-primary/10 text-foreground font-semibold"
              : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isActive("/profile") ? "bg-primary/20" : "bg-accent/30 group-hover:bg-accent/50"
          }`}>
            <User className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">Profile</span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive("/settings")
              ? "bg-primary/10 text-foreground font-semibold"
              : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isActive("/settings") ? "bg-primary/20" : "bg-accent/30 group-hover:bg-accent/50"
          }`}>
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      {/* Sign Out Button */}
      <div className="border-t border-border/50 pt-6 mt-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};