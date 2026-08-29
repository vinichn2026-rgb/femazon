"use client";

import React, { useState } from "react";
import { Star, MessageSquare, CheckCircle2, ThumbsUp, X, Sparkles, ArrowRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  avatar: string;
  title: string;
  review: string;
  purchasedItem: string;
  itemImage?: string;
  likes: number;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ananya Sharma",
    location: "Mumbai, India",
    rating: 5,
    date: "2 days ago",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    title: "Ethereal Bridal Kurta & Saree Experience!",
    review:
      "Ordered the silk hand-embroidered kurta set for my sister's Sangeet. The packaging, fabric quality, and fitting were absolute perfection. Felt like haute couture!",
    purchasedItem: "Chikankari Silk Kurta Set",
    itemImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=300&auto=format&fit=crop",
    likes: 34,
  },
  {
    id: "2",
    name: "Pooja Hegde",
    location: "Bangalore, India",
    rating: 5,
    date: "1 week ago",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    title: "The AI Wardrobe suggestions nailed my look!",
    review:
      "I uploaded my existing wardrobe and the AI recommended matching this linen co-ord set. Received so many compliments at brunch. Love the luxury styling service too!",
    purchasedItem: "Linen Monochrome Co-ord Set",
    itemImage: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=300&auto=format&fit=crop",
    likes: 19,
  },
  {
    id: "3",
    name: "Dr. Meera Iyer",
    location: "Chennai, India",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    title: "Flawless Bridal Makeup & Styling Service",
    review:
      "Booked a verified bridal makeup artist and shopping assistant through Femazon. The artist arrived on time with top luxury products. 10/10 recommended for every bride!",
    purchasedItem: "Bridal Styling & Glam Package",
    itemImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=300&auto=format&fit=crop",
    likes: 42,
  },
  {
    id: "4",
    name: "Rhea Kapoor",
    location: "Delhi, India",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    title: "Unmatched Designer Quality & Rapid Delivery",
    review:
      "Prepaid order arrived in just 2 days with beautiful sustainable packaging. The pre-draped saree is effortless to wear and looks glamorous.",
    purchasedItem: "Pre-Draped Georgette Saree",
    itemImage: "https://images.unsplash.com/photo-1610189046647-7589d70081d1?q=80&w=300&auto=format&fit=crop",
    likes: 27,
  },
];

export function HomeReviewsSection() {
  const [reviews, setReviews] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [itemPurchased, setItemPurchased] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    const newReview: Testimonial = {
      id: Date.now().toString(),
      name: name.trim(),
      location: location.trim() || "India",
      rating: userRating,
      date: "Just now",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      title: title.trim() || "Verified Experience",
      review: reviewText.trim(),
      purchasedItem: itemPurchased.trim() || "Femazon Designer Collection",
      likes: 1,
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setName("");
      setLocation("");
      setTitle("");
      setReviewText("");
      setItemPurchased("");
    }, 1500);
  };

  return (
    <section className="py-10 md:py-14 bg-[#FDFBF7] border-y border-stone-200/70 relative">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A1513]/5 text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles size={12} className="text-primary" />
              <span>Verified Client Love</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-text-main tracking-tight leading-tight">
              Loved by Thousands of Women
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-xl font-sans">
              Discover real reviews and styling experiences from our verified clients worldwide.
            </p>
          </div>

          {/* Rating Summary & Write Review Button */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200/80 w-full sm:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3 pr-3 sm:pr-6 border-r border-stone-200">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                4.9
              </div>
              <div>
                <div className="flex text-amber-500 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[9.5px] sm:text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  12,450+ Reviews
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-1.5 sm:gap-2 bg-[#3D110F] hover:bg-[#2A0B09] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Rate & Review</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {reviews.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md border border-stone-200/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* User Info & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h3 className="font-sans text-[13px] font-bold text-text-main flex items-center gap-1.5">
                        {item.name}
                        {item.verified && (
                          <CheckCircle2
                            size={14}
                            className="text-emerald-600 inline"
                            title="Verified Buyer"
                          />
                        )}
                      </h3>
                      <p className="text-[11px] text-text-muted">{item.location}</p>
                    </div>
                  </div>
                </div>

                {/* Stars & Title */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted">
                    {item.date}
                  </span>
                </div>

                <h4 className="font-serif text-base font-normal text-text-main mb-2 leading-snug">
                  {item.title}
                </h4>

                <p className="font-sans text-xs text-text-muted leading-relaxed line-clamp-4 mb-4">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Purchased Tag & Likes */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  {item.itemImage && (
                    <img
                      src={item.itemImage}
                      alt={item.purchasedItem}
                      className="w-7 h-7 rounded-md object-cover shrink-0"
                    />
                  )}
                  <span className="text-[11px] font-medium text-text-muted truncate">
                    {item.purchasedItem}
                  </span>
                </div>

                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-primary transition-colors shrink-0"
                >
                  <ThumbsUp size={12} />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Write a Review / Rate & Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-text-main p-1"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl text-text-main mb-2">Thank You!</h3>
                <p className="text-sm text-text-muted">
                  Your review and rating have been posted successfully.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-center">
                  <h3 className="font-serif text-2xl sm:text-3xl text-text-main mb-1">
                    Rate Your Experience
                  </h3>
                  <p className="text-xs text-text-muted">
                    Share your feedback on products, fabric quality, or styling services.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div className="flex flex-col items-center justify-center p-3 bg-stone-50 rounded-2xl mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Tap to Rate
                    </span>
                    <div className="flex gap-2 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={28}
                            fill={userRating >= star ? "currentColor" : "none"}
                            className={
                              userRating >= star ? "text-amber-500" : "text-stone-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priyadarshini R."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Chennai"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Product or Service Purchased */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Product or Service Name
                    </label>
                    <input
                      type="text"
                      value={itemPurchased}
                      onChange={(e) => setItemPurchased(e.target.value)}
                      placeholder="e.g. Festive Anarkali Set / Makeup Service"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Outstanding craftsmanship & fitting!"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your honest thoughts about the fabric, style, delivery or stylist experience..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#3D110F] text-white font-bold text-xs uppercase tracking-[0.2em] py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
