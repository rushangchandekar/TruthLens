import { useState } from "react";
import { Search, Sparkles, Shield, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HeroOrbit } from "@/components/HeroOrbit";

interface HeroProps {
  onInvestigate: (claim: string) => void;
}

export const Hero = ({ onInvestigate }: HeroProps) => {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Example claims for quick testing
  const exampleClaims = [
    "Does E20 fuel damage engines?",
    "Is coffee bad for your health?",
    "Did the moon landing happen in 1969?",
  ];

  const handleAnalyze = async () => {
    if (query.trim()) {
      setIsAnalyzing(true);
      onInvestigate(query);
      // Note: Loading state will be managed by parent component
      setTimeout(() => setIsAnalyzing(false), 1000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left space-y-8">
          {/* Badge */}
          <div className="animate-fade-in opacity-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              AI-Powered Truth Verification
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up opacity-0 text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]" style={{ animationDelay: "0.1s" }}>
            Reveal the <span className="text-gradient">Truth</span> behind the noise
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up opacity-0 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Instantly analyze claims with advanced AI agents. Detect bias, verify facts, and get a comprehensive breakdown of credibility in seconds.
          </p>

          {/* Input Section */}
          <div className="w-full max-w-xl animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s" }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-social rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                <Search className="w-6 h-6 text-muted-foreground ml-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Paste a URL or type a claim..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 px-4 py-3 text-lg"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!query.trim() || isAnalyzing}
                  className="btn-primary rounded-xl px-6 py-6 text-base shadow-lg shadow-primary/25"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Example Claims */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="text-sm text-muted-foreground/60">Try asking:</span>
              {exampleClaims.map((claim, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(claim)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary/30 pb-0.5"
                >
                  "{claim}"
                </button>
              ))}
            </div>
          </div>

          {/* Trust Indicators (Compact) */}
          <div className="flex gap-8 pt-4 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s" }}>
            {[
              { label: "Active Agents", value: 5, suffix: "+" },
              { label: "Accuracy", value: 99, suffix: "%" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="flex items-baseline text-3xl font-bold text-foreground font-heading">
                  <AnimatedCounter end={stat.value} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="hidden lg:flex items-center justify-center relative animate-scale-in opacity-0" style={{ animationDelay: "0.5s" }}>
          {/* Abstract "Truth Lens" Visual */}
          <div className="relative w-[500px] h-[500px] flex items-center justify-center">

            {/* Central Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-official/10 to-social/10 rounded-full blur-3xl animate-pulse" />

            {/* Rotating Rings using HeroOrbit */}
            <HeroOrbit size={500} rotation={0} shouldOrbit orbitDuration="30s" shouldSpin spinDuration="30s">
              <div className="rounded-full border border-primary/20" style={{ width: '500px', height: '500px' }} />
            </HeroOrbit>

            <HeroOrbit size={400} rotation={45} shouldOrbit orbitDuration="20s" shouldSpin spinDuration="20s">
              <div className="rounded-full border border-dashed border-official/30" style={{ width: '400px', height: '400px' }} />
            </HeroOrbit>

            <HeroOrbit size={300} rotation={-45} shouldOrbit orbitDuration="15s" shouldSpin spinDuration="15s">
              <div className="rounded-full border border-social/20" style={{ width: '300px', height: '300px' }} />
            </HeroOrbit>

            {/* Small Decorative Rings - More visible */}
            <HeroOrbit size={200} rotation={90} shouldOrbit orbitDuration="25s" shouldSpin spinDuration="25s">
              <div className="rounded-full border border-primary/40" style={{ width: '200px', height: '200px' }} />
            </HeroOrbit>

            <HeroOrbit size={120} rotation={180} shouldOrbit orbitDuration="20s" shouldSpin spinDuration="20s">
              <div className="rounded-full border border-dashed border-official/30" style={{ width: '120px', height: '120px' }} />
            </HeroOrbit>

            {/* Small Decorative Stars - More visible */}
            <HeroOrbit size={450} rotation={20} shouldOrbit orbitDuration="45s" shouldSpin={false}>
              <Sparkles className="w-4 h-4 text-primary/50" />
            </HeroOrbit>
            <HeroOrbit size={350} rotation={-60} shouldOrbit orbitDuration="38s" shouldSpin={false}>
              <Sparkles className="w-3.5 h-3.5 text-official/45" />
            </HeroOrbit>
            <HeroOrbit size={250} rotation={150} shouldOrbit orbitDuration="42s" shouldSpin={false}>
              <Sparkles className="w-3 h-3 text-social/40" />
            </HeroOrbit>

            {/* Orbiting Cards - Each on a different ring, staying upright via counter-rotation */}
            {/* Card 1: Verified - Outer ring (500px) at -30 degrees */}
            <HeroOrbit size={500} rotation={-30} shouldOrbit orbitDuration="40s" shouldSpin spinDuration="40s">
              <div className="bg-card/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Verified</div>
                    <div className="text-xs text-muted-foreground">98.5%</div>
                  </div>
                </div>
              </div>
            </HeroOrbit>

            {/* Card 2: Multi-Source - Middle ring (400px) at 100 degrees */}
            <HeroOrbit size={400} rotation={100} shouldOrbit orbitDuration="35s" shouldSpin spinDuration="35s">
              <div className="bg-card/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Sources</div>
                    <div className="text-xs text-muted-foreground">50+ Checked</div>
                  </div>
                </div>
              </div>
            </HeroOrbit>

            {/* Card 3: AI Analysis - Inner ring (300px) at 240 degrees */}
            <HeroOrbit size={300} rotation={240} shouldOrbit orbitDuration="30s" shouldSpin spinDuration="30s">
              <div className="bg-card/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl animate-float" style={{ animationDelay: "2.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">AI Analysis</div>
                    <div className="text-xs text-muted-foreground">Real-time</div>
                  </div>
                </div>
              </div>
            </HeroOrbit>

          </div>
        </div>

      </div>
    </section>
  );
};