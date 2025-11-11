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
          {displayName}
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
        <Link
          to="/saved"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/saved")
              ? "bg-accent text-foreground font-medium"
              : "text-foreground/80 hover:bg-accent hover:text-foreground"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Saved Results</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/profile")
              ? "bg-accent text-foreground font-medium"
              : "text-foreground/80 hover:bg-accent hover:text-foreground"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/settings")
              ? "bg-accent text-foreground font-medium"
              : "text-foreground/80 hover:bg-accent hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
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
  );
};
