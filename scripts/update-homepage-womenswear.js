const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');
pageCode = pageCode.replace(/\r\n/g, '\n');

const oldAiWardrobeSection = `      {/* 7. AI Smart Wardrobe Experience */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 my-6 sm:my-8 md:my-12">
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FDFBF7] flex flex-col lg:flex-row items-stretch shadow-sm border border-accent/20">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 h-[220px] sm:h-[340px] lg:h-auto relative min-h-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&h=1400&auto=format&fit=crop&crop=center" 
              alt="AI Wardrobe Experience" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text Side */}
          <div className="w-full lg:w-1/2 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-primary block mb-1.5 sm:mb-2">
              Digital Closet Intelligence
            </span>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-text-main tracking-wide mb-3 sm:mb-4 leading-tight">
              Your Style. Your Wardrobe. <br className="hidden sm:block"/><span className="italic font-light text-primary">Powered by AI.</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed mb-4 sm:mb-6 max-w-md">
              Discover curated daily outfit ideas based on what you already own and find the missing designer pieces to complete your signature look.
            </p>
            
            {/* 4-Step Visual */}
            <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">1</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Upload Your Outfits</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">2</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Organize Digital Closet</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">3</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Get Daily AI Recommendations</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">4</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Shop Missing Designer Pieces</span>
              </div>
            </div>

            <div>
              <Link href="/ai-wardrobe" className="group inline-flex items-center gap-2 bg-[#3D110F] hover:bg-[#2A0B09] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 sm:py-3 px-6 sm:px-8 transition-all duration-300 rounded-full shadow-md hover:shadow-lg active:scale-95">
                <span>Explore AI Wardrobe</span>
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>`;

const newBoutiqueSpotlightSection = `      {/* 7. Women's Wear Boutique & Artisan Spotlight */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 my-6 sm:my-8 md:my-12">
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FDFBF7] flex flex-col lg:flex-row items-stretch shadow-sm border border-stone-200/80">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 h-[240px] sm:h-[360px] lg:h-auto relative min-h-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&h=1400&auto=format&fit=crop&crop=center" 
              alt="Femazon Women's Wear Boutiques" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#4A1513] uppercase tracking-wider shadow-xs">
              Verified Boutiques &amp; Sellers
            </div>
          </div>
          {/* Text Side */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5 sm:mb-2">
              Everything Women Love, All in One Place
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-stone-900 tracking-wide mb-3 sm:mb-4 leading-tight">
              Curated Women's Wear <br className="hidden sm:block"/><span className="italic font-light text-[#4A1513]">From 100+ Boutiques</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 max-w-md">
              From pure Kanjeevaram weaves and handcrafted Lucknowi Chikankari to contemporary power blazers and inclusive curve fashion — discover garments tailored for every moment of a woman&apos;s life.
            </p>
            
            {/* 4 Pillars Visual */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">14 Categories</span>
                <span className="text-[11px] text-stone-500">Sarees to Activewear</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Direct Sellers</span>
                <span className="text-[11px] text-stone-500">Verified Artisans &amp; Boutiques</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Inclusive Sizing</span>
                <span className="text-[11px] text-stone-500">XS to 6XL &amp; Maternity</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Express Dispatch</span>
                <span className="text-[11px] text-stone-500">Ships within 24-48 Hours</span>
              </div>
            </div>

            <div>
              <Link href="/womens-wear" className="group inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#38100e] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] py-3 px-8 transition-all duration-300 rounded-full shadow-md hover:shadow-lg active:scale-95">
                <span>Explore Women&apos;s Wear Collection</span>
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>`;

if (pageCode.includes(oldAiWardrobeSection)) {
  pageCode = pageCode.replace(oldAiWardrobeSection, newBoutiqueSpotlightSection);
  fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');
  console.log('[OK] Replaced AI Wardrobe with Women\'s Wear Boutique Spotlight in src/app/page.tsx');
} else {
  console.log('[WARN] oldAiWardrobeSection not matched exactly in src/app/page.tsx');
}
