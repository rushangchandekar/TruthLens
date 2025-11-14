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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Evidence {
  title: string;
  type: string;
  snippet: string;
  url?: string;
  source_credibility?: number;
  date?: string;
}

interface ResultsData {
  query: string;
  verdict: string;
  confidence_level: string;
  synthesis_explanation: string;
  debate_rounds: number;
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
  const normalized = level.toLowerCase();
  if (normalized === "high") return 95;
  if (normalized === "medium") return 65;
  return 35;
};

export const ResultsDashboard = ({ data, onReset }: ResultsDashboardProps) => {
  const verdictInfo = getVerdictInfo(data.verdict);
  const confidenceValue = getConfidenceValue(data.confidence_level);
  const [expandedEvidence, setExpandedEvidence] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const VerdictIcon = verdictInfo.icon;

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-official flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TruthLens</span>
          </Link>

          <div className="flex items-center gap-3">
            
            <Link to="/profile">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white text-sm">
                  U
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-8">
        {/* Claim Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground uppercase">
                  Analyzed Claim
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                "{data.query}"
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
            >
              <Bookmark className={cn("w-5 h-5", isSaved && "fill-current text-primary")} />
            </Button>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm font-bold text-foreground">~30s</div>
              <div className="text-xs text-muted-foreground">Analysis Time</div>
            </div>
            <div className="text-center">
              <Globe className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm font-bold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground">Sources</div>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm font-bold text-foreground">4</div>
              <div className="text-xs text-muted-foreground">AI Agents</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm font-bold text-foreground">{data.debate_rounds}</div>
              <div className="text-xs text-muted-foreground">Debates</div>
            </div>
          </div>
        </motion.div>

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
                    <span className="text-sm font-bold">AI Analysis</span>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {data.synthesis_explanation}
                  </p>
                </div>
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

        {/* Evidence Section */}
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