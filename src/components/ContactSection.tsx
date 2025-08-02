import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to Transform Your Family's Health Management?
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Join thousands of families who trust Pariwar+ for comprehensive health management. 
                Get started today and experience the peace of mind that comes with organized healthcare.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-white/80">support@pariwarplus.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Phone Support</p>
                  <p className="text-white/80">+91 8080 808 080</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Support Hours</p>
                  <p className="text-white/80">24/7 Emergency Support Available</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-white/80">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  placeholder="Tell us about your family's health management needs..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-3"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Support Center</a>
          </div>
          <p className="text-white/60 mt-4">
            © 2024 Pariwar+. All rights reserved. Built with ❤️ for families in India.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;