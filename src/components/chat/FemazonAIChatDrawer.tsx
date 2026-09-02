"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
  Heart,
  ArrowRight,
  Bot,
  User,
  Camera,
  Upload,
  CheckCircle2,
  ChevronRight,
  Sparkle,
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

interface ChatMessage {
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

export function FemazonAIChatDrawer() {
  const searchParams = useSearchParams();
  const { toggleWishlist, isInWishlist } = useFemazonStore();
  const [isOpen, setIsOpen] = useState(false);

  // Styling Context
  const [selectedCategory, setSelectedCategory] = useState<BingoOption | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // Chatbot Flow Step: 'bingo' | 'vibe' | 'garment' | 'budget' | 'results'
  const [flowStep, setFlowStep] = useState<'bingo' | 'vibe' | 'garment' | 'budget' | 'results'>('bingo');

  // Messages Stream
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Hey gorgeous! 💕 What can I help you with today? \n\nPick any option below, tell me what look you need, or upload an outfit photo!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-open on ?aichat=true query param
  useEffect(() => {
    if (searchParams?.get('aichat') === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isTyping, flowStep]);

  // Handle Bingo Option Tap
  const handleSelectBingo = (option: BingoOption) => {
    setSelectedCategory(option);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `${option.icon} ${option.title}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let aiText = `Love that! ✨ What kind of vibe are you feeling for this ${option.title.toLowerCase()}?`;
      if (option.id === 'party-look') {
        aiText = "Ooo, party mode! ✨ What kind of vibe are you feeling?";
      } else if (option.id === 'wedding-festive') {
        aiText = "Celebration time! 🌸 Are we doing royal traditional, contemporary sangeet glam, or delicate pastels?";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('vibe');
    }, 550);
  };

  // Handle Vibe Selection
  const handleSelectVibe = (vibe: string) => {
    setSelectedVibe(vibe);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Vibe: ${vibe}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "What are we working with? Pick a silhouette or let me surprise you!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('garment');
    }, 550);
  };

  // Handle Garment Selection
  const handleSelectGarment = (garment: string) => {
    setSelectedGarment(garment);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Silhouette: ${garment}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "What is your comfortable budget range?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('budget');
    }, 550);
  };

  // Handle Budget Selection & Return Curated Looks
  const handleSelectBudget = (budget: string) => {
    setSelectedBudget(budget);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Budget: ${budget}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Honestly, this is going to look so pretty together! ✨ Here are 3 personalized head-to-toe looks and real Femazon matches I curated for you:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: {
          looks: SAMPLE_CURATED_LOOKS.default,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('results');
    }, 750);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    setUploadedImage(imgUrl);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: "Uploaded an outfit reference 📸",
      image: imgUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "You look beautiful! ✨ I really love the elegant silhouette and rich palette of this outfit. \n\nI've analyzed your outfit's color harmony, neckline, and drape. Here are visually matching designer outfits, accessories, and a complete look:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: {
          looks: SAMPLE_CURATED_LOOKS.default,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('results');
    }, 1000);
  };

  // Handle Custom Text Message
  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue.trim();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `If I were styling you for "${text}", I'd keep the foundation chic and add a statement accessory or soft glow makeup. 💕 Here are recommended looks and products:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: {
          looks: SAMPLE_CURATED_LOOKS.default,
          products: SAMPLE_PRODUCTS,
          services: SAMPLE_SERVICES
        }
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setFlowStep('results');
    }, 700);
  };

  const handleResetChat = () => {
    setSelectedCategory(null);
    setSelectedVibe(null);
    setSelectedGarment(null);
    setSelectedBudget(null);
    setUploadedImage(null);
    setFlowStep('bingo');
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: "Hey gorgeous! 💕 What can I help you with today? \n\nPick any option below, tell me what look you need, or upload an outfit photo!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleWhatsAppEscalation = () => {
    const topic = selectedCategory?.title || 'Personal Styling & Outfits';
    openWhatsAppDirect(`Hi Femazon AI Stylist! 🌸 I was chatting with the AI Concierge regarding ${topic} and would love to consult with a senior human stylist.`);
  };

  return (
    <>
      {/* Floating AI Concierge Chatbot Launcher FAB */}
      <aside
        aria-label="Femazon AI Concierge Chatbot"
        className="fixed bottom-24 right-5 sm:bottom-8 sm:right-24 z-[9990] flex items-center"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#4A1513] to-[#2B0B0A] hover:from-[#350B0A] hover:to-[#1E0605] text-white px-4 py-3 rounded-sm shadow-[0_8px_25px_rgba(74,21,19,0.35)] border border-[#E5C3A6]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open AI Concierge Chatbot"
        >
          {/* Animated Sparkle Icon */}
          <div className="relative flex items-center justify-center">
            <Sparkles size={18} className="text-[#F3DFCA] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C3A6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5C3A6]"></span>
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#F3DFCA] leading-tight">
              AI Concierge ✨
            </span>
            <span className="block text-[9.5px] text-stone-300 font-light leading-tight">
              Personal Stylist &amp; Best Friend
            </span>
          </div>
        </button>
      </aside>

      {/* AI Concierge Chatbot Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] overflow-hidden animate-in fade-in duration-200 font-sans">
          
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Right Sliding Chatbot Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex z-10">
            <div className="w-screen max-w-md sm:max-w-xl bg-white shadow-2xl border-l border-stone-200 flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out">
              
              {/* ========================================================================= */}
              {/* DRAWER HEADER WITH ACTIVE CONTEXT */}
              {/* ========================================================================= */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-[#4A1513] to-[#2E0D0C] text-white border-b border-[#3D110F] flex items-center justify-between shrink-0 shadow-sm">
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-sm bg-white/10 border border-[#E5C3A6]/40 flex items-center justify-center text-[#F3DFCA] shadow-2xs">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                        Femazon AI Concierge
                      </h3>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                    </div>
                    <span className="text-[10px] text-[#E5C3A6] tracking-wider uppercase font-semibold block">
                      {selectedCategory ? `${selectedCategory.title} · Stylist Active` : 'Your Personal Fashion & Beauty Best Friend'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="p-1.5 rounded-sm text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Reset Chat"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-sm text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Close Chatbot"
                  >
                    <X size={20} />
                  </button>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* CHAT MESSAGES STREAM */}
              {/* ========================================================================= */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF7F4]">
                
                {messages.map((msg) => {
                  const isAI = msg.sender === 'ai';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      {/* Avatar */}
                      {isAI && (
                        <div className="w-7 h-7 rounded-sm bg-[#4A1513] text-[#F3DFCA] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Bot size={14} />
                        </div>
                      )}

                      <div className="max-w-[90%] sm:max-w-[85%] space-y-3">
                        
                        {/* Bubble */}
                        <div
                          className={`p-3.5 rounded-sm text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                            isAI
                              ? 'bg-white border border-stone-200 text-stone-800'
                              : 'bg-[#4A1513] text-white'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.text}</div>

                          {msg.image && (
                            <div className="mt-2.5 relative max-w-xs rounded-xs overflow-hidden border border-white/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={msg.image} alt="Upload" className="w-full h-auto object-cover max-h-52" />
                            </div>
                          )}

                          <span
                            className={`block text-[9.5px] mt-1.5 text-right ${
                              isAI ? 'text-stone-400' : 'text-stone-300'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* In-Chat Recommendations Stream */}
                        {msg.recommendations && (
                          <div className="space-y-4 pt-1">
                            
                            {/* 3 Curated Looks Cards */}
                            {msg.recommendations.looks && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] block">
                                  3 Looks Picked For You ✨
                                </span>
                                
                                <div className="grid grid-cols-1 gap-2.5">
                                  {msg.recommendations.looks.map((look, idx) => (
                                    <div
                                      key={look.id}
                                      className="p-3 bg-white border border-stone-200 rounded-sm shadow-2xs hover:shadow-sm transition text-left"
                                    >
                                      <div className="flex gap-3">
                                        <div className="relative w-20 aspect-[3/4] rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={look.heroImage} alt={look.title} className="w-full h-full object-cover object-top" />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                          <div>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A1513] block">
                                              {look.vibe}
                                            </span>
                                            <h5 className="font-serif text-xs font-bold text-stone-900 mt-0.5">
                                              {look.title}
                                            </h5>
                                            <p className="text-[10.5px] text-stone-500 line-clamp-1">{look.subtitle}</p>

                                            {/* Mini 6-Piece Checklist */}
                                            <div className="mt-1.5 text-[10px] text-stone-600 space-y-0.5">
                                              <div>• <b>Outfit:</b> {look.outfit.name}</div>
                                              <div>• <b>Jewels:</b> {look.jewellery.name}</div>
                                              <div>• <b>MUA:</b> {look.makeup.name}</div>
                                            </div>
                                          </div>

                                          <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                                            <span className="font-bold text-xs text-stone-900">
                                              ₹{look.priceEstimate.toLocaleString('en-IN')}
                                            </span>
                                            <Link
                                              href="/shop"
                                              onClick={() => setIsOpen(false)}
                                              className="px-2.5 py-1 bg-[#4A1513] text-white text-[10px] font-bold uppercase tracking-wider rounded-xs hover:bg-[#350B0A] transition"
                                            >
                                              Shop Look →
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Product Matches */}
                            {msg.recommendations.products && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] block">
                                  Matching Femazon Products 🛍️
                                </span>

                                <div className="grid grid-cols-2 gap-2">
                                  {msg.recommendations.products.slice(0, 2).map((p) => (
                                    <div
                                      key={p.id}
                                      className="p-2.5 bg-white border border-stone-200 rounded-sm shadow-2xs flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="relative aspect-[3/4] w-full rounded-xs overflow-hidden bg-stone-100 mb-1.5">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                                        </div>
                                        <span className="text-[8.5px] font-bold uppercase text-[#4A1513] block">{p.category}</span>
                                        <h6 className="font-serif text-[11px] font-semibold text-stone-900 line-clamp-1">{p.name}</h6>
                                      </div>

                                      <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                                        <span className="font-bold text-[11px] text-stone-900">₹{p.price.toLocaleString('en-IN')}</span>
                                        <Link
                                          href={p.link}
                                          onClick={() => setIsOpen(false)}
                                          className="text-[10px] font-bold text-[#4A1513] uppercase hover:underline"
                                        >
                                          View →
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>

                      {!isAI && (
                        <div className="w-7 h-7 rounded-sm bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Animation */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-stone-400 text-xs py-2 pl-9">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">Femazon AI is styling your look...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ========================================================================= */}
              {/* BINGO INTERACTIVE SELECTION BAR (INSIDE CHATBOT) */}
              {/* ========================================================================= */}
              <div className="p-3 bg-white border-t border-stone-200 shrink-0 max-h-48 overflow-y-auto">
                
                {/* STEP 1: INITIAL BINGO CARDS */}
                {flowStep === 'bingo' && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Choose an Option to Begin:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {INITIAL_BINGO_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectBingo(opt)}
                          className="p-2 bg-[#FAF7F4] hover:bg-[#FAF5F2] border border-stone-200 hover:border-[#4A1513] rounded-xs text-left transition cursor-pointer text-xs"
                        >
                          <span className="text-base block mb-0.5">{opt.icon}</span>
                          <span className="font-bold text-stone-900 block truncate text-[11px]">{opt.title}</span>
                          <span className="text-[9px] text-stone-500 block truncate">{opt.subtitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: VIBES */}
                {flowStep === 'vibe' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Pick a Vibe:</span>
                      <button type="button" onClick={() => setFlowStep('bingo')} className="text-[10px] text-[#4A1513] underline font-bold">← Back</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {VIBE_OPTIONS.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleSelectVibe(v.label)}
                          className="p-2 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer text-xs font-bold"
                        >
                          <span className="text-sm block">{v.icon}</span>
                          <span>{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: GARMENT */}
                {flowStep === 'garment' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Pick a Silhouette:</span>
                      <button type="button" onClick={() => setFlowStep('vibe')} className="text-[10px] text-[#4A1513] underline font-bold">← Back</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {GARMENT_OPTIONS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleSelectGarment(g.label)}
                          className="p-2 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer text-xs font-bold"
                        >
                          <span className="text-sm block">{g.icon}</span>
                          <span>{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: BUDGET */}
                {flowStep === 'budget' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Pick Your Budget:</span>
                      <button type="button" onClick={() => setFlowStep('garment')} className="text-[10px] text-[#4A1513] underline font-bold">← Back</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {BUDGET_OPTIONS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleSelectBudget(b.label)}
                          className="p-2 bg-[#FAF7F4] hover:bg-[#4A1513] hover:text-white border border-stone-200 rounded-xs text-center transition cursor-pointer text-xs font-bold"
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: RESULTS ACTIONS */}
                {flowStep === 'results' && (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFlowStep('bingo')}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs font-bold uppercase text-[10px] transition cursor-pointer"
                    >
                      Pick Another Look
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppEscalation}
                      className="px-3 py-1.5 bg-[#4A1513] text-white rounded-xs font-bold uppercase text-[10px] transition flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle size={12} />
                      <span>WhatsApp Stylist</span>
                    </button>
                  </div>
                )}

              </div>

              {/* ========================================================================= */}
              {/* INPUT BAR + PHOTO UPLOAD TRIGGER */}
              {/* ========================================================================= */}
              <div className="p-3 bg-white border-t border-stone-200 shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xs text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                    title="Upload Outfit Photo"
                  >
                    <Camera size={15} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about styling, makeup, outfits..."
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xs text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#4A1513] transition"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="px-3.5 py-2 bg-[#4A1513] hover:bg-[#350B0A] text-white rounded-xs font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
}
