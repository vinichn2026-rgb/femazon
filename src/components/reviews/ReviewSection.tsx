"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; image?: string };
};

type ReviewSectionProps = {
  targetType: "product" | "service" | "provider" | "vendor";
  targetId: number;
};

export default function ReviewSection({ targetType, targetId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [targetType, targetId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${targetType}/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    const payload = {
      rating,
      comment,
      ...(targetType === 'product' && { productId: targetId }),
      ...(targetType === 'service' && { serviceId: targetId }),
      ...(targetType === 'provider' && { providerId: targetId }),
      ...(targetType === 'vendor' && { vendorId: targetId }) // Note: we designed API to accept provider/service/product. 
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }
      
      setShowForm(false);
      setComment("");
      setRating(5);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-center text-zinc-400 animate-pulse">Loading reviews...</div>;

  return (
    <div className="py-12 border-t border-accent/10 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl text-text-main flex items-center gap-3">
            Customer Reviews
            {total > 0 && <span className="text-sm font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">{total}</span>}
          </h2>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={16} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="font-bold text-text-main">{averageRating} out of 5</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-white border border-accent/20 text-text-main font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-sm hover:border-primary/30 transition-colors"
        >
          {showForm ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#fbf9f6] p-6 md:p-8 rounded-[2rem] border border-accent/10 mb-10">
          <h3 className="font-serif text-xl text-text-main mb-6">Share your experience</h3>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6">{error}</div>}
          
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 transition-colors ${rating >= star ? 'text-amber-400' : 'text-zinc-300 hover:text-amber-200'}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Review</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-white border border-accent/20 rounded-xl p-4 focus:outline-none focus:border-primary/50 text-text-main"
              placeholder="What did you like or dislike?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-text-main text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-md hover:bg-primary transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {total === 0 && !showForm ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-100 rounded-3xl">
          <MessageSquare className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
          <h3 className="font-serif text-xl text-zinc-600 mb-2">No reviews yet</h3>
          <p className="text-zinc-400 max-w-sm mx-auto">Be the first to review this {targetType} and help other shoppers make informed decisions.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-accent/10 p-6 md:p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                    <img src={review.user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"} alt={review.user.name || "User"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-main">{review.user.name || "Verified Customer"}</h4>
                    <p className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
