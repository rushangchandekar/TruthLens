import { Twitter, Linkedin, Github, Mail, Shield, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const contentAnimation = useScrollAnimation(0.1);
  const bottomAnimation = useScrollAnimation(0.2);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast({
      title: "Successfully subscribed! 🎉",
      description: "You'll receive our latest updates and insights.",
    });
    
    setEmail("");
    setIsSubscribing(false);
  };

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Use Cases", href: "#use-cases" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Guides & Tutorials", href: "#" },
      { name: "Blog", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Press Kit", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      icon: Twitter, 
      href: "https://twitter.com", 
      color: "hover:bg-[#1DA1F2] hover:text-white" 
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      href: "https://linkedin.com", 
      color: "hover:bg-[#0A66C2] hover:text-white" 
    },
    { 
      name: "GitHub", 
      icon: Github, 
      href: "https://github.com", 
      color: "hover:bg-[#333] hover:text-white" 
    },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-orb gradient-orb-primary opacity-5" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 gradient-orb gradient-orb-official opacity-5" />

      <div className="container-custom relative z-10">
        {/* Main Footer Content - Animated */}
        <div 
          ref={contentAnimation.ref}
          className={`py-12 md:py-16 lg:py-20 transition-all duration-700 ${
            contentAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <Link
                to="/"
                className="flex items-center gap-2.5 group w-fit"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-official rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-official flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  TruthLens
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                AI-powered fact verification platform that helps you discover truth through multi-agent analysis and comprehensive source checking.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl glass-effect border border-border/50 flex items-center justify-center transition-all duration-300 ${social.color} group`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 text-foreground group-hover:text-current transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-8">
              {/* Product */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-foreground mb-4">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates on AI-powered fact-checking.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass-effect border-border/50 focus:border-primary/50"
                    disabled={isSubscribing}
                  />
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={isSubscribing || !email.trim()}
                >
                  {isSubscribing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Animated */}
        <div 
          ref={bottomAnimation.ref}
          className={`border-t border-border/50 py-6 transition-all duration-700 ${
            bottomAnimation.isVisible 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2024 TruthLens.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for truth seekers
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 sm:gap-6">
              {footerLinks.legal.slice(0, 2).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};