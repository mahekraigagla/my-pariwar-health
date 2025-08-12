import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-family-health.jpg";
import Navbar from "./Navbar";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, navigate to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, navigate to auth page
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <Navbar />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 animate-pulse">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white shadow-glow">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">AI Powered Health Management</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Pariwar+
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 font-semibold">
                Your Family's Smart Health Buddy
              </p>
              <p className="text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Track medicines, appointments, and reports for your whole family from one place. 
                Organize medical history, set smart reminders, and generate emergency health cards.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group h-14 px-8 text-lg font-semibold" onClick={handleGetStarted}>
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-14 px-8 text-lg font-semibold"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-10 text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-medium">For Whole Family</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-gradient-card rounded-3xl p-10 shadow-2xl">
              <img 
                src={heroImage} 
                alt="Family Health Management" 
                className="w-full h-auto rounded-3xl shadow-card"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-3xl p-6 shadow-glow animate-bounce">
                <Heart className="w-8 h-8 text-primary" />
                <p className="text-sm font-semibold mt-2">Health Alerts</p>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl p-6 shadow-glow animate-bounce delay-1000">
                <Shield className="w-8 h-8 text-secondary" />
                <p className="text-sm font-semibold mt-2">Secure Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;