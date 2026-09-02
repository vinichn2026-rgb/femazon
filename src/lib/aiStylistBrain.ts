export interface AIChatCard {
  id: string;
  title: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  link: string;
  badge?: string;
  actionText: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  cards?: AIChatCard[];
  quickReplies?: string[];
}

export const INITIAL_AI_MESSAGE: AIChatMessage = {
  id: 'msg-welcome',
  sender: 'ai',
  text: "Hello gorgeous! 🌸 I am your **Femazon AI Wedding & Couture Stylist**. \n\nWhether you're looking for your dream Bridal Lehenga, coordinating bridesmaid outfits, booking celebrity makeup artists in Coimbatore or Chennai, or need jewelry styling advice—ask me anything!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  quickReplies: [
    "👰 Bridal Lehengas under ₹50,000",
    "💄 Best Bridal Makeup Artists in Coimbatore",
    "🌿 Mehendi & Sangeet Outfits",
    "✨ How to use Virtual Try-On",
    "💍 Matching Jewelry for Maroon Lehenga",
  ]
};

const KNOWLEDGE_BASE = [
  {
    keywords: ['lehenga', 'bridal lehenga', 'wedding lehenga', 'bridal wear', 'dulhan', 'choli'],
    response: "For bridal couture, our most sought-after collections feature handcrafted zardozi embroidery, raw silk, and heritage velvet in royal crimson, plum, and champagne gold. Here are our top-rated bridal lehengas:",
    cards: [
      {
        id: 'c-1',
        title: 'Crimson Heritage Velvet Bridal Lehenga',
        category: 'Bridal Couture',
        price: 48500,
        originalPrice: 62000,
        image: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
        link: '/shop?category=Lehengas',
        badge: 'Top Bridal Pick',
        actionText: 'View Lehenga'
      },
      {
        id: 'c-2',
        title: 'Champagne Gold Embroidered Organza Lehenga',
        category: 'Cocktail & Sangeet',
        price: 36000,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600',
        link: '/shop?category=Lehengas',
        badge: 'Trending',
        actionText: 'View Lehenga'
      }
    ],
    quickReplies: [
      "🌿 Sangeet & Reception Outfits",
      "💄 Book Bridal Makeup Artist",
      "👗 Request Custom Sizing"
    ]
  },
  {
    keywords: ['makeup', 'makeup artist', 'mua', 'bridal makeup', 'hair', 'coimbatore', 'chennai', 'artist'],
    response: "We offer verified master makeup artists for HD airbrush, traditional South Indian Muhurtham glam, and soft-dewy reception looks across Coimbatore, Chennai, and Bangalore. All artists bring sanitized luxury kits (MAC, Bobbi Brown, Charlotte Tilbury).",
    cards: [
      {
        id: 'c-3',
        title: 'Master Bridal HD Glam & Draping',
        category: 'Services · Coimbatore & Chennai',
        price: 18500,
        originalPrice: 25000,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=85&w=600',
        link: '/services',
        badge: '4.9 ★ (340+ Reviews)',
        actionText: 'Book Artist'
      },
      {
        id: 'c-4',
        title: 'Muhurtham Silk Saree Pre-Pleating & Styling',
        category: 'Services · Doorstep Concierge',
        price: 4500,
        originalPrice: 6000,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=600',
        link: '/services',
        badge: 'Verified Expert',
        actionText: 'View Service'
      }
    ],
    quickReplies: [
      "📅 Check Makeup Availability",
      "👰 Bridal Lehengas under ₹50,000",
      "💬 Chat with Senior Stylist on WhatsApp"
    ]
  },
  {
    keywords: ['mehendi', 'sangeet', 'haldi', 'bridesmaid', 'bridesmaids', 'yellow', 'green'],
    response: "For vibrant Mehendi & Sangeet ceremonies, lightweight mirror-work Anarkalis, floral pre-draped sarees, and twirl-ready georgette lehengas in lime green, mustard, and tangerine are trending!",
    cards: [
      {
        id: 'c-5',
        title: 'Mustard Yellow Mirror-Work Sharara Set',
        category: 'Haldi & Mehendi',
        price: 14200,
        originalPrice: 18500,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=600',
        link: '/shop?category=Kurta+Sets',
        badge: 'Best Seller',
        actionText: 'Explore Haldi Edit'
      },
      {
        id: 'c-6',
        title: 'Emerald Green Pre-Draped Chiffon Saree',
        category: 'Sangeet Night',
        price: 18900,
        originalPrice: 24000,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=600',
        link: '/shop?category=Sarees',
        badge: 'Party Glam',
        actionText: 'View Saree'
      }
    ],
    quickReplies: [
      "✨ Try Virtual Look on Myself",
      "👰 Bridal Lehengas",
      "💍 Jewelry Recommendations"
    ]
  },
  {
    keywords: ['virtual try-on', 'try on', 'tryon', 'vton', 'camera', 'photo', 'see on me'],
    response: "Our **AI Virtual Try-On** lets you see how any designer lehenga, saree, or gown looks on your body before purchasing! \n\n1. Simply click the **'Virtual Try-On'** button on any product page.\n2. Upload a full-length photo of yourself.\n3. Our neural AI drapes the garment with realistic physics and lighting!",
    cards: [
      {
        id: 'c-7',
        title: 'AI Virtual Try-On Studio',
        category: 'Interactive Experience',
        price: 0,
        image: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
        link: '/shop',
        badge: 'Instant AI Fitting',
        actionText: 'Try On a Product'
      }
    ],
    quickReplies: [
      "👗 Browse Try-On Enabled Outfits",
      "👰 Bridal Lehengas under ₹50,000",
      "💬 Connect with Stylist on WhatsApp"
    ]
  },
  {
    keywords: ['jewelry', 'jewellery', 'necklace', 'earrings', 'kundan', 'polki', 'maroon', 'gold'],
    response: "For a **Royal Maroon or Wine Velvet Lehenga**, we recommend:\n\n• **Antique Matte Gold or Jadau Polki** choker with emerald droplet accents to create stunning contrast.\n• A delicate **Matha Patti** and oversized **Chandbali earrings**.\n• Minimal glass bangles paired with statement kadas.",
    cards: [
      {
        id: 'c-8',
        title: 'Heritage Polki & Emerald Choker Set',
        category: 'Bridal Jewellery',
        price: 12500,
        originalPrice: 16000,
        image: 'https://images.unsplash.com/photo-1535615615570-3b839f4359be?auto=format&fit=crop&q=85&w=600',
        link: '/shop',
        badge: 'Handcrafted',
        actionText: 'Explore Jewellery'
      }
    ],
    quickReplies: [
      "👰 Show Velvet Lehengas",
      "💄 Book Muhurtham Makeup",
      "💬 Ask Human Stylist on WhatsApp"
    ]
  },
  {
    keywords: ['budget', 'price', 'under 20000', 'under 30000', 'under 50000', 'affordable', 'cost'],
    response: "We have exquisite designer edits across every budget point with zero compromise on craftsmanship:\n\n• **Under ₹15,000**: Festive Kurta sets, organza anarkalis & pre-draped sarees.\n• **₹15,000 - ₹35,000**: Sangeet & Reception lehengas with mirror & sequin work.\n• **₹35,000 - ₹75,000**: Premium heirloom bridal velvet & silk lehengas.",
    cards: [
      {
        id: 'c-9',
        title: 'Affordable Designer Wedding Edit',
        category: 'Budget Friendly',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600',
        link: '/shop',
        badge: 'Curated Deals',
        actionText: 'Shop under ₹30,000'
      }
    ],
    quickReplies: [
      "👰 Bridal Lehengas",
      "🌿 Mehendi Outfits",
      "💬 WhatsApp Wedding Concierge"
    ]
  },
  {
    keywords: ['venue', 'venues', 'mandapam', 'hall', 'resort', 'coimbatore venue'],
    response: "Looking for top wedding venues & convention halls in Coimbatore or Nilgiris? Our wedding concierge team helps you book & coordinate with premier banquet halls, open-lawn resorts in Pollachi & Anaikatti, and heritage mandapams with full decor styling.",
    cards: [
      {
        id: 'c-10',
        title: 'Wedding Concierge & Venue Coordination',
        category: 'Full Wedding Planning',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=600',
        link: '/services',
        badge: 'Concierge Desk',
        actionText: 'Request Venue Scout'
      }
    ],
    quickReplies: [
      "💄 Bridal Makeup in Coimbatore",
      "👰 Bridal Lehengas",
      "💬 Direct WhatsApp Concierge"
    ]
  }
];

export function getAIStylistResponse(userInput: string): {
  text: string;
  cards?: AIChatCard[];
  quickReplies?: string[];
} {
  const cleanInput = userInput.toLowerCase().trim();

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => cleanInput.includes(kw))) {
      return {
        text: item.response,
        cards: item.cards,
        quickReplies: item.quickReplies
      };
    }
  }

  // Fallback smart response
  return {
    text: `I'd love to help you with "${userInput}"! As your luxury wedding & styling assistant, I can help you pick designer lehengas, book verified makeup artists in Coimbatore/Tamil Nadu, customize blouse cuts, or plan your complete bridal trousseau. \n\nWhat would you like to explore?`,
    cards: [
      {
        id: 'c-fallback',
        title: 'Explore Femazon Bridal & Festive Collection',
        category: 'Full Catalog',
        image: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
        link: '/shop',
        actionText: 'Browse Collection'
      },
      {
        id: 'c-services',
        title: 'Book Bridal Glamour & Styling Services',
        category: 'Services',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=85&w=600',
        link: '/services',
        actionText: 'Explore Services'
      }
    ],
    quickReplies: [
      "👰 Bridal Lehengas under ₹50,000",
      "💄 Best Makeup Artists in Coimbatore",
      "💬 Chat with Senior Stylist on WhatsApp"
    ]
  };
}
