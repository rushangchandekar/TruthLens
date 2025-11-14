import { Network, Gauge, TrendingUp, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Network,
    title: "Multi-Agent System",
    description: "Our system utilizes multiple specialized AI agents working in concert. Each agent tackles a specific part of the investigation—from data sourcing to bias detection.",
    color: "from-official to-official/80",
    iconColor: "text-official",
    gradient: "from-official/10 to-official/5"
  },
  {
    icon: Gauge,
    title: "Comprehensive Analysis",
    description: "Go beyond simple fact-checking. Receive detailed reports with source citations, sentiment analysis, and an evaluation of evidence quality.",
    color: "from-social to-social/80",
    iconColor: "text-social",
    gradient: "from-social/10 to-social/5"
  },
  {
    icon: TrendingUp,
    title: "Trust Score",
    description: "Every investigation culminates in a clear, easy-to-understand Trust Score, giving you an at-a-glance assessment of a claim's credibility.",
    color: "from-verified to-verified/80",
    iconColor: "text-verified",
    gradient: "from-verified/10 to-verified/5"
  }
];

export const Features = () => {
  const headerAnimation = useScrollAnimation(0.2);
  const cardsAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.2);
  const statsAnimation = useScrollAnimation(0.2);

  return (
    <section id="features" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 gradient-orb gradient-orb-primary opacity-10" />
      <div className="absolute bottom-20 left-10 w-80 h-80 gradient-orb gradient-orb-official opacity-10" />

      <div className="container-custom relative z-10">
        {/* Section Header - Animated */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-12 md:mb-20 space-y-4 md:space-y-6 transition-all duration-700 ${
            headerAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gradient-verified">
              Powered by AI Agents
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4">
            Uncover the Truth with{" "}
            <span className="text-gradient block sm:inline mt-2 sm:mt-0">
              AI-Powered Agents
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            TruthLens deploys a team of autonomous AI agents to rigorously research, analyze, and verify claims from multiple angles, delivering a comprehensive truth score and detailed report.
          </p>
        </div>

        {/* Feature Cards - Animated */}
        <div 
          ref={cardsAnimation.ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative transition-all duration-700 ${
                cardsAnimation.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: cardsAnimation.isVisible ? `${index * 100}ms` : '0ms' 
              }}
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
              
              {/* Main Card */}
              <div className="relative h-full p-6 sm:p-8 rounded-2xl glass-effect border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {/* Icon Container with Gradient Background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-md`} />
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.iconColor}`} strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner Element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section - Animated */}
        <div 
          ref={ctaAnimation.ref}
          className={`mt-16 md:mt-20 text-center transition-all duration-700 ${
            ctaAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-8 rounded-2xl glass-effect-strong border border-border/50 shadow-xl max-w-3xl mx-auto">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Ready to verify your first claim?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Start investigating with AI-powered fact-checking today
              </p>
            </div>
            <button
              onClick={() => {
                const heroSection = document.querySelector('section');
                heroSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-gradient btn-lg whitespace-nowrap shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35"
            >
              Try It Now
            </button>
          </div>
        </div>

        {/* Feature Stats - Animated */}
        <div 
          ref={statsAnimation.ref}
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 md:mt-16 transition-all duration-700 ${
            statsAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { label: "AI Agents", value: "12+", description: "Working in parallel" },
            { label: "Sources", value: "50+", description: "Cross-referenced" },
            { label: "Analysis Time", value: "< 30s", description: "Average speed" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl glass-effect border border-border/30 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};