import Link from "next/link";
import { Star, MapPin, Languages, CheckCircle2, Clock } from "lucide-react";

type AssistantCardProps = {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  reviews: number;
  location: string;
  languages: string[];
  availability: string;
  isVerified?: boolean;
};

export function AssistantCard({
  id,
  name,
  photoUrl,
  rating,
  reviews,
  location,
  languages,
  availability,
  isVerified = true,
}: AssistantCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-surface shadow-sm transition hover:shadow-md hover:border-accent/40">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-bold text-text-main shadow-sm backdrop-blur">
        <Star size={12} className="fill-accent text-accent" />
        {rating} <span className="font-normal text-text-muted">({reviews})</span>
      </div>

      <div className="aspect-square w-full overflow-hidden bg-background">
        <img 
          src={photoUrl} 
          alt={name} 
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-lg font-bold text-text-main">
            {name}
            {isVerified && (
              <CheckCircle2 size={16} className="fill-secondary text-white" aria-label="Verified Profile" />
            )}
          </h3>
          <span className="font-bold text-primary">₹100<span className="text-xs font-medium text-text-muted">/hr</span></span>
        </div>

        <div className="space-y-2 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-text-muted/60" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages size={14} className="text-text-muted/60" />
            <span className="line-clamp-1">{languages.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-muted/60" />
            <span className="font-medium text-primary">{availability}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link 
            href={`/services/shopping-assistant/${id}`}
            className="flex-1 rounded-full border border-primary py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            View Profile
          </Link>
          <button 
            onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover hover:shadow-primary/20"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
