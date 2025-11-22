import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Sparkles,
  Shield,
  Share2,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
  Search,
  Bot,
  Brain,
  MessageSquare,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";

interface Evidence {
  title: string;
  type: string;
  snippet: string;
  url?: string;
  source_credibility?: number;
  date?: string;
}

interface AgentOutput {
  agent_name: string;
  role: string;
  stance: "supporting" | "opposing" | "neutral";
  analysis: string;
  confidence: number;
  evidence: string[];
  sources: string[];
  timestamp: string;
}

interface ResultsData {
  query: string;
  verdict: string;
  confidence_level: string;
  synthesis_explanation: string;
  debate_rounds: number;
  agent_outputs?: AgentOutput[];  // Added agent outputs
  evidence: {
    official: Evidence[];
    social: Evidence[];
  };
  metadata?: {
    analyzed_at?: string;
    duration?: number;
    sources_checked?: number;
    agents_involved?: number;
  };
}

interface ResultsDashboardProps {
  data: ResultsData;
  onReset: () => void;
}

const getVerdictInfo = (verdict: string) => {
  const normalized = verdict.toLowerCase();
  if (normalized.includes("true") || normalized.includes("verified")) {
    return {
      label: "Verified",
      icon: CheckCircle2,
      color: "text-verified",
      bgGradient: "from-verified/20 to-verified/5",
      borderColor: "border-verified/50",
      description: "This claim is supported by credible evidence"
    };
  }
  if (normalized.includes("false") || normalized.includes("misleading")) {
    return {
      label: "False",
      icon: XCircle,
      color: "text-false",
      bgGradient: "from-false/20 to-false/5",
      borderColor: "border-false/50",
      description: "This claim is contradicted by evidence"
    };
  }
  return {
    label: "Unverified",
    icon: AlertCircle,
    color: "text-unverified",
    bgGradient: "from-unverified/20 to-unverified/5",
    borderColor: "border-unverified/50",
    description: "Insufficient evidence to verify this claim"
  };
};

const getConfidenceValue = (level: string) => {
  // Check for numeric percentage (e.g. "87%")
  const match = level.match(/(\d+)/);
  if (match) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val)) return val;
  }

  // Fallback for legacy text values
  const normalized = level.toLowerCase();
  if (normalized.includes("high")) return 95;
  if (normalized.includes("medium")) return 65;
  if (normalized.includes("low")) return 35;
  return 50; // Default
};

const getAgentIcon = (agentName: string) => {
  const icons: Record<string, any> = {
    FactChecker: Shield,
    Counterpoint: AlertCircle,
    SocialPulse: TrendingUp,
    BiasDetector: Brain,
    ExpertPanel: Users,
  };
  return icons[agentName] || Bot;
};

const getStanceInfo = (stance: string) => {
  switch (stance) {
    case "supporting":
      return {
        label: "Supporting",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950",
        border: "border-green-200 dark:border-green-800",
        icon: ThumbsUp
      };
    case "opposing":
      return {
        label: "Opposing",
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-950",
        border: "border-red-200 dark:border-red-800",
        icon: ThumbsDown
      };
    default:
      return {
        label: "Neutral",
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-950",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: MessageSquare
      };
  }
};

