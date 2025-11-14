import { Search, Brain, FileCheck, TrendingUp, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Submit Your Claim",
    description: "Enter any claim you want to verify. Our AI immediately begins multi-source investigation.",
    color: "from-official/20 to-official/5",
    iconColor: "text-official"
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Agents Analyze",
    description: "12+ specialized AI agents work in parallel, checking facts across 50+ trusted sources.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Cross-Reference Data",
    description: "Evidence is cross-checked, bias-analyzed, and credibility-scored using advanced algorithms.",
    color: "from-verified/20 to-verified/5",
    iconColor: "text-verified"
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Get Your Report",
    description: "Receive a comprehensive report with Trust Score, sources, and detailed analysis in under 30 seconds.",
    color: "from-social/20 to-social/5",
    iconColor: "text-social"
  }
];

export const HowItWorks = () => {
  const headerAnimation = useScrollAnimation(0.2);
  const stepsAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.3);

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden bg-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-orb gradient-orb-primary opacity-5" />

      <div className="container-custom relative z-10">
        {/* Section Header - Animated */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-16 md:mb-20 space-y-6 transition-all duration-700 ${
            headerAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gradient-verified">
              How It Works
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4">
            From Claim to{" "}
            <span className="text-gradient">Verification</span>
            <br className="hidden sm:block" />
            in 4 Simple Steps
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Our AI-powered system works behind the scenes to deliver accurate, 
            evidence-based verification in real-time
          </p>
        </div>

        {/* Steps - Animated */}
        <div 
          ref={stepsAnimation.ref}
          className="relative max-w-6xl mx-auto"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative group transition-all duration-700 ${
                  stepsAnimation.isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: stepsAnimation.isVisible ? `${index * 150}ms` : '0ms' 
                }}
              >
                {/* Card */}
                <div className="relative h-full p-6 rounded-2xl glass-effect border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-official flex items-center justify-center shadow-lg text-white font-bold text-sm rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Arrow (not on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-primary/30">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};