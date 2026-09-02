"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Upload,
  Heart,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Bot,
  User,
  Send,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Layers,
  Zap,
  Calendar,
  Sparkle,
  X,
  Plus
} from 'lucide-react';
import {
  INITIAL_BINGO_OPTIONS,
  VIBE_OPTIONS,
  GARMENT_OPTIONS,
  BUDGET_OPTIONS,
  SAMPLE_CURATED_LOOKS,
  SAMPLE_PRODUCTS,
  SAMPLE_SERVICES,
  BingoOption,
  CuratedLook,
  ConciergeProduct,
  ConciergeService
} from '@/lib/aiConciergeData';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import { openWhatsAppDirect } from '@/lib/whatsapp';

type StepMode = 'welcome' | 'bingo' | 'vibe' | 'garment' | 'budget' | 'results' | 'custom_chat';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  image?: string;
  recommendations?: {
    looks?: CuratedLook[];
    products?: ConciergeProduct[];
    services?: ConciergeService[];
  };
}

export function FemazonAIConciergeExperience() {
  const { toggleWishlist, isInWishlist, addToCart } = useFemazonStore();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepMode>('bingo');
  
  // Conversation Context
  const [selectedCategory, setSelectedCategory] = useState<BingoOption | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Active Look for Right Pane Inspector
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // Messages Stream
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hey gorgeous! 💕 What can I help you with today? Pick any option below, tell me your vibe, or upload a photo of an outfit you love!",
      timestamp: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasStarted) {
      scrollToBottom();
    }
  }, [messages, isTyping, currentStep, hasStarted]);

  // Handler: Start Styling
  const handleStartStyling = () => {
    setHasStarted(true);
  };

  // Handler: Select Initial Bingo Card
  const handleSelectBingo = (option: BingoOption) => {
    setSelectedCategory(option);
    
    // Add User Message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `${option.icon} ${option.title} — ${option.subtitle}`,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      if (option.id === 'party-look') {
        aiText = "Ooo, party mode! ✨ What kind of vibe are you feeling for the night?";
      } else if (option.id === 'wedding-festive') {
        aiText = "Celebration time! 🌸 Are we doing royal traditional, contemporary sangeet glam, or delicate pastels?";
      } else if (option.id === 'office-look') {
        aiText = "Love a powerful work wardrobe! 💼 What style vibe feels most authentic to you?";
      } else if (option.id === 'makeup' || option.id === 'hair' || option.id === 'mehendi') {
        aiText = `Let's get you glowing! ✨ What kind of ${option.title.toLowerCase()} style or look are you picturing?`;
      } else {
        aiText = `I'd love to help with ${option.title}! ✨ What kind of aesthetic or mood are you aiming for?`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentStep('vibe');
    }, 600);
  };

  // Handler: Select Vibe
  const handleSelectVibe = (vibe: string) => {
    setSelectedVibe(vibe);
    
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Vibe: ${vibe}`,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "What are we working with? Pick a silhouette or let me surprise you!",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentStep('garment');
    }, 600);
  };

  // Handler: Select Garment
  const handleSelectGarment = (garment: string) => {
    setSelectedGarment(garment);
    
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Silhouette: ${garment}`,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "What's your comfortable budget range for this look?",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentStep('budget');
    }, 600);
  };

  // Handler: Select Budget & Generate Curated Looks
  const handleSelectBudget = (budget: string) => {
    setSelectedBudget(budget);
    
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Budget: ${budget}`,
      timestamp: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const looks = SAMPLE_CURATED_LOOKS.default;
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Honestly, this is going to look so pretty together! ✨ Based on your vibe and budget, here is your customized style direction and 3 head-to-toe looks I curated for you:",
        timestamp: 'Just now',
        recommendations: {
          looks: looks,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentStep('results');
    }, 850);
  };

  // Handler: Image Upload & AI Analysis
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzingImage(true);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: "Uploaded outfit reference for style analysis 📸",
      image: imageUrl,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsAnalyzingImage(false);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "You look beautiful! ✨ I really love the elegant silhouette and rich palette of this outfit. \n\nI've analyzed your outfit's color harmony, neckline, and drape. Here are similar designer styles and a 360° complete look to complement your aesthetic:",
        timestamp: 'Just now',
        recommendations: {
          looks: SAMPLE_CURATED_LOOKS.default,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentStep('results');
    }, 1200);
  };

  // Handler: Custom Free-Text Chat
  const handleSendCustomText = () => {
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal.trim();
    setInputVal('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = `If I were styling you for "${text}", I'd keep the foundation sleek and add a touch of statement jewellery or soft glam makeup. 💕 Want me to build a complete head-to-toe look?`;
      
      if (lower.includes('makeup') || lower.includes('mua') || lower.includes('hair')) {
        replyText = "For this look, a soft dewy glow with defined eyes and Hollywood waves will look stunning! I've attached our top-rated verified beauty artists below:";
      } else if (lower.includes('saree') || lower.includes('lehenga') || lower.includes('wedding')) {
        replyText = "For wedding celebrations, royal wine or champagne organza silhouettes create timeless photo-ready magic. Here are top recommended pieces:";
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
        recommendations: {
          looks: SAMPLE_CURATED_LOOKS.default,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  // Handler: Reset Context
  const handleResetContext = () => {
    setSelectedCategory(null);
    setSelectedVibe(null);
    setSelectedGarment(null);
    setSelectedBudget(null);
    setUploadedImage(null);
    setCurrentStep('bingo');
    setMessages([
      {
        id: 'm-1',
        sender: 'ai',
        text: "Hey gorgeous! 💕 What can I help you with today? Pick any option below, tell me your vibe, or upload a photo of an outfit you love!",
        timestamp: 'Just now'
      }
    ]);
  };

  const currentLooks = SAMPLE_CURATED_LOOKS.default;
  const activeLook = currentLooks[activeLookIndex] || currentLooks[0];

  // =========================================================================
  // 1. HERO / WELCOME SCREEN (Shown before user taps Start Styling)
  // =========================================================================
  if (!hasStarted) {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F4] flex flex-col items-center justify-center px-4 py-12 text-center font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Sparkle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#4A1513]/10 text-[#4A1513] text-xs font-bold uppercase tracking-[0.2em] border border-[#4A1513]/20 shadow-2xs">
            <Sparkles size={14} className="text-[#4A1513]" />
            <span>Personal AI Stylist &amp; Best Friend</span>
          </div>

          {/* Hero Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-900 font-normal tracking-tight leading-[1.15]">
            Femazon AI Concierge <span className="text-[#4A1513]">✨</span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-lg sm:text-2xl text-[#4A1513] font-normal italic">
            &ldquo;Your personal AI assistant for style, beauty &amp; everything in between.&rdquo;
          </p>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Tell me what you’re looking for, show me your look, or simply pick an option below. I’ll help you find the perfect answer.
          </p>

          {/* Female-Friendly Visual Showcase Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
            <div className="p-3 bg-white border border-stone-200 rounded-sm shadow-xs text-left">
              <span className="text-2xl block mb-1">👗</span>
              <h4 className="font-bold text-xs text-stone-900">Fashion &amp; Outfits</h4>
              <p className="text-[11px] text-stone-500">Party, work, ethnic</p>
            </div>
            <div className="p-3 bg-white border border-stone-200 rounded-sm shadow-xs text-left">
              <span className="text-2xl block mb-1">💄</span>
              <h4 className="font-bold text-xs text-stone-900">Beauty &amp; MUA</h4>
              <p className="text-[11px] text-stone-500">Makeup, hair, mehendi</p>
            </div>
            <div className="p-3 bg-white border border-stone-200 rounded-sm shadow-xs text-left">
              <span className="text-2xl block mb-1">📸</span>
              <h4 className="font-bold text-xs text-stone-900">Photo Stylist</h4>
              <p className="text-[11px] text-stone-500">Instant AI look check</p>
            </div>
            <div className="p-3 bg-white border border-stone-200 rounded-sm shadow-xs text-left">
              <span className="text-2xl block mb-1">✨</span>
              <h4 className="font-bold text-xs text-stone-900">Complete Looks</h4>
              <p className="text-[11px] text-stone-500">Head-to-toe curation</p>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleStartStyling}
              className="inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>Start Styling ✨</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN DUAL-PANE CONCIERGE EXPERIENCE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans pb-16">
      
      {/* Top Persistent Context Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A1513] shrink-0">
              <Sparkles size={15} />
              <span>Femazon AI Concierge</span>
            </div>

            <div className="h-4 w-[1px] bg-stone-200 shrink-0 mx-1"></div>

            {/* Context Pills */}
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              {selectedCategory ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF5F2] border border-[#4A1513]/20 text-[#4A1513] rounded-xs font-semibold">
                  <span>{selectedCategory.icon}</span>
                  <span>{selectedCategory.title}</span>
                </span>
              ) : (
                <span className="text-stone-400 text-xs italic">Choose an option</span>
              )}

              {selectedVibe && (
                <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs font-medium">
                  {selectedVibe}
                </span>
              )}

              {selectedGarment && (
                <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs font-medium">
                  {selectedGarment}
                </span>
              )}

              {selectedBudget && (
                <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs font-medium">
                  {selectedBudget}
                </span>
              )}

              {uploadedImage && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xs font-semibold">
                  📸 Photo Added
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(selectedCategory || uploadedImage) && (
              <button
                type="button"
                onClick={handleResetContext}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-500 hover:text-[#4A1513] transition p-1 cursor-pointer"
                title="Reset Styling Context"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Dual-Pane Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT / MAIN COLUMN: CONVERSATION, BINGO CARDS & PRODUCTS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Conversation Stream Container */}
            <div className="bg-white border border-stone-200/90 rounded-sm shadow-xs p-4 sm:p-6 space-y-5">
              
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAI && (
                      <div className="w-8 h-8 rounded-xs bg-[#4A1513] text-[#F3DFCA] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Bot size={16} />
                      </div>
                    )}

                    <div className="max-w-[90%] sm:max-w-[85%] space-y-3">
                      
                      {/* Chat Bubble */}
                      <div
                        className={`p-4 rounded-sm text-xs sm:text-sm leading-relaxed shadow-2xs font-sans ${
                          isAI
                            ? 'bg-[#FAF7F4] border border-stone-200 text-stone-800'
                            : 'bg-[#4A1513] text-white'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.text}</div>

                        {msg.image && (
                          <div className="mt-2.5 relative max-w-xs rounded-xs overflow-hidden border border-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={msg.image} alt="User upload" className="w-full h-auto object-cover max-h-64" />
                          </div>
                        )}

                        <span className={`block text-[10px] mt-2 text-right ${isAI ? 'text-stone-400' : 'text-stone-300'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* In-Stream Recommendations (Looks, Products & Services) */}
                      {msg.recommendations && (
                        <div className="space-y-6 pt-2">
                          
                          {/* 1. Style Direction Summary Banner */}
                          <div className="p-4 bg-gradient-to-r from-[#FAF5F2] to-white border border-[#4A1513]/20 rounded-sm">
                            <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#4A1513] block mb-1">
                              Your Style Direction ✨
                            </span>
                            <h3 className="font-serif text-lg text-stone-900 font-bold">
                              {selectedVibe || 'Elegant'} • {selectedGarment || 'Festive'} • Modern Indian Couture
                            </h3>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                              &ldquo;I’d keep your current elegant vibe but add a little more statement detailing for the occasion.&rdquo;
                            </p>
                          </div>

                          {/* 2. Three Curated Looks Accordion / Tabs */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-serif text-base font-bold text-stone-900">
                                3 Looks I&apos;d Pick For You ✨
                              </h4>
                              <span className="text-xs text-stone-500 font-medium">Head-to-toe styling</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {msg.recommendations.looks?.map((look, idx) => (
                                <div
                                  key={look.id}
                                  onClick={() => setActiveLookIndex(idx)}
                                  className={`p-3 bg-white border rounded-sm transition cursor-pointer text-left shadow-2xs hover:shadow-md ${
                                    activeLookIndex === idx
                                      ? 'border-[#4A1513] ring-1 ring-[#4A1513]'
                                      : 'border-stone-200'
                                  }`}
                                >
                                  <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden bg-stone-100 mb-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={look.heroImage} alt={look.title} className="w-full h-full object-cover object-top" />
                                    <span className="absolute top-1.5 left-1.5 bg-[#4A1513]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                                      {look.vibe.split('•')[0]}
                                    </span>
                                  </div>
                                  <h5 className="font-serif text-xs font-bold text-stone-900 truncate">{look.title}</h5>
                                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{look.subtitle}</p>
                                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                                    <span className="font-bold text-stone-900">₹{look.priceEstimate.toLocaleString('en-IN')}</span>
                                    <span className="text-[#4A1513] font-bold text-[10px] uppercase">View Look →</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Real Femazon Products Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-serif text-base font-bold text-stone-900">
                                Real Femazon Product Matches 🛍️
                              </h4>
                              <Link href="/shop" className="text-xs font-bold text-[#4A1513] hover:underline uppercase tracking-wider">
                                View Full Catalog →
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {msg.recommendations.products?.map((prod) => (
                                <div
                                  key={prod.id}
                                  className="bg-white border border-stone-200 rounded-sm p-3 flex gap-3 shadow-2xs hover:shadow-sm transition"
                                >
                                  <div className="relative w-24 aspect-[3/4] rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover object-top" />
                                  </div>

                                  <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#4A1513] block">
                                        {prod.category}
                                      </span>
                                      <h5 className="font-serif text-xs font-semibold text-stone-900 line-clamp-1 mt-0.5">
                                        {prod.name}
                                      </h5>
                                      <p className="text-[10.5px] text-stone-500 line-clamp-2 mt-1 italic">
                                        &ldquo;{prod.stylingReason}&rdquo;
                                      </p>
                                    </div>

                                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                      <div className="flex items-baseline gap-1.5">
                                        <span className="font-sans text-xs font-bold text-stone-900">
                                          ₹{prod.price.toLocaleString('en-IN')}
                                        </span>
                                        {prod.originalPrice && (
                                          <span className="font-sans text-[10px] text-stone-400 line-through">
                                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleWishlist(prod as any)}
                                          className={`p-1.5 rounded-xs border transition cursor-pointer ${
                                            isInWishlist(prod.id)
                                              ? 'border-rose-300 bg-rose-50 text-rose-600'
                                              : 'border-stone-200 text-stone-500 hover:text-stone-900'
                                          }`}
                                          title="Save to Wishlist"
                                        >
                                          <Heart size={12} className={isInWishlist(prod.id) ? 'fill-rose-600' : ''} />
                                        </button>

                                        <Link
                                          href={prod.link}
                                          className="px-2.5 py-1 rounded-xs bg-[#4A1513] hover:bg-[#350B0A] text-white text-[10px] font-bold uppercase tracking-wider transition"
                                        >
                                          View
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Beauty & Services Recommendations */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-serif text-base font-bold text-stone-900">
                                Verified Beauty &amp; Concierge Services 💄
                              </h4>
                              <Link href="/services" className="text-xs font-bold text-[#4A1513] hover:underline uppercase tracking-wider">
                                All Services →
                              </Link>
                            </div>

                            <div className="space-y-2.5">
                              {msg.recommendations.services?.map((serv) => (
                                <div
                                  key={serv.id}
                                  className="p-3 bg-[#FAF7F4] border border-stone-200 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-14 h-14 rounded-xs overflow-hidden bg-stone-200 shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={serv.image} alt={serv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#4A1513] block">
                                        {serv.category} · {serv.location}
                                      </span>
                                      <h5 className="font-serif text-xs font-bold text-stone-900 truncate">
                                        {serv.name}
                                      </h5>
                                      <p className="text-[11px] text-stone-500 line-clamp-1">{serv.highlight}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                    <span className="font-sans text-xs font-bold text-stone-900">
                                      From ₹{serv.price.toLocaleString('en-IN')}
                                    </span>
                                    <Link
                                      href={serv.link}
                                      className="px-3 py-1.5 bg-[#4A1513] hover:bg-[#350B0A] text-white text-[10.5px] font-bold uppercase tracking-wider rounded-xs transition"
                                    >
                                      Book Now
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>

                    {!isAI && (
                      <div className="w-8 h-8 rounded-xs bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-center gap-2 text-stone-400 text-xs py-2 pl-11">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11.5px] text-stone-500 font-medium">Femazon AI is styling your recommendations...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ========================================================================= */}
            {/* DYNAMIC BINGO SELECTION CARDS CONTAINER */}
            {/* ========================================================================= */}
            <div className="bg-white border border-stone-200 rounded-sm shadow-xs p-4 sm:p-5">
              
              {/* STEP 1: INITIAL 14 BINGO OPTIONS */}
              {currentStep === 'bingo' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      Tap an Option to Start Styling
                    </span>
                    <span className="text-[10.5px] text-stone-400">14 Categories</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {INITIAL_BINGO_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectBingo(opt)}
                        className="p-3 bg-[#FAF7F4] hover:bg-[#FAF5F2] border border-stone-200 hover:border-[#4A1513] rounded-xs text-left transition duration-200 active:scale-98 cursor-pointer group shadow-2xs"
                      >
                        <span className="text-xl block mb-1 group-hover:scale-110 transition-transform duration-200 origin-left">
                          {opt.icon}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 group-hover:text-[#4A1513] transition-colors leading-tight">
                          {opt.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-light">
                          {opt.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: VIBE SELECTION */}
              {currentStep === 'vibe' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      Select Your Style Vibe ✨
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('bingo')}
                      className="text-[11px] text-[#4A1513] font-bold uppercase underline"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {VIBE_OPTIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVibe(v.label)}
                        className="p-3 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer group shadow-2xs"
                      >
                        <span className="text-lg block mb-1">{v.icon}</span>
                        <span className="text-xs font-bold block">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: GARMENT SELECTION */}
              {currentStep === 'garment' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      What are we working with? 👗
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('vibe')}
                      className="text-[11px] text-[#4A1513] font-bold uppercase underline"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {GARMENT_OPTIONS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleSelectGarment(g.label)}
                        className="p-3 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer group shadow-2xs"
                      >
                        <span className="text-lg block mb-1">{g.icon}</span>
                        <span className="text-xs font-bold block">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET SELECTION */}
              {currentStep === 'budget' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      What is your budget? 💰
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('garment')}
                      className="text-[11px] text-[#4A1513] font-bold uppercase underline"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {BUDGET_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBudget(b.label)}
                        className="p-3 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer font-bold text-xs shadow-2xs"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: RESULTS ACTION BAR */}
              {currentStep === 'results' && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-stone-600 font-medium">
                    Looking for something different?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('bingo')}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xs transition cursor-pointer"
                    >
                      Pick Another Option
                    </button>
                    <button
                      type="button"
                      onClick={() => openWhatsAppDirect(`Hi Femazon Stylist! 🌸 I would like personalized recommendations for ${selectedCategory?.title || 'my event'}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1513] text-white text-xs font-bold uppercase rounded-xs transition cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ========================================================================= */}
            {/* INPUT & PHOTO UPLOAD BAR */}
            {/* ========================================================================= */}
            <div className="bg-white border border-stone-200 rounded-sm p-3.5 shadow-xs flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
                title="Upload an outfit or photo"
              >
                <Camera size={16} />
                <span className="hidden sm:inline">Upload Photo</span>
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCustomText();
                }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask me anything: 'Suggest shoes for black gown', 'Mehendi artists'..."
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xs text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#4A1513] transition"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className="px-4 py-2.5 bg-[#4A1513] hover:bg-[#350B0A] text-white rounded-xs font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 cursor-pointer shrink-0"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (DESKTOP): 360° COMPLETE LOOK INSPECTOR & PREVIEW */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 sticky top-16">
            
            {/* Complete Look Board */}
            <div className="bg-white border border-stone-200 rounded-sm shadow-xs p-5 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A1513] block">
                    Complete Look Generator ✨
                  </span>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {activeLook.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#4A1513] bg-[#FAF5F2] px-2.5 py-1 rounded-xs border border-[#4A1513]/20">
                  ₹{activeLook.priceEstimate.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Big Hero Visual Preview */}
              <div className="relative aspect-[3/4] w-full rounded-xs overflow-hidden bg-stone-100 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeLook.heroImage} alt={activeLook.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#F3DFCA] tracking-wider block">
                    {activeLook.vibe}
                  </span>
                  <h4 className="font-serif text-sm font-semibold">{activeLook.subtitle}</h4>
                </div>
              </div>

              {/* Head-to-Toe 6-Piece Breakdown Checklist */}
              <div className="space-y-2.5 text-xs">
                
                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">1. Outfit</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.outfit.name}</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px] shrink-0">In Stock</span>
                </div>

                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">2. Jewellery</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.jewellery.name}</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px] shrink-0">Matched</span>
                </div>

                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">3. Footwear</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.footwear.name}</span>
                  </div>
                  <span className="text-stone-500 text-[11px] shrink-0">Custom Size</span>
                </div>

                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">4. Bag &amp; Potli</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.bag.name}</span>
                  </div>
                  <span className="text-stone-500 text-[11px] shrink-0">Handcrafted</span>
                </div>

                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">5. Makeup Look</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.makeup.name}</span>
                  </div>
                  <span className="text-[#4A1513] font-bold text-[11px] shrink-0">Pro MUA</span>
                </div>

                <div className="p-2.5 bg-[#FAF7F4] rounded-xs border border-stone-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">6. Hairstyle</span>
                    <span className="font-semibold text-stone-900 truncate block">{activeLook.hairstyle.name}</span>
                  </div>
                  <span className="text-stone-500 text-[11px] shrink-0">Styling Guide</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/shop"
                  className="w-full py-3 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>Shop This Complete Look</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openWhatsAppDirect(`Hi Femazon Stylist! 🌸 I would like to consult regarding ${activeLook.title}`)}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={14} className="text-emerald-700" />
                  <span>Ask Stylist on WhatsApp</span>
                </button>
              </div>

            </div>

            {/* Uploaded Photo Analysis Inspector Box */}
            {uploadedImage && (
              <div className="p-4 bg-white border border-stone-200 rounded-sm shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Camera size={14} className="text-[#4A1513]" />
                    <span>Your Photo Analysis</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedImage} alt="Uploaded outfit" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Analyzed Style Profile</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Matched to Indian Couture Palette · High Aesthetic Harmony
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM BRAND MESSAGE */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-stone-200 text-center">
        <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
          More than a stylist. Your Femazon AI Concierge. <span className="text-[#4A1513]">✨</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto font-light">
          &ldquo;From what to wear to how to complete the look — Femazon is here to help.&rdquo;
        </p>
      </div>

    </div>
  );
}
