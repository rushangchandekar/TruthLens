import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onInvestigate: (claim: string) => void;
}

export const Hero = ({ onInvestigate }: HeroProps) => {
  const [claim, setClaim] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onInvestigate(claim);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden pt-24">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground animate-fade-in">
            TruthLens: Agentic Fact Verification
          </h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="relative flex items-center bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
              <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
              <Input
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter a claim to investigate (e.g., 'Does E20 fuel damage engines?')"
                className="flex-1 pl-14 pr-6 py-7 text-base bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-official hover:opacity-90 text-white rounded-xl transition-all"
          >
            Investigate
          </Button>
        </form>
      </div>
    </section>
  );
};
