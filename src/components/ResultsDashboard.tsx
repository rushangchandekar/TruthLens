import { motion } from "framer-motion";
import { FileText, TrendingUp, ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Evidence {
  title: string;
  type: string;
  snippet: string;
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
}

interface ResultsDashboardProps {
  data: ResultsData;
  onReset: () => void;
}

const getVerdictColor = (verdict: string) => {
  const normalized = verdict.toLowerCase();
  if (normalized.includes("true") || normalized.includes("verified")) {
    return {
      bg: "bg-verified/10",
      border: "border-verified/30",
      text: "text-verified",
      icon: CheckCircle2
    };
  }
  if (normalized.includes("false") || normalized.includes("debunked")) {
    return {
      bg: "bg-false/10",
      border: "border-false/30",
      text: "text-false",
      icon: XCircle
    };
  }
  return {
    bg: "bg-unverified/10",
    border: "border-unverified/30",
    text: "text-unverified",
    icon: AlertTriangle
  };
};

const getConfidenceWidth = (level: string) => {
  const normalized = level.toLowerCase();
  if (normalized === "high") return "w-full";
  if (normalized === "medium") return "w-2/3";
  return "w-1/3";
};

export const ResultsDashboard = ({ data, onReset }: ResultsDashboardProps) => {
  const verdictStyle = getVerdictColor(data.verdict);
  const VerdictIcon = verdictStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12 px-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onReset}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Investigation
          </Button>
          <div className="text-sm text-muted-foreground">
            Debate Rounds: {data.debate_rounds}
          </div>
        </div>

        {/* Query Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6"
        >
          <div className="text-sm text-muted-foreground mb-2">Investigating Claim</div>
          <h1 className="text-2xl md:text-3xl font-bold">{data.query}</h1>
        </motion.div>

        {/* Verdict Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${verdictStyle.bg} ${verdictStyle.border} border backdrop-blur-xl rounded-2xl p-8 space-y-6`}
        >
          {/* Verdict Badge */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${verdictStyle.bg} ${verdictStyle.border} border`}>
              <VerdictIcon className={`h-8 w-8 ${verdictStyle.text}`} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Verdict</div>
              <div className={`text-3xl font-bold ${verdictStyle.text}`}>
                {data.verdict}
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence Level</span>
              <span className="font-medium">{data.confidence_level}</span>
            </div>
            <div className="h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${verdictStyle.bg} ${verdictStyle.border} border-r-2 transition-all ${getConfidenceWidth(
                  data.confidence_level
                )}`}
              />
            </div>
          </div>

          {/* AI Synthesis */}
          <div className="pt-4 border-t border-border/30">
            <div className="text-sm text-muted-foreground mb-2">AI Synthesis</div>
            <p className="text-foreground leading-relaxed">
              {data.synthesis_explanation}
            </p>
          </div>
        </motion.div>

        {/* Dual-Stream Evidence */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Official Evidence */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-official/10 border border-official/30">
                <FileText className="h-5 w-5 text-official" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Fact-Finder Evidence</h2>
                <p className="text-sm text-muted-foreground">
                  Official sources & research
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {data.evidence.official.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card/30 backdrop-blur-xl border border-official/20 rounded-xl p-4 hover:border-official/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-official transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-md bg-official/10 text-official border border-official/20">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.snippet}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Evidence */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-social/10 border border-social/30">
                <TrendingUp className="h-5 w-5 text-social" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Pattern-Detector Signals</h2>
                <p className="text-sm text-muted-foreground">
                  Social sentiment & trends
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {data.evidence.social.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card/30 backdrop-blur-xl border border-social/20 rounded-xl p-4 hover:border-social/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-social transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-md bg-social/10 text-social border border-social/20">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.snippet}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