export const ResultsDashboard = ({ data, onReset }: ResultsDashboardProps) => {
  const verdictInfo = getVerdictInfo(data.verdict);
  const confidenceValue = getConfidenceValue(data.confidence_level);
  const [expandedEvidence, setExpandedEvidence] = useState<string[]>([]);
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'evidence'>('agents');

  const VerdictIcon = verdictInfo.icon;

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAgent = (agentName: string) => {
    setExpandedAgents(prev =>
      prev.includes(agentName) ? prev.filter(i => i !== agentName) : [...prev, agentName]
    );
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TruthLens Fact Check',
        text: `Claim: ${data.query}\nVerdict: ${verdictInfo.label}`,
      });
    }
  };

  const handleExport = () => {
    console.log('Exporting report...');
  };

  // Calculate agent statistics
  const agentStats = data.agent_outputs ? {
    supporting: data.agent_outputs.filter(a => a.stance === "supporting").length,
    opposing: data.agent_outputs.filter(a => a.stance === "opposing").length,
    neutral: data.agent_outputs.filter(a => a.stance === "neutral").length,
    avgConfidence: Math.round(
      data.agent_outputs.reduce((sum, a) => sum + a.confidence, 0) / data.agent_outputs.length * 100
    )
  } : null;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-8 pt-24">
        {/* Claim Card */}
        {/* Claim Card */}
        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s" }}>
          <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Analyzed Claim
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading leading-tight">
                  "{data.query}"
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-current text-primary")} />
              </Button>
            </div>
          </div>
        </div>

        {/* Verdict Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Main Verdict Card */}
          <div className={cn(
            "lg:col-span-2 bg-card/40 backdrop-blur-sm rounded-2xl border-2 p-8",
            verdictInfo.borderColor
          )}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Trust Score Circle */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 * (1 - confidenceValue / 100)}
                      className={verdictInfo.color}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={cn("text-5xl font-bold", verdictInfo.color)}>
                      {confidenceValue}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>

              {/* Verdict Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-3 uppercase">
                    Verdict
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br",
                      verdictInfo.bgGradient
                    )}>
                      <VerdictIcon className={cn("w-10 h-10", verdictInfo.color)} />
                    </div>
                    <div>
                      <div className={cn("text-4xl font-bold", verdictInfo.color)}>
                        {verdictInfo.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {verdictInfo.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className={cn(
                  "p-4 rounded-xl border bg-gradient-to-br",
                  verdictInfo.bgGradient,
                  verdictInfo.borderColor
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold">AI Synthesis</span>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {data.synthesis_explanation}
                  </p>
                </div>

                {/* Agent Stats - NEW */}
                {agentStats && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="text-2xl font-bold text-green-600">{agentStats.supporting}</div>
                      <div className="text-xs text-muted-foreground">Supporting</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600">{agentStats.opposing}</div>
                      <div className="text-xs text-muted-foreground">Opposing</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                      <div className="text-2xl font-bold text-yellow-600">{agentStats.neutral}</div>
                      <div className="text-xs text-muted-foreground">Neutral</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 p-6 space-y-3">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Actions
              </h3>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={handleSave}
                variant={isSaved ? "default" : "outline"}
                className="w-full justify-start"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaved ? 'Saved' : 'Save for Later'}
              </Button>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="font-bold text-foreground mb-4">
                Confidence Level
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-bold">{data.confidence_level}</span>
                </div>
                <Progress value={confidenceValue} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on {data.evidence.official.length + data.evidence.social.length} sources
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation - NEW */}
        <div className="flex items-center gap-2 border-b border-border/50">
          <button
            onClick={() => setActiveTab('agents')}
            className={cn(
              "px-6 py-3 font-semibold transition-all relative",
              activeTab === 'agents'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span>Agent Analysis</span>
              {data.agent_outputs && (
                <Badge variant="secondary" className="ml-1">
                  {data.agent_outputs.length}
                </Badge>
              )}
            </div>
            {activeTab === 'agents' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={cn(
              "px-6 py-3 font-semibold transition-all relative",
              activeTab === 'evidence'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Evidence</span>
              <Badge variant="secondary" className="ml-1">
                {data.evidence.official.length + data.evidence.social.length}
              </Badge>
            </div>
            {activeTab === 'evidence' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* AGENT ANALYSIS SECTION - NEW */}
        {activeTab === 'agents' && data.agent_outputs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Agent Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  {data.agent_outputs.length} specialized agents analyzed this claim
                </p>
              </div>
            </div>

            {data.agent_outputs.map((agent, index) => {
              const AgentIcon = getAgentIcon(agent.agent_name);
              const stanceInfo = getStanceInfo(agent.stance);
              const StanceIcon = stanceInfo.icon;
              const isExpanded = expandedAgents.includes(agent.agent_name);

              return (
                <motion.div
                  key={agent.agent_name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "bg-card/40 backdrop-blur-sm rounded-xl border-2 p-6 transition-all",
                    stanceInfo.border
                  )}
                >
                  {/* Agent Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-14 h-14 bg-gradient-to-br from-primary to-official">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white">
                        <AgentIcon className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{agent.agent_name}</h3>
                        <Badge className={cn(stanceInfo.bg, stanceInfo.color, "border", stanceInfo.border)}>
                          <StanceIcon className="w-3 h-3 mr-1" />
                          {stanceInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{agent.role}</p>

                      {/* Confidence Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress
                            value={agent.confidence * 100}
                            className="h-2"
                          />
                        </div>
                        <span className="text-sm font-bold min-w-[50px] text-right">
                          {Math.round(agent.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAgent(agent.agent_name)}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                  </div>

                  {/* Agent Analysis */}
                  <div className={cn(
                    "p-4 rounded-lg mb-4",
                    stanceInfo.bg
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-semibold">Analysis</span>
                    </div>
                    <p className={cn(
                      "text-foreground/90 text-sm leading-relaxed",
                      !isExpanded && "line-clamp-3"
                    )}>
                      {agent.analysis}
                    </p>
                  </div>

                  {/* Evidence & Sources - Show when expanded */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-border/30"
                    >
                      {/* Evidence */}
                      {agent.evidence.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            Key Evidence Points
                          </h4>
                          <ul className="space-y-2">
                            {agent.evidence.map((item, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-foreground/80">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Sources */}
                      {agent.sources.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-primary" />
                            Sources Referenced
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.sources.map((source, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Analyzed at {new Date(agent.timestamp).toLocaleTimeString()}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* EVIDENCE SECTION - Existing */}
        {activeTab === 'evidence' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Supporting Evidence */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-verified/20">
                  <ThumbsUp className="h-6 w-6 text-verified" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Supporting Evidence</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.evidence.official.length} sources found
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data.evidence.official.map((item, index) => {
                  const evidenceId = `official-${index}`;
                  const isExpanded = expandedEvidence.includes(evidenceId);

                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-card/40 backdrop-blur-sm rounded-xl border border-verified/30 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-verified" />
                            <span className="text-xs font-semibold text-verified uppercase">
                              Verified Source
                            </span>
                          </div>
                          <h3 className="font-bold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEvidence(evidenceId)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>

                      <p className={cn(
                        "text-foreground/90 text-sm leading-relaxed",
                        !isExpanded && "line-clamp-3"
                      )}>
                        "{item.snippet}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">
                          {item.type}
                        </span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-verified hover:underline flex items-center gap-1"
                          >
                            View Source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contradictory Evidence */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-false/20">
                  <ThumbsDown className="h-6 w-6 text-false" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Contradictory Evidence</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.evidence.social.length} sources found
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data.evidence.social.map((item, index) => {
                  const evidenceId = `social-${index}`;
                  const isExpanded = expandedEvidence.includes(evidenceId);

                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-card/40 backdrop-blur-sm rounded-xl border border-unverified/30 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-unverified" />
                            <span className="text-xs font-semibold text-unverified uppercase">
                              Contradictory
                            </span>
                          </div>
                          <h3 className="font-bold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEvidence(evidenceId)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>

                      <p className={cn(
                        "text-foreground/90 text-sm leading-relaxed",
                        !isExpanded && "line-clamp-3"
                      )}>
                        "{item.snippet}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">
                          {item.type}
                        </span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-unverified hover:underline flex items-center gap-1"
                          >
                            View Source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-3">
            Want to verify another claim?
          </h3>
          <p className="text-muted-foreground mb-6">
            Use TruthLens to get instant, AI-powered fact-checking
          </p>
          <Button
            onClick={onReset}
            size="lg"
            className="bg-gradient-to-r from-primary to-official hover:opacity-90 text-white"
          >
            <Search className="w-5 h-5 mr-2" />
            Analyze New Claim
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
