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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-official to-primary bg-clip-text text-transparent animate-fade-in">
            TruthLens
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Agentic Fact Verification
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Multi-agent AI system that debates claims from official and social sources to deliver nuanced verdicts
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-official/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
            <div className="relative flex items-center bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
              <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
              <Input
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter a claim to investigate (e.g., 'Does E20 fuel damage engines?')"
                className="flex-1 pl-14 pr-6 py-7 text-lg bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full py-7 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
          >
            Investigate Claim
          </Button>
        </form>

        {/* Example queries */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Does E20 fuel damage car engines?",
              "Is climate change caused by humans?",
              "Are electric cars more sustainable?"
            ].map((example) => (
              <button
                key={example}
                onClick={() => setClaim(example)}
                className="px-4 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary border border-border/30 text-foreground/80 hover:text-foreground transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
