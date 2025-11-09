import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-background to-card/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">TruthLens</span>
        </div>
        <h1 className="text-5xl font-bold text-foreground leading-tight mb-6">
          Uncover the Truth with Multi-Agent AI.
        </h1>
        <p className="text-xl text-muted-foreground">
          Join the platform that brings clarity to a world of information.
        </p>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button 
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-official to-social hover:opacity-90 text-white font-medium text-base"
              >
                Sign Up
              </Button>
            </form>

            {/* Log In Link */}
            <p className="text-center mt-6 text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-official hover:text-official/80 font-medium transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
