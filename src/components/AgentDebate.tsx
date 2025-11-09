import { motion } from "framer-motion";
import { Search, Network, ShieldCheck, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const agents = [
  {
    name: "Fact-Finder",
    icon: Search,
    description: "Scans records",
    color: "text-official",
    borderColor: "border-official",
    messages: [
      "is scanning government records...",
      "is analyzing research papers...",
      "is checking official databases..."
    ]
  },
  {
    name: "Pattern Detector",
    icon: Network,
    description: "Analyzes volume",
    color: "text-social",
    borderColor: "border-social",
    messages: [
      "is analyzing social media volume...",
      "is tracking viral patterns...",
      "is measuring sentiment trends..."
    ]
  },
  {
    name: "Verifier",
    icon: ShieldCheck,
    description: "Cross-references",
    color: "text-official",
    borderColor: "border-official",
    messages: [
      "is cross-referencing sources...",
      "is validating evidence...",
      "is assessing credibility..."
    ]
  },
  {
    name: "Critic",
    icon: Ban,
    description: "Assesses logic",
    color: "text-social",
    borderColor: "border-social",
    messages: [
      "is challenging assumptions...",
      "is identifying biases...",
      "is reviewing consensus..."
    ]
  }
];

export const AgentDebate = () => {
  const [activeAgent, setActiveAgent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const agentInterval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (100 / 60); // Complete in 6 seconds
      });
    }, 100);

    return () => {
      clearInterval(agentInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = agents[activeAgent].messages[Math.floor(progress / 33) % agents[activeAgent].messages.length];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-5xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-5xl font-bold text-foreground">Analyzing Claim</h2>
          <p className="text-lg text-muted-foreground">
            Our AI agents are debating and verifying the information.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isActive = activeAgent === index;

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card/40 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 ${
                  isActive
                    ? `${agent.borderColor} shadow-lg`
                    : "border-border/30"
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-xl bg-background/50 ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${agent.color}`} />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-center text-foreground mb-2">
                  {agent.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground text-center">
                  {agent.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Status Message */}
        <motion.div
          key={activeAgent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg text-foreground">
            <span className={agents[activeAgent].color}>{agents[activeAgent].name}</span>{" "}
            <span className="text-muted-foreground">{currentMessage}</span>
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};
