import { motion } from "framer-motion";
import { Search, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const agents = [
  {
    name: "Fact-Finder",
    icon: Search,
    color: "text-official",
    bgColor: "bg-official/10",
    borderColor: "border-official/30",
    messages: [
      "Scanning government records...",
      "Analyzing research papers...",
      "Checking official databases..."
    ]
  },
  {
    name: "Pattern Detector",
    icon: TrendingUp,
    color: "text-social",
    bgColor: "bg-social/10",
    borderColor: "border-social/30",
    messages: [
      "Analyzing social media volume...",
      "Tracking viral patterns...",
      "Measuring sentiment trends..."
    ]
  },
  {
    name: "Verifier",
    icon: CheckCircle2,
    color: "text-verified",
    bgColor: "bg-verified/10",
    borderColor: "border-verified/30",
    messages: [
      "Cross-referencing sources...",
      "Validating evidence...",
      "Assessing credibility..."
    ]
  },
  {
    name: "Critic",
    icon: AlertTriangle,
    color: "text-unverified",
    bgColor: "bg-unverified/10",
    borderColor: "border-unverified/30",
    messages: [
      "Challenging assumptions...",
      "Identifying biases...",
      "Reviewing consensus..."
    ]
  }
];

export const AgentDebate = () => {
  const [activeAgent, setActiveAgent] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const agentInterval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 2000);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearInterval(agentInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Agent Debate in Progress</h2>
          <p className="text-muted-foreground">
            Our AI agents are analyzing your claim from multiple perspectives
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isActive = activeAgent === index;

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Glow effect when active */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 ${agent.bgColor} rounded-2xl blur-2xl`}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Card */}
                <div
                  className={`relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 ${
                    isActive
                      ? `${agent.borderColor} shadow-lg`
                      : "border-border/30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mb-4 p-4 rounded-xl ${agent.bgColor} ${agent.borderColor} border w-fit`}
                  >
                    <Icon className={`h-8 w-8 ${agent.color}`} />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold mb-3">{agent.name}</h3>

                  {/* Status Message */}
                  <motion.p
                    key={`${index}-${messageIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0.5 }}
                    className="text-sm text-muted-foreground min-h-[40px]"
                  >
                    {isActive
                      ? agent.messages[messageIndex]
                      : "Waiting..."}
                  </motion.p>

                  {/* Pulse indicator */}
                  {isActive && (
                    <motion.div
                      className={`absolute top-4 right-4 h-3 w-3 rounded-full ${agent.bgColor.replace('/10', '')} border-2 border-background`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Analyzing evidence...</span>
            <span>Round {Math.floor(messageIndex) + 1}/3</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-official to-verified"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
