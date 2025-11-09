const testimonials = [
  {
    quote: "TruthLens has become an indispensable tool for my journalistic research. The depth of analysis and source verification saves me hours of work and provides a level of confidence I couldn't achieve alone.",
    author: "David Chen",
    role: "Investigative Journalist",
    avatar: "DC"
  },
  {
    quote: "As a policy analyst, misinformation is a constant challenge. TruthLens provides the robust, evidence-based reports we need to make informed decisions quickly and effectively.",
    author: "Maria Rodriguez",
    role: "Policy Analyst",
    avatar: "MR"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-background/50 relative">
      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-official/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
          Trusted by Researchers & Professionals
        </h2>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-border transition-all"
            >
              <p className="text-foreground/90 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-official flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
