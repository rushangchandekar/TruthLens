import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-official flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-semibold text-foreground">TruthLens</span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
