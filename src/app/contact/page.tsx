import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export const metadata = {
  title: "Contact Us | Femazon",
  description: "Get in touch with the Femazon team. We're here to help with your orders, styling sessions, and general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-primary">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-text-main">
            We're here to help
          </h1>
          <p className="font-sans text-text-muted text-[15px] max-w-xl mx-auto">
            Have a question about your order, our services, or need styling advice? Our customer experience team is available and ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-2xl text-text-main mb-6">Contact Information</h2>
              <div className="space-y-8">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-[15px]">Email Us</h3>
                    <p className="text-text-muted text-sm mt-1 mb-2">Our team typically replies within 24 hours.</p>
                    <a href="mailto:support@femazon.com" className="text-sm font-medium hover:text-primary transition-colors">support@femazon.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-[15px]">Call Us</h3>
                    <p className="text-text-muted text-sm mt-1 mb-2">Mon-Fri from 9am to 6pm IST.</p>
                    <a href="tel:+9118001234567" className="text-sm font-medium hover:text-primary transition-colors">1800 123 4567</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-[15px]">Headquarters</h3>
                    <p className="text-text-muted text-sm mt-1 leading-relaxed">
                      Femazon Tech Pvt Ltd.<br />
                      123 Fashion Street, Tech Park<br />
                      Bengaluru, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-primary" size={24} />
                <h3 className="font-serif text-xl text-text-main">Frequent Questions</h3>
              </div>
              <p className="text-sm text-text-muted mb-6">
                Before reaching out, you might find your answer in our help center. We've compiled responses to our most common inquiries.
              </p>
              <Link 
                href="/faq"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-main hover:text-primary transition-colors"
              >
                Browse FAQ &rarr;
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-zinc-200 shadow-sm">
            <h2 className="font-serif text-2xl text-text-main mb-8">Send a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-[11px] font-bold uppercase tracking-widest text-text-main ml-1">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full bg-surface border border-zinc-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-[11px] font-bold uppercase tracking-widest text-text-main ml-1">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full bg-surface border border-zinc-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-text-main ml-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-surface border border-zinc-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-widest text-text-main ml-1">Subject</label>
                <select 
                  id="subject" 
                  className="w-full bg-surface border border-zinc-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option value="order">Where is my order?</option>
                  <option value="return">Return or Refund</option>
                  <option value="service">Booking a Service</option>
                  <option value="wardrobe">AI Wardrobe Help</option>
                  <option value="vendor">Selling on Femazon</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-widest text-text-main ml-1">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-surface border border-zinc-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full bg-text-main text-white hover:bg-primary px-6 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                Send Message <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
