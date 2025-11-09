import { Network, Gauge, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Multi-Agent System",
    description: "Our system utilizes multiple specialized AI agents working in concert. Each agent tackles a specific part of the investigation—from data sourcing to bias detection.",
    color: "text-official"
  },
  {
    icon: Gauge,
    title: "Comprehensive Analysis",
    description: "Go beyond simple fact-checking. Receive detailed reports with source citations, sentiment analysis, and an evaluation of evidence quality.",
    color: "text-social"
  },
  {
    icon: TrendingUp,
    title: "Trust Score",
    description: "Every investigation culminates in a clear, easy-to-understand Trust Score, giving you an at-a-glance assessment of a claim's credibility.",
    color: "text-verified"
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-6 bg-background relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Uncover the Truth with AI-Powered Agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            TruthLens deploys a team of autonomous AI agents to rigorously research, analyze, and verify claims from multiple angles, delivering a comprehensive truth score and detailed report.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-border transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
