import { useState } from "react";
import { Search, Sparkles, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface HeroProps {
  onInvestigate: (claim: string) => void;
}

export const Hero = ({ onInvestigate }: HeroProps) => {
  const [claim, setClaim] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Scroll animations for different sections
  const statsAnimation = useScrollAnimation(0.2);

  // Example claims for quick testing
  const exampleClaims = [
    "Does E20 fuel damage engines?",
    "Is coffee bad for your health?",
    "Did the moon landing happen in 1969?",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      setIsLoading(true);
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      onInvestigate(claim);
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setClaim(example);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-32 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 gradient-orb gradient-orb-primary animate-float opacity-30" 
           style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-40 right-20 w-96 h-96 gradient-orb gradient-orb-official animate-float opacity-20" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 gradient-orb gradient-orb-social animate-float opacity-15" 
           style={{ animationDelay: '4s' }} />
      
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDIsMTgzLDkxLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="max-w-5xl w-full space-y-10 relative z-10">
        {/* Floating badges */}
        {/* <div className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="badge badge-verified flex items-center gap-1.5 px-4 py-2 glass-effect">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">AI-Powered</span>
          </div>
          <div className="badge badge-official flex items-center gap-1.5 px-4 py-2 glass-effect">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Real-time Verification</span>
          </div>
          <div className="badge badge-unverified flex items-center gap-1.5 px-4 py-2 glass-effect">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Multiple Sources</span>
          </div>
        </div> */}

        {/* Main Heading */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gradient-verified">
              Agentic Fact Verification Platform
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-foreground mb-2">
              Discover Truth with
            </span>
            <span className="block text-gradient bg-gradient-to-r from-primary via-official to-primary bg-clip-text text-transparent">
              TruthLens
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-powered fact-checking that investigates claims across multiple sources in real-time
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            {/* Glow effect on focus */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-official rounded-2xl blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
            
            <div className="relative flex items-center glass-effect-strong rounded-2xl border border-border/50 overflow-hidden shadow-xl group-focus-within:border-primary/50 transition-all duration-300">
              <Search className="absolute left-5 sm:left-6 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter a claim to investigate..."
                disabled={isLoading}
                className="flex-1 pl-12 sm:pl-14 pr-4 sm:pr-6 py-6 sm:py-7 text-base sm:text-lg bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60 disabled:opacity-50"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!claim.trim() || isLoading}
            className="w-full py-6 sm:py-7 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-official hover:opacity-90 text-white rounded-xl transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Investigating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Investigate Claim</span>
              </div>
            )}
          </Button>
        </form>

        {/* Example Claims */}
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm font-medium text-muted-foreground">
            Try these examples:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {exampleClaims.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="group px-4 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/80 border border-border/50 hover:border-primary/50 rounded-xl transition-all duration-300 glass-effect hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="line-clamp-1">{example}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust indicators - Animated on scroll */}
        <div 
          ref={statsAnimation.ref}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 pb-16 md:pb-20 transition-all duration-700 ${
            statsAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { label: "Accuracy Rate", value: 98.5, suffix: "%", decimals: 1, icon: CheckCircle2 },
            { label: "Sources Checked", value: 15, suffix: "+", decimals: 0, icon: TrendingUp },
            { label: "Avg Response", value: 30, prefix: "< ", suffix: "s", decimals: 0, icon: Sparkles },
            { label: "Claims Verified", value: 10, suffix: "K+", decimals: 0, icon: Shield },
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`text-center p-4 sm:p-6 rounded-xl glass-effect border border-border/30 hover:border-primary/30 transition-all duration-300 group ${
                statsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: statsAnimation.isVisible ? `${index * 100}ms` : '0ms',
                transition: 'all 0.5s ease-out'
              }}
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                <AnimatedCounter 
                  end={stat.value} 
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator - FIXED POSITION */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};