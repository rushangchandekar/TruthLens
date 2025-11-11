import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      setIsLoading(false);
    } else {
      setEmailSent(true);
      toast({
        title: "Email sent!",
        description: "Check your email for the password reset link.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-official flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">TruthLens</span>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-3">Reset Your Password</h1>
                <p className="text-muted-foreground">
                  We'll send a password reset link to the email associated with your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12"
                      required
                    />
                  </div>
                </div>

                {/* Reset Password Button */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-official via-primary to-social hover:opacity-90 text-white font-medium text-base"
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-verified/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-verified" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-official hover:text-official/80 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          {/* Back to Login Link */}
          <p className="text-center mt-6 text-muted-foreground">
            <Link to="/login" className="text-official hover:text-official/80 font-medium transition-colors">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
