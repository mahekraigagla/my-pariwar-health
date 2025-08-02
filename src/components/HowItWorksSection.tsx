import { UserPlus, Users, Upload, Shield } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up as the family head and set up your secure account with just a few details."
  },
  {
    icon: Users,
    step: "02", 
    title: "Add Family Members",
    description: "Add profiles for each family member with their basic information and health details."
  },
  {
    icon: Upload,
    step: "03",
    title: "Upload & Set Reminders",
    description: "Upload medical documents, set medicine reminders, and organize health records."
  },
  {
    icon: Shield,
    step: "04",
    title: "Access Emergency Cards",
    description: "Generate and access emergency health cards with QR codes anytime, anywhere."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            How Pariwar+ Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started with your family's health management in just four simple steps. 
            No technical expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-secondary transform translate-y-1 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-secondary rounded-full"></div>
                </div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-2 border border-border/50">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-gradient-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-soft">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-feature mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Pariwar+ for their health management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-soft hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                Start Free Trial
              </button>
              <button className="border border-border bg-background text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-muted transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;