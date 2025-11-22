import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { AgentDebate } from "@/components/AgentDebate";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { investigateClaim, DebateResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type AppState = "idle" | "processing" | "complete";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentClaim, setCurrentClaim] = useState("");
  const [resultData, setResultData] = useState<DebateResponse | null>(null);
  const { toast } = useToast();

  // Scroll to top whenever app state changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  const handleInvestigate = async (claim: string) => {
    setCurrentClaim(claim);
    setAppState("processing");

    try {
      // Call the actual API
      const result = await investigateClaim(claim);

      setResultData(result);
      setAppState("complete");

      toast({
        title: "✅ Investigation Complete",
        description: `Verdict: ${result.verdict}`,
      });

    } catch (error: any) {
      console.error("Investigation failed:", error);

      toast({
        title: "❌ Investigation Failed",
        description: error.message || "Please make sure the backend is running on port 8000",
        variant: "destructive",
      });

      // Return to idle state on error
      setAppState("idle");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setCurrentClaim("");
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* --- GLOBAL BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Base Background with Mesh Gradient */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-official/20 blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-social/10 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        </div>

        {/* 2. Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* 3. Radial Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        {appState === "idle" && (
          <>
            <Header />
            <Hero onInvestigate={handleInvestigate} />
            <Features />
            <HowItWorks />
            <Footer />
          </>
        )}

        {appState === "processing" && (
          <div className="min-h-screen flex items-center justify-center">
            <AgentDebate />
          </div>
        )}

        {appState === "complete" && resultData && (
          <ResultsDashboard
            data={resultData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default Index;