import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Who can use Pariwar+?",
    answer: "Pariwar+ is designed for families of all sizes. The account head (usually a parent or guardian) can create an account and add family members including children, elderly parents, and spouses. Each member gets appropriate access based on their role."
  },
  {
    question: "Is my family's health data secure and private?",
    answer: "Absolutely! We use enterprise-grade encryption to protect your data. All information is stored securely and only accessible by authorized family members. We comply with healthcare privacy standards and never share your data with third parties."
  },
  {
    question: "Can I use this to manage my elderly parents' health remotely?",
    answer: "Yes! Pariwar+ is perfect for caring for elderly family members remotely. You can set up their profiles, manage their medicine reminders, upload their medical documents, and generate emergency cards that they can carry."
  },
  {
    question: "How do the medicine reminders work?",
    answer: "You can set up customized reminders for each family member with specific times, dosages, and frequencies. Reminders can be sent via email, SMS, or through the app. You can also mark medicines as taken and track compliance."
  },
  {
    question: "What types of medical documents can I upload?",
    answer: "You can upload prescriptions, lab reports, X-rays, MRI scans, vaccination records, insurance cards, and any other medical documents in PDF, JPG, or PNG format. All documents are automatically organized by date and type."
  },
  {
    question: "How does the emergency QR card work?",
    answer: "The emergency QR card contains critical health information like allergies, current medications, emergency contacts, and medical conditions. In an emergency, medical professionals can scan the QR code to quickly access this vital information."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Currently, Pariwar+ is available as a responsive web application that works perfectly on all devices including smartphones and tablets. A dedicated mobile app is in development and will be available soon."
  },
  {
    question: "How much does Pariwar+ cost?",
    answer: "We offer a free tier for basic family health management. Premium plans with advanced features like unlimited document storage, SMS reminders, and priority support start at just ₹299 per month for unlimited family members."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-feature rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-card rounded-3xl p-8 shadow-card border border-border/50">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-soft hover:shadow-card transform hover:scale-105 transition-all duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;