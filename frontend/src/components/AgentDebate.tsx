import { motion, AnimatePresence } from "framer-motion";
import { Search, Network, ShieldCheck, Ban, Sparkles, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const agents = [
  {
    name: "Fact-Finder",
    icon: Search,
    description: "Scanning government records & databases",
    color: "text-official",
    bgColor: "from-official/20 to-official/5",
    borderColor: "border-official/50",
    glowColor: "shadow-official/20",
    messages: [
      "Scanning government records...",
      "Analyzing research papers...",
      "Checking official databases...",
      "Verifying institutional sources..."
    ]
  },
  {
    name: "Pattern Detector",
    icon: Network,
    description: "Analyzing social media & viral patterns",
    color: "text-social",
    bgColor: "from-social/20 to-social/5",
    borderColor: "border-social/50",
    glowColor: "shadow-social/20",
    messages: [
      "Analyzing social media volume...",
      "Tracking viral patterns...",
      "Measuring sentiment trends...",
      "Identifying information spread..."
    ]
  },
  {
    name: "Source Verifier",
    icon: ShieldCheck,
    description: "Cross-referencing multiple sources",
    color: "text-verified",
    bgColor: "from-verified/20 to-verified/5",
    borderColor: "border-verified/50",
    glowColor: "shadow-verified/20",
    messages: [
      "Cross-referencing sources...",
      "Validating evidence quality...",
      "Assessing source credibility...",
      "Checking fact-checker consensus..."
    ]
  },
  {
    name: "Logic Critic",
    icon: Ban,
    description: "Identifying biases & logical fallacies",
    color: "text-destructive",
    bgColor: "from-destructive/20 to-destructive/5",
    borderColor: "border-destructive/50",
    glowColor: "shadow-destructive/20",
    messages: [
      "Challenging assumptions...",
      "Identifying cognitive biases...",
      "Reviewing expert consensus...",
      "Analyzing logical structure..."
    ]
  }
];

interface LogEntry {
  id: string;
  agent: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning';
}

interface AgentDebateProps {
  pubsubChannel?: any; // Your pubsub instance (optional)
}

export const AgentDebate = ({ pubsubChannel }: AgentDebateProps = {}) => {
  const [activeAgent, setActiveAgent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Subscribe to pubsub if provided
  useEffect(() => {
    if (!pubsubChannel) return;

    const handlePubsubMessage = (message: any) => {
      const newLog: LogEntry = {
        id: `${Date.now()}-pubsub-${Math.random()}`,
        agent: message.agent || 'System',
        message: message.text || message.message || '',
        timestamp: new Date(),
        type: message.type || 'info'
      };
      setLogs(current => [...current.slice(-19), newLog]); // Keep last 20 logs
    };

    // Subscribe to pubsub channel
    const subscription = pubsubChannel.subscribe('agent-logs', handlePubsubMessage);

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [pubsubChannel]);

  useEffect(() => {
    // Agent rotation
    const agentInterval = setInterval(() => {
      setActiveAgent((prev) => {
        const next = (prev + 1) % agents.length;

        // Mark previous agent as completed
        if (!completedAgents.includes(prev)) {
          setCompletedAgents(current => [...current, prev]);
        }

        // Add log entry when agent becomes active
        const newLog: LogEntry = {
          id: `${Date.now()}-${next}`,
          agent: agents[next].name,
          message: `${agents[next].name} started analysis`,
          timestamp: new Date(),
          type: 'info'
        };
        setLogs(current => [...current.slice(-19), newLog]);

        return next;
      });
    }, 2000);

    // Message rotation for active agent
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = (prev + 1) % agents[activeAgent].messages.length;

        // Add log for each message
        const newLog: LogEntry = {
          id: `${Date.now()}-msg`,
          agent: agents[activeAgent].name,
          message: agents[activeAgent].messages[next],
          timestamp: new Date(),
          type: 'info'
        };
        setLogs(current => [...current.slice(-19), newLog]); // Keep last 20 logs

        return next;
      });
    }, 1500);

    // Smooth progress increment
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 0.5; // Smoother increment
      });
    }, 50);

    return () => {
      clearInterval(agentInterval);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [activeAgent, completedAgents]);

  const currentMessage = agents[activeAgent].messages[messageIndex];
  const ActiveAgentIcon = agents[activeAgent].icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-transparent relative overflow-hidden">
      {/* Global background from Index.tsx is used here */}

      <div className="max-w-6xl w-full space-y-8 md:space-y-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50 mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-gradient-verified">
              AI Analysis in Progress
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Analyzing Your Claim
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI agents are collaborating to verify information from multiple angles
          </p>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isActive = activeAgent === index;
            const isCompleted = completedAgents.includes(index);

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Glow effect on active */}
                {isActive && (
                  <div className={cn(
                    "absolute -inset-1 bg-gradient-to-br rounded-2xl blur-xl opacity-50 animate-pulse",
                    agent.bgColor
                  )} />
                )}

                {/* Card */}
                <div className={cn(
                  "relative glass-effect rounded-2xl p-6 border-2 transition-all duration-500",
                  isActive
                    ? `${agent.borderColor} shadow-2xl ${agent.glowColor} scale-105`
                    : "border-border/30 hover:border-border/50"
                )}>
                  {/* Status Badge */}
                  <div className="absolute -top-3 -right-3">
                    {isCompleted && !isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-verified flex items-center justify-center shadow-lg"
                      >
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    {isActive && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg", agent.bgColor)}
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </motion.div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                      className={cn(
                        "p-4 rounded-xl bg-gradient-to-br transition-all duration-300",
                        agent.bgColor,
                        isActive && "shadow-lg"
                      )}
                    >
                      <Icon className={cn("h-8 w-8", agent.color)} />
                    </motion.div>
                  </div>

                  {/* Name */}
                  <h3 className={cn(
                    "text-lg font-bold text-center mb-2 transition-colors",
                    isActive ? agent.color : "text-foreground"
                  )}>
                    {agent.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                      className={cn("h-1 rounded-full mt-4 bg-gradient-to-r", agent.bgColor)}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Status Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeAgent}-${messageIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass-effect-strong rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className={cn(
                "p-2 rounded-lg bg-gradient-to-br",
                agents[activeAgent].bgColor
              )}>
                <ActiveAgentIcon className={cn("w-6 h-6", agents[activeAgent].color)} />
              </div>
              <p className="text-lg md:text-xl font-medium text-center">
                <span className={cn("font-bold", agents[activeAgent].color)}>
                  {agents[activeAgent].name}
                </span>
                {" "}
                <span className="text-muted-foreground">{currentMessage}</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar - SMOOTH */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Analysis Progress</span>
            <span className="text-foreground font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-official to-primary"
              style={{
                width: `${progress}%`,
                backgroundSize: '200% 100%'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white/30 to-transparent"
              style={{ left: `${Math.max(0, progress - 10)}%` }}
            />
          </div>
        </div>

        {/* Agent Activity Logs */}
        <div className="glass-effect-strong rounded-2xl border border-border/50 overflow-hidden shadow-xl">
          <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Agent Activity Logs
            </h3>
          </div>
          <div className="p-6 max-h-80 overflow-y-auto custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Waiting for agents to start...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors",
                      log.type === 'success' && "bg-verified/10",
                      log.type === 'warning' && "bg-unverified/10",
                      log.type === 'info' && "bg-muted/30"
                    )}
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-foreground">
                          {log.agent}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};