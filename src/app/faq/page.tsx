"use client";

import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  { id: 'orders', label: 'Orders & Shipping' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'services', label: 'Services & Booking' },
  { id: 'wardrobe', label: 'AI Wardrobe' },
  { id: 'vendors', label: 'For Vendors' }
];

const FAQS = [
  {
    category: 'orders',
    question: 'How long does shipping take?',
    answer: 'Standard shipping generally takes 3-5 business days depending on your location. Express shipping (1-2 days) is available at checkout for selected pin codes. You will receive a tracking link via email once your order is dispatched.'
  },
  {
    category: 'orders',
    question: 'Can I change my delivery address after placing an order?',
    answer: 'If your order has not been packed yet, you can modify the delivery address by contacting our support team immediately. Once the order is packed or shipped, we cannot change the address.'
  },
  {
    category: 'orders',
    question: 'How can I track my order?',
    answer: 'You can track your order by logging into your account and visiting "My Orders". Click on "View Details" next to your order to see real-time tracking updates.'
  },
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a hassle-free 14-day return policy for most items. Clothing must be unwashed, unworn, and have original tags attached. Some items like intimates, swimwear, and customized products are non-returnable.'
  },
  {
    category: 'returns',
    question: 'How long does it take to process a refund?',
    answer: 'Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The amount will be credited back to your original payment method.'
  },
  {
    category: 'services',
    question: 'How do I book a styling or beauty service?',
    answer: 'Navigate to the "Services" section from the main menu, browse our curated list of professionals, select your preferred date and time, and confirm your booking. You can manage your appointments in the "My Bookings" section.'
  },
  {
    category: 'services',
    question: 'Can I cancel or reschedule a service booking?',
    answer: 'Yes, you can cancel or reschedule a booking up to 24 hours before the scheduled time without any penalty. Late cancellations may incur a fee. Manage this directly from your "My Bookings" dashboard.'
  },
  {
    category: 'wardrobe',
    question: 'What is the AI Wardrobe feature?',
    answer: 'The AI Wardrobe allows you to digitize your closet. You can upload photos of your clothing, and our AI will suggest outfits based on occasions, weather, and current fashion trends, or recommend new items to complete your look.'
  },
  {
    category: 'wardrobe',
    question: 'Is the AI Wardrobe free to use?',
    answer: 'Yes! The basic AI Wardrobe features are completely free for all registered Femazon users. We want to help you make the most out of what you already own while shopping smarter.'
  },
  {
    category: 'vendors',
    question: 'How can I sell my products on Femazon?',
    answer: 'Scroll to the footer and click on "Become a Vendor" or navigate to the Vendor section. Fill out the application form with your business details. Once approved by our admin team, you can set up your store and list products.'
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => faq.category === activeCategory);

  return (
    <main className="min-h-screen bg-surface py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-primary mb-2">
            <MessageCircleQuestion size={24} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-text-main">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-text-muted text-[15px] max-w-xl mx-auto">
            Find answers to common questions about orders, shipping, returns, our unique services, and more.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Sidebar Categories */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-3 border border-zinc-200 shadow-sm flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-1">
              {FAQ_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenQuestion(null);
                  }}
                  className={`
                    whitespace-nowrap text-left px-5 py-3.5 rounded-2xl text-[13px] font-bold tracking-wide transition-all
                    ${activeCategory === category.id 
                      ? 'bg-text-main text-white shadow-md' 
                      : 'text-text-muted hover:bg-zinc-100 hover:text-text-main'}
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="flex-1 space-y-4">
            <h2 className="font-serif text-2xl text-text-main mb-6 pb-4 border-b border-zinc-200">
              {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openQuestion === index;
                  return (
                    <div 
                      key={index} 
                      className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-primary shadow-sm' : 'border-zinc-200 hover:border-zinc-300'}`}
                    >
                      <button
                        onClick={() => setOpenQuestion(isOpen ? null : index)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none"
                      >
                        <span className="font-semibold text-text-main text-[15px] pr-8">{faq.question}</span>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-500'}`}>
                          <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-6 pb-6 pt-0 text-text-muted text-[15px] leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-500">
                No questions available for this category yet.
              </div>
            )}

            {/* Need More Help Box */}
            <div className="mt-12 bg-accent/5 rounded-3xl p-8 border border-accent/20 text-center">
              <h3 className="font-serif text-xl text-text-main mb-2">Still need help?</h3>
              <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                If you couldn't find the answer to your question, our support team is ready to assist you.
              </p>
              <Link 
                href="/contact"
                className="inline-block bg-text-main text-white hover:bg-primary px-8 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
