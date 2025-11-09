import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { AgentDebate } from "@/components/AgentDebate";
import { ResultsDashboard } from "@/components/ResultsDashboard";

type AppState = "idle" | "processing" | "complete";

const MOCK_DATA = {
  status: "complete",
  query: "Does E20 fuel damage car engines?",
  verdict: "Unverified",
  confidence_level: "Medium",
  synthesis_explanation:
    "While social media is saturated with anecdotal reports of engine knocking, no official government or peer-reviewed automotive study currently confirms widespread acute damage from E20 in compatible vehicles.",
  debate_rounds: 2,
  evidence: {
    official: [
      {
        title: "Ministry of Petroleum Advisory 2025",
        type: "Government",
        snippet:
          "Lists compatible vehicle classes; no explicit warning for new engines.",
      },
      {
        title: "SAE Technical Paper #4022",
        type: "Academic",
        snippet:
          "Long-term corrosion studies are ongoing; preliminary results neutral.",
      },
    ],
    social: [
      {
        title: "Viral Mechanic Reel (2.1M views)",
        type: "Instagram",
        snippet: "Claims fuel pumps are failing in 2018-2020 models.",
      },
      {
        title: "r/CarsIndia Megathread",
        type: "Reddit",
        snippet:
          "400+ users reporting lower mileage and increased engine noise.",
      },
    ],
  },
};

const Index = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentClaim, setCurrentClaim] = useState("");

  const handleInvestigate = (claim: string) => {
    setCurrentClaim(claim);
    setAppState("processing");

    // Simulate agent debate time (6 seconds to match progress bar)
    setTimeout(() => {
      setAppState("complete");
    }, 6000);
  };

  const handleReset = () => {
    setAppState("idle");
    setCurrentClaim("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {appState === "idle" && (
        <>
          <Header />
          <Hero onInvestigate={handleInvestigate} />
          <Features />
          <Testimonials />
          <Footer />
        </>
      )}
      {appState === "processing" && <AgentDebate />}
      {appState === "complete" && (
        <ResultsDashboard
          data={{ ...MOCK_DATA, query: currentClaim }}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Index;
