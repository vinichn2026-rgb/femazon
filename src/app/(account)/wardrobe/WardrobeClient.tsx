"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Sparkles, Shirt, Loader2, ArrowRight } from "lucide-react";

export default function WardrobeClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ imageUrl: "", category: "Top", color: "" });
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const fetchWardrobe = async () => {
    setLoading(true);
    const res = await fetch("/api/wardrobe");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadData)
    });
    if (res.ok) {
      setShowUploadModal(false);
      setUploadData({ imageUrl: "", category: "Top", color: "" });
      fetchWardrobe();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
    if (res.ok) fetchWardrobe();
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/wardrobe/recommend", { method: "POST" });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface pb-20">
      
      {/* Header Banner */}
      <div className="bg-zinc-900 text-white pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-4 border border-white/10">
              <Sparkles size={14} /> AI Powered
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">My Virtual Wardrobe</h1>
            <p className="text-zinc-400 max-w-xl text-lg">Digitize your closet. Let our AI Stylist understand your style, build outfits, and find the perfect missing pieces.</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-white text-zinc-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition shadow-xl flex items-center gap-2"
          >
            <Plus size={18} /> Upload Clothes
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: AI Stylist Section */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-8 bg-white rounded-[2rem] p-8 shadow-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-rose-500" />
            
            <h2 className="font-serif text-2xl text-text-main mb-2">AI Stylist</h2>
            <p className="text-zinc-500 text-sm mb-8">Ask our AI to build an outfit from your wardrobe.</p>

            {items.length === 0 ? (
              <div className="bg-zinc-50 rounded-2xl p-6 text-center border border-dashed border-zinc-200">
                <Shirt className="mx-auto text-zinc-300 mb-3" size={32} />
                <p className="text-sm text-zinc-500">Upload clothes to your wardrobe first so the AI can style you.</p>
              </div>
            ) : (
              <button 
                onClick={handleAskAI}
                disabled={aiLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {aiLoading ? <><Loader2 size={18} className="animate-spin"/> Analyzing Wardrobe...</> : <><Sparkles size={18}/> Build My Outfit</>}
              </button>
            )}

            {/* AI Result */}
            {aiResult && (
              <div className="mt-8 pt-8 border-t border-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="font-medium text-text-main leading-relaxed mb-6">"{aiResult.message}"</p>
                
                {aiResult.outfit && aiResult.outfit.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Selected Items</p>
                    <div className="flex gap-3">
                      {aiResult.outfit.map((item: any) => (
                        <div key={item.id} className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 shrink-0">
                          <img src={item.imageUrl} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiResult.missingItem && (
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 border border-rose-100">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles size={12}/> Missing Item Suggestion</p>
                    <p className="text-sm text-zinc-800 mb-4">{aiResult.missingItem.reason}</p>
                    <Link 
                      href={`/shop?q=${aiResult.missingItem.searchQuery}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-zinc-900 px-4 py-2 rounded-lg hover:bg-rose-500 transition"
                    >
                      Shop for {aiResult.missingItem.searchQuery} <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Wardrobe Grid */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {loading ? (
            <div className="text-center py-20 text-zinc-500"><Loader2 className="animate-spin mx-auto mb-2" /> Loading your closet...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-zinc-200">
              <Shirt className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
              <h3 className="font-serif text-2xl text-text-main mb-2">Your closet is empty</h3>
              <p className="text-zinc-500">Start uploading your favorite pieces to unlock AI styling.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map(item => (
                <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-accent/20 aspect-[3/4]">
                  <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm drop-shadow-md">{item.category}</p>
                    <p className="text-zinc-300 text-xs drop-shadow-md">{item.color}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-2xl mb-6">Add to Wardrobe</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Image URL</label>
                <input 
                  required 
                  type="url" 
                  placeholder="https://..."
                  value={uploadData.imageUrl} 
                  onChange={e => setUploadData({...uploadData, imageUrl: e.target.value})} 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Category</label>
                  <select 
                    value={uploadData.category} 
                    onChange={e => setUploadData({...uploadData, category: e.target.value})} 
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    <option>Top</option>
                    <option>Bottom</option>
                    <option>Outerwear</option>
                    <option>Dress</option>
                    <option>Shoes</option>
                    <option>Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Color (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Red"
                    value={uploadData.color} 
                    onChange={e => setUploadData({...uploadData, color: e.target.value})} 
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none" 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-text-main text-white py-3 rounded-xl font-bold text-sm hover:bg-primary transition shadow-md">Add Item</button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 bg-zinc-100 text-zinc-700 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
