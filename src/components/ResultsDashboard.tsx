import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

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

const getVerdictInfo = (verdict: string) => {
  const normalized = verdict.toLowerCase();
  if (normalized.includes("true")) {
    return {
      label: "Largely True",
      color: "text-verified",
      bgColor: "bg-gradient-to-br from-verified/20 to-official/20"
    };
  }
  if (normalized.includes("false")) {
    return {
      label: "False",
      color: "text-false",
      bgColor: "bg-gradient-to-br from-false/20 to-destructive/20"
    };
  }
  return {
    label: "Unverified",
    color: "text-unverified",
    bgColor: "bg-gradient-to-br from-unverified/20 to-social/20"
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-official flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold text-foreground">TruthLens</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-foreground/80" asChild>
              <Link to="/saved">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Results
              </Link>
            </Button>
            <Link to="/profile">
              <Avatar className="w-9 h-9 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarFallback className="bg-gradient-to-br from-primary to-official text-white text-sm">
                  U
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
        {/* Claim Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
        >
          <div className="text-sm text-muted-foreground mb-2">Claim</div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            "{data.query}"
          </h1>
        </motion.div>

        {/* Verdict Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${verdictInfo.bgColor} backdrop-blur-sm border border-border/30 rounded-2xl p-8 space-y-6`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              {/* Verdict Badge */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm">
                  <div className={`w-8 h-8 rounded-full ${verdictInfo.color.replace('text-', 'bg-')}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Verdict</div>
                  <div className={`text-4xl font-bold ${verdictInfo.color}`}>
                    {verdictInfo.label}
                  </div>
                </div>
              </div>

              {/* AI Synthesis */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-social" />
                  <span className="text-sm font-medium text-foreground">AI Synthesis</span>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  {data.synthesis_explanation}
                </p>
              </div>
            </div>

            {/* Right side - Save button and Confidence */}
            <div className="flex flex-col items-end gap-6 ml-6">
              <Button variant="outline" className="bg-background/50 backdrop-blur-sm border-border/50">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>

              <div className="text-right space-y-2">
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="text-3xl font-bold text-verified">{confidenceValue}%</div>
                <Progress value={confidenceValue} className="w-32 h-2" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Evidence Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Supporting Evidence */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <ThumbsUp className="h-6 w-6 text-verified" />
              <h2 className="text-2xl font-semibold text-foreground">Supporting Evidence</h2>
            </div>

            <div className="space-y-3">
              {data.evidence.official.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl p-5 space-y-3"
                >
                  <p className="text-foreground/90 leading-relaxed">
                    "{item.snippet}"
                  </p>
                  <a href="#" className="text-sm text-official hover:underline block">
                    {item.title}
                  </a>
                </motion.div>
              ))}
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
              <ThumbsDown className="h-6 w-6 text-false" />
              <h2 className="text-2xl font-semibold text-foreground">Contradictory Evidence</h2>
            </div>

            <div className="space-y-3">
              {data.evidence.social.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl p-5 space-y-3"
                >
                  <p className="text-foreground/90 leading-relaxed">
                    "{item.snippet}"
                  </p>
                  <a href="#" className="text-sm text-unverified hover:underline block">
                    {item.title} ({item.type})
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
