import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, CheckCircle2, MapPin } from 'lucide-react';
import ReviewSection from '@/components/reviews/ReviewSection';

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: {
      providers: true
    }
  });

  if (!service) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="w-full bg-white border-b border-accent/20">
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Service</p>
            <h1 className="font-serif text-4xl md:text-5xl text-text-main mb-6">{service.name}</h1>
            <p className="text-text-muted text-lg mb-8 max-w-lg leading-relaxed">{service.description}</p>
            <div className="flex items-center gap-4">
              <span className="bg-zinc-100 px-4 py-2 rounded-full text-sm font-semibold text-text-main">
                Starts at ₹{service.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock size={16} /> 60-120 mins
              </span>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
            <img 
              src={service.image || "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800"} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Providers Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-text-main mb-3">Select a Professional</h2>
          <p className="text-text-muted">Choose an expert for your {service.name.toLowerCase()} session.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.providers.map(provider => (
            <div key={provider.id} className="bg-white rounded-[2rem] border border-accent/20 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5 mb-5">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                  <img src={provider.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main">{provider.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                    <Star size={14} fill="currentColor" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-zinc-400 font-normal">({provider.reviewCount})</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed line-clamp-2">
                {provider.bio}
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <CheckCircle2 size={14} /> Available Today
                </div>
                <Link 
                  href={`/services/${service.slug}/book/${provider.id}`}
                  className="w-full bg-text-main text-white font-bold text-[12px] uppercase tracking-[0.15em] py-3.5 rounded-full text-center hover:bg-primary transition shadow-md"
                >
                  Select & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewSection targetType="service" targetId={service.id} />
        
    </main>
  );
}
