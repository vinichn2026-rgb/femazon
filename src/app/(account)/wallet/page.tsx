"use client";

import React, { useState } from 'react';
import { 
  Wallet, 
  Sparkles, 
  Gift, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CreditCard,
  Copy,
  Tag
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

type WalletTransaction = {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status: 'COMPLETED' | 'PENDING';
};

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_1",
    type: "CREDIT",
    title: "Welcome Privé Reward Bonus",
    subtitle: "New account activation bonus",
    amount: 1500,
    date: "Today, 10:15 AM",
    status: "COMPLETED"
  },
  {
    id: "tx_2",
    type: "CREDIT",
    title: "Festival Styling Cashback",
    subtitle: "Applied from Anarkali order #FZ-9821",
    amount: 1000,
    date: "Yesterday, 04:30 PM",
    status: "COMPLETED"
  }
];

export default function WalletPage() {
  const { walletBalance, addWalletCredits } = useFemazonStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = giftCardCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsRedeeming(true);

    setTimeout(() => {
      setIsRedeeming(false);

      if (cleanCode === 'FEMAZON500' || cleanCode === 'LUXE500' || cleanCode === 'WELCOME1500') {
        const addedAmount = cleanCode === 'WELCOME1500' ? 1500 : 500;
        addWalletCredits(addedAmount);
        
        const newTx: WalletTransaction = {
          id: "tx_" + Date.now(),
          type: "CREDIT",
          title: `Gift Card Redeemed (${cleanCode})`,
          subtitle: "Instant wallet top-up",
          amount: addedAmount,
          date: "Just now",
          status: "COMPLETED"
        };
        setTransactions(prev => [newTx, ...prev]);
        setToastMessage({ type: 'success', text: `Success! ₹${addedAmount.toLocaleString('en-IN')} added to your Femazon Wallet.` });
        setGiftCardCode('');
      } else {
        setToastMessage({ type: 'error', text: 'Invalid or expired gift card code. Try code: FEMAZON500' });
      }

      setTimeout(() => setToastMessage(null), 4000);
    }, 700);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4A1513] mb-1">
          <Wallet size={15} />
          <span>Femazon Privé</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Wallet &amp; Credits
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage your shopping balance, reward points, and luxury promotional vouchers.
        </p>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Section: Balance Card & Gift Voucher Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-[#3D0F0D] via-[#4A1513] to-[#260505] text-white p-7 sm:p-8 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
          {/* Ambient shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200/90">
                Total Available Credits
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xs sm:text-sm font-light text-white/80">INR</span>
                <span className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-white">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-200 border border-white/15">
              <Wallet size={24} />
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles size={14} className="text-amber-300" />
              <span>100% usable on all couture orders &amp; services</span>
            </div>
            <a 
              href="/shop" 
              className="px-4 py-2 rounded-full bg-white text-[#4A1513] font-bold text-[11px] uppercase tracking-wider hover:bg-amber-100 transition shadow-xs"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Redeem Gift Card / Voucher Box */}
        <div className="rounded-3xl bg-white border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center mb-3">
              <Gift size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-900 font-normal">
              Redeem Gift Voucher
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Enter voucher code or gift card PIN to top up your balance.
            </p>
          </div>

          <form onSubmit={handleRedeemGiftCard} className="mt-4 space-y-3">
            <input
              type="text"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value)}
              placeholder="e.g. FEMAZON500"
              className="w-full uppercase font-mono tracking-wider bg-[#FAF7F5] rounded-xl border border-stone-200/90 focus:border-[#4A1513] focus:bg-white px-3.5 py-2.5 text-stone-900 text-xs font-bold focus:outline-none"
            />
            <button
              type="submit"
              disabled={isRedeeming || !giftCardCode.trim()}
              className="w-full py-2.5 bg-[#4A1513] hover:bg-[#380E0C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isRedeeming ? 'Validating...' : 'Apply Code'}
            </button>
          </form>
        </div>

      </div>

      {/* Available Exclusive Vouchers */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-stone-900 font-normal">
          Exclusive Privileges &amp; Coupons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-dashed border-stone-300 hover:border-[#4A1513] transition flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#4A1513] bg-[#FAF7F5] px-2 py-0.5 rounded border border-[#4A1513]/20">
                  WELCOME1500
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  NEW MEMBER
                </span>
              </div>
              <p className="text-xs text-stone-600">Get flat ₹1,500 off on bridal &amp; designer couture above ₹9,999</p>
            </div>
            <button
              type="button"
              onClick={() => copyCoupon('WELCOME1500')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#4A1513] hover:text-white text-stone-700 text-xs font-bold transition shrink-0 cursor-pointer"
            >
              {copiedCode === 'WELCOME1500' ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-dashed border-stone-300 hover:border-[#4A1513] transition flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#4A1513] bg-[#FAF7F5] px-2 py-0.5 rounded border border-[#4A1513]/20">
                  FEMAZON500
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  WALLET TOP-UP
                </span>
              </div>
              <p className="text-xs text-stone-600">Instant ₹500 credits for styling bookings &amp; consultations</p>
            </div>
            <button
              type="button"
              onClick={() => copyCoupon('FEMAZON500')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#4A1513] hover:text-white text-stone-700 text-xs font-bold transition shrink-0 cursor-pointer"
            >
              {copiedCode === 'FEMAZON500' ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <h2 className="font-serif text-2xl text-stone-900 font-normal">
            Wallet Activity
          </h2>
          <span className="text-xs font-semibold text-stone-400">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {transactions.map(tx => (
            <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {tx.type === 'CREDIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{tx.title}</h4>
                  <p className="text-xs text-stone-400">{tx.subtitle} • {tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-sm font-bold font-mono ${
                  tx.type === 'CREDIT' ? 'text-emerald-700' : 'text-stone-900'
                }`}>
                  {tx.type === 'CREDIT' ? '+ ' : '- '}₹{tx.amount.toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] text-stone-400 font-medium">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
