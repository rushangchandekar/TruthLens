import { Quote, Star, CheckCircle2, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: "TruthLens has become an indispensable tool for my journalistic research. The depth of analysis and source verification saves me hours of work and provides a level of confidence I couldn't achieve alone.",
    author: "David Chen",
    role: "Investigative Journalist",
    avatar: "DC",
    rating: 5,
    verified: true,
    gradient: "from-official to-official/80"
  },
  {
    quote: "As a policy analyst, misinformation is a constant challenge. TruthLens provides the robust, evidence-based reports we need to make informed decisions quickly and effectively.",
    author: "Maria Rodriguez",
    role: "Policy Analyst",
    avatar: "MR",
    rating: 5,
    verified: true,
    gradient: "from-social to-social/80"
  },
  {
    quote: "The multi-agent system is brilliant! It's like having an entire research team at your fingertips. The Trust Score feature gives me immediate clarity on what to trust and what to question.",
    author: "James Williams",
    role: "Academic Researcher",
    avatar: "JW",
    rating: 5,
    verified: true,
    gradient: "from-verified to-verified/80"
  }
];

export const Testimonials = () => {
  const headerAnimation = useScrollAnimation(0.2);
  const cardsAnimation = useScrollAnimation(0.1);
  const statsAnimation = useScrollAnimation(0.2);
  const ctaAnimation = useScrollAnimation(0.3);

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-40 left-20 w-96 h-96 gradient-orb gradient-orb-official opacity-10 animate-float" />
      <div className="absolute bottom-20 right-20 w-80 h-80 gradient-orb gradient-orb-primary opacity-10 animate-float" style={{ animationDelay: '3s' }} />
      
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
              Testimonials
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4">
            Trusted by{" "}
            <span className="text-gradient block sm:inline mt-2 sm:mt-0">
              Professionals Worldwide
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands of researchers, journalists, and analysts who rely on TruthLens for accurate fact verification
          </p>
        </div>

        {/* Testimonial Cards - Animated */}
        <div 
          ref={cardsAnimation.ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
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
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${testimonial.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
              
              {/* Main Card */}
              <div className="relative h-full p-6 sm:p-8 rounded-2xl glass-effect-strong border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 sm:w-20 sm:h-20 text-primary" fill="currentColor" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="flex-1 mb-6 relative z-10">
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Avatar with Gradient */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-full blur-md opacity-50`} />
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center ring-2 ring-background shadow-lg`}>
                      <span className="text-white font-bold text-sm sm:text-base">
                        {testimonial.avatar}
                      </span>
                    </div>
                  </div>

                  {/* Author Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        {testimonial.author}
                      </h4>
                      {testimonial.verified && (
                        <CheckCircle2 className="w-4 h-4 text-verified fill-verified/20" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Animated */}
        <div 
          ref={ctaAnimation.ref}
          className={`mt-12 md:mt-16 text-center transition-all duration-700 ${
            ctaAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-8 rounded-2xl glass-effect-strong border border-border/50 shadow-xl max-w-3xl mx-auto">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Join Our Community
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Be part of the fight against misinformation
              </p>
            </div>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-gradient btn-lg whitespace-nowrap shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};