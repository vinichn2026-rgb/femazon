export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., "90 mins", "3 hours", "Full Day"
  description: string;
  inclusions: string[];
  isPopular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export interface ProfessionalReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking: boolean;
}

export interface BeautyProfessional {
  id: string;
  slug: string;
  name: string;
  subtitle?: string; // e.g., "(Sample Artist Account)"
  category: "Makeup Artists" | "Hair Stylists" | "Mehendi/Henna Artists" | "Saree Draping Specialists" | "Personal Stylists";
  speciality: string;
  location: string;
  city: string;
  profileImage: string;
  coverImage?: string;
  heroLookImage?: string; // High-res portrait look image featured in cards
  tag?: string; // e.g., "New", "4.96 ★", "Celebrity"
  occasionTags?: string[]; // e.g. ["Bridal", "Party & Glam", "Editorial & HD", "Men's Grooming", "Hair & Style", "SFX & Artistic"]
  serviceLocationType?: "At Home" | "At Studio" | "Both";
  rating: number;
  reviewCount: number;
  startingPrice: number;
  experienceYears: number;
  bio: string;
  verified: boolean;
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  availableSlots: string[]; // e.g. ["06:30 AM", "09:00 AM", "11:30 AM", "03:00 PM", "06:30 PM"]
  reviews: ProfessionalReview[];
}

export const PROFESSIONAL_CATEGORIES = [
  "All Categories",
  "Makeup Artists",
  "Hair Stylists",
  "Mehendi/Henna Artists",
  "Saree Draping Specialists",
  "Personal Stylists"
] as const;

export const ROOP_OCCASION_CATEGORIES = [
  "All",
  "Bridal",
  "Party & Glam",
  "Editorial & HD",
  "Men's Grooming",
  "Hair & Style",
  "SFX & Artistic"
] as const;

export const ROOP_CITIES = [
  "All Cities",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Chennai",
  "Hyderabad",
  "Nagpur"
] as const;

export const ROOP_BUDGET_RANGES = [
  "Any budget",
  "Under ₹3,000",
  "₹3,000 - ₹8,000",
  "₹8,000 - ₹15,000",
  "Above ₹15,000"
] as const;

export const INITIAL_BEAUTY_PROFESSIONALS: BeautyProfessional[] = [
  {
    id: "roop-1",
    slug: "suraksha-reddy",
    name: "Suraksha Reddy",
    subtitle: "(Sample Artist Account)",
    category: "Makeup Artists",
    speciality: "Luxury Bridal & Temple Muhurtham Aesthetics",
    location: "Bengaluru, RR Nagar",
    city: "Bengaluru",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=face",
    heroLookImage: "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1400&auto=format&fit=crop",
    tag: "New",
    occasionTags: ["Bridal", "Editorial & HD", "Party & Glam"],
    serviceLocationType: "Both",
    rating: 5.0,
    reviewCount: 18,
    startingPrice: 11000,
    experienceYears: 7,
    bio: "Certified bridal artist specializing in bespoke South Indian & North Indian bridal makeup, HD airbrushing, and radiant occasion glam with premium luxury kit.",
    verified: true,
    availableSlots: ["06:00 AM", "09:30 AM", "01:30 PM", "05:00 PM"],
    portfolio: [
      {
        id: "sr-1",
        title: "Traditional Heritage Muhurtham Bride",
        category: "Bridal",
        image: "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg",
        description: "Regal crimson drape with warm golden contour and deep berry kohl finish."
      },
      {
        id: "sr-2",
        title: "Dewy Champagne Cocktail Glow",
        category: "Party & Glam",
        image: "/images/dress/western-wear/cocktail-party-nights/Emerald_green_saree_gown_displayed_202609091724.jpeg",
        description: "Glass skin finish with custom-blended nude gloss."
      }
    ],
    packages: [
      {
        id: "pkg-sr-1",
        name: "Cocktail Party Glam",
        price: 11000,
        duration: "90 mins",
        description: "High-definition makeup with eyelash enhancements and signature hair setting.",
        inclusions: [
          "Pre-makeup cryogenic hydration prep",
          "HD transfer-proof custom base",
          "Premium 3D lash application",
          "Hair styling (waves, sleek pony or half updo)",
          "Touch-up kit"
        ],
        isPopular: false
      },
      {
        id: "pkg-sr-2",
        name: "Signature Bridal Muhurtham",
        price: 24000,
        duration: "3.5 hours",
        description: "Full royal bridal makeup with waterproof tear-proof setting, jewelry placement & drape assistance.",
        inclusions: [
          "Airbrush or Ultra-HD micro droplet foundation",
          "Mathapatti & Maang Tikka precision setting",
          "Saree/Lehenga draping assistance",
          "Long-wear waterproof seal",
          "Full bridal emergency touch-up box"
        ],
        isPopular: true
      }
    ],
    reviews: [
      {
        id: "rev-sr-1",
        author: "Aishwarya Rao",
        location: "Bengaluru",
        rating: 5,
        date: "1 week ago",
        comment: "Suraksha is phenomenal! My makeup looked completely skin-like and lasted 14 hours in Bengaluru heat.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "roop-2",
    slug: "almas-qureshi",
    name: "Almas Qureshi",
    category: "Makeup Artists",
    speciality: "Sangeet Glow, Occasion Glam & Dewy Soft Radiance",
    location: "Bengaluru, All locations in Bengaluru",
    city: "Bengaluru",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop&crop=face",
    heroLookImage: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1400&auto=format&fit=crop",
    tag: "New",
    occasionTags: ["Bridal", "Party & Glam", "Hair & Style"],
    serviceLocationType: "At Home",
    rating: 4.9,
    reviewCount: 12,
    startingPrice: 1800,
    experienceYears: 5,
    bio: "Expert bridal and festive makeup artist offering door-to-door services across Bengaluru. Renowned for soft glam, lightweight skin prep, and ethnic hair styling.",
    verified: true,
    availableSlots: ["08:00 AM", "11:00 AM", "02:30 PM", "06:00 PM"],
    portfolio: [
      {
        id: "aq-1",
        title: "Rose Gold Festive Glow",
        category: "Party & Glam",
        image: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1000&auto=format&fit=crop",
        description: "Soft rose tint on eyes and cheeks with luminous skin."
      }
    ],
    packages: [
      {
        id: "pkg-aq-1",
        name: "Express Party Makeover",
        price: 1800,
        duration: "60 mins",
        description: "Quick radiant makeover with natural base, liner and light curls.",
        inclusions: [
          "Moisturizing skin barrier prep",
          "Natural medium coverage base",
          "Kohl eyeliner & mascara",
          "Soft curls or straight blow-dry"
        ],
        isPopular: true
      },
      {
        id: "pkg-aq-2",
        name: "Sangeet & Mehendi Glam",
        price: 4500,
        duration: "100 mins",
        description: "Vibrant ethnic glam with glitter touches and floral braid styling.",
        inclusions: [
          "HD long-stay foundation",
          "Color matching eyeshadow & glitter accents",
          "Flower setting or accessory placement in hair",
          "Setting spray lock"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "rev-aq-1",
        author: "Pooja Hegde",
        location: "Bengaluru",
        rating: 5,
        date: "3 days ago",
        comment: "Super punctual and very gentle! She arrived right on time at my apartment in Indiranagar.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "roop-3",
    slug: "zoya-sheikh",
    name: "Zoya sheikh",
    category: "Hair Stylists",
    speciality: "Graphic Wing Liner, Runway Dewy Looks & Sleek Hairstyles",
    location: "Nagpur , Sitabuldi",
    city: "Nagpur",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop&crop=face",
    heroLookImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&h=1000&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1400&auto=format&fit=crop",
    tag: "New",
    occasionTags: ["Party & Glam", "Editorial & HD", "Hair & Style"],
    serviceLocationType: "At Studio",
    rating: 4.88,
    reviewCount: 24,
    startingPrice: 3000,
    experienceYears: 6,
    bio: "High-fashion makeup and hair creative based in Nagpur. Known for statement glitter cut-creases, sculpted cheekbones, and Hollywood ponytail styling for cocktail receptions.",
    verified: true,
    availableSlots: ["10:00 AM", "01:00 PM", "04:00 PM", "07:30 PM"],
    portfolio: [
      {
        id: "zs-1",
        title: "Golden Winged Cut Crease & Ponytail",
        category: "Editorial & HD",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&h=1000&auto=format&fit=crop",
        description: "Gilded eyeliner with textured high volume ponytail and ear statement cuff."
      }
    ],
    packages: [
      {
        id: "pkg-zs-1",
        name: "Cocktail Haute Glam & Hair",
        price: 3000,
        duration: "75 mins",
        description: "Sharp winged eye look, sculpt contour, and red carpet hair styling.",
        inclusions: [
          "Matte Velvet Skin base",
          "Custom glitter winged liner",
          "Textured high ponytail or sleek glass hair",
          "Complimentary ear cuff styling"
        ],
        isPopular: true
      }
    ],
    reviews: [
      {
        id: "rev-zs-1",
        author: "Simran K.",
        location: "Nagpur",
        rating: 5,
        date: "2 weeks ago",
        comment: "Zoya is a true artist! Her eye makeup technique is out of this world.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "roop-4",
    slug: "vikram-rathore",
    name: "Vikram Rathore",
    category: "Personal Stylists",
    speciality: "Men's Royal Grooming, Beard Sculpting & Sherwani Draping",
    location: "Mumbai, Juhu",
    city: "Mumbai",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop&crop=face",
    heroLookImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop",
    tag: "New",
    occasionTags: ["Men's Grooming", "Editorial & HD"],
    serviceLocationType: "Both",
    rating: 4.95,
    reviewCount: 38,
    startingPrice: 4500,
    experienceYears: 8,
    bio: "Celebrity groom stylist in Mumbai specializing in camera-ready groom skin prep, royal turban (Safa) tying, beard architecture, and sherwani accessories curation.",
    verified: true,
    availableSlots: ["07:00 AM", "10:30 AM", "02:00 PM", "05:30 PM"],
    portfolio: [
      {
        id: "vr-1",
        title: "Regal Royal Groom Safa & Styling",
        category: "Men's Grooming",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
        description: "Classic Rajasthani silk safa with kalgi pin and bespoke groom grooming."
      }
    ],
    packages: [
      {
        id: "pkg-vr-1",
        name: "Groom Wedding Day Architecture",
        price: 4500,
        duration: "90 mins",
        description: "Comprehensive groom preparation including skin de-shine, hair sculpting & turban draping.",
        inclusions: [
          "Matte camera anti-shine skin barrier",
          "Beard trimming and precision lining",
          "Royal Safa tying & Kalgi anchor",
          "Pocket square & necklace alignment"
        ],
        isPopular: true
      }
    ],
    reviews: [
      {
        id: "rev-vr-1",
        author: "Karan Johar S.",
        location: "Mumbai",
        rating: 5,
        date: "1 month ago",
        comment: "Took care of my safa and groom styling effortlessly on my wedding day.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-1",
    slug: "aananya-sundaram",
    name: "Aananya Sundaram",
    category: "Makeup Artists",
    speciality: "Luxury Bridal & HD Airbrush Makeup",
    location: "T. Nagar & Cathedral Road, Chennai",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1400&auto=format&fit=crop",
    rating: 4.96,
    reviewCount: 128,
    startingPrice: 8500,
    experienceYears: 9,
    bio: "Certified international bridal beauty educator specializing in glass-skin Indian bridal aesthetics, long-wear HD foundation, and lightweight airbrushing that holds up gracefully under hot muhurtham lights.",
    verified: true,
    availableSlots: ["06:00 AM", "09:30 AM", "01:00 PM", "04:30 PM", "07:00 PM"],
    portfolio: [
      {
        id: "p1-1",
        title: "Traditional Tamil Muhurtham Bride",
        category: "Bridal",
        image: "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg",
        description: "Regal crimson drape with warm golden contour and deep berry kohl finish."
      },
      {
        id: "p1-2",
        title: "Sunset Sangeet Dewy Glow",
        category: "Sangeet",
        image: "/images/dress/sarees/organza-tissue/Woman_wearing_fuchsia_pink_saree_202609091713.jpeg",
        description: "Soft rose gold cheek shimmer paired with luminous silk lips."
      },
      {
        id: "p1-3",
        title: "Grand Evening Reception Glam",
        category: "Reception",
        image: "/images/dress/western-wear/reception-glamour/Woman_modeling_black_crystal_saree_202609091720.jpeg",
        description: "Smokey crystal eyeliner with sculpted contour and nude velvet lip."
      },
      {
        id: "p1-4",
        title: "Airbrush Natural Day Bride",
        category: "Muhurtham",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        description: "Flawless skin-like airbrush base with water-resistant finish."
      }
    ],
    packages: [
      {
        id: "pkg-1-1",
        name: "Party Glam HD Makeup",
        price: 8500,
        duration: "90 mins",
        description: "Ideal for bridesmaids, sangeet guests, and milestone cocktail parties.",
        inclusions: [
          "Complete skin prep with luxury hydrating serum",
          "Custom HD blend foundation & soft contouring",
          "Natural mink lash extension application",
          "Hydra-matte smudge-proof lip setting",
          "Emergency touch-up kit with blotting paper and lipstick pot"
        ],
        isPopular: false
      },
      {
        id: "pkg-1-2",
        name: "Bridal Muhurtham Signature",
        price: 18500,
        duration: "3 hours",
        description: "Complete signature bridal session engineered to endure 12+ hours with zero cakeiness.",
        inclusions: [
          "Pre-makeup cryogenic facial prep & hydration infusion",
          "HD Airbrush or Micro-droplet foundation tailored to skin type",
          "Waterproof sweat-resistant teardrop lock eyes",
          "Bindi, nose ring & bridal jewelry anchor adjustments",
          "Full size luxury mini lipstick touch-up kit"
        ],
        isPopular: true
      },
      {
        id: "pkg-1-3",
        name: "Grand Wedding Duo (Muhurtham + Reception)",
        price: 32000,
        duration: "Full Day (2 Events)",
        description: "Continuous luxury attention across both day ceremony and evening reception with full look transition.",
        inclusions: [
          "Morning Traditional Muhurtham complete bridal look",
          "Evening Reception look transformation (makeup, hair transition, glow boost)",
          "Complimentary express touch-up for Mother of the Bride",
          "On-site standby artist assistance during family photoshoot",
          "Luxury bridal emergency kit"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Meenakshi Ramanathan",
        location: "Chennai",
        rating: 5,
        date: "2 weeks ago",
        comment: "Aananya made my wedding morning completely stress-free! My airbrush makeup stayed glowing through 5 hours of fire rituals without a single crease. Everyone praised how natural yet stunning I looked.",
        verifiedBooking: true
      },
      {
        id: "r2",
        author: "Lavanya Narayanan",
        location: "Bangalore",
        rating: 5,
        date: "Last month",
        comment: "Booked her for my sister's reception. Her hygiene practices and speed are unmatched. The lip shade she custom-mixed matched my Kanjeevaram border so exquisitely!",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-2",
    slug: "kavitha-krishnan",
    name: "Kavitha Krishnan",
    category: "Saree Draping Specialists",
    speciality: "Master Draper — 100+ Pleat Styles & Iron-Free Draping",
    location: "Mylapore & Besant Nagar, Chennai",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1400&auto=format&fit=crop",
    rating: 5.0,
    reviewCount: 94,
    startingPrice: 1500,
    experienceYears: 14,
    bio: "Renowned celebrity saree drapist revered across South Indian weddings. Known for pin-perfect micro pleating that hugs the waist without tearing delicate silk zari borders or shifting during long hours of walking.",
    verified: true,
    availableSlots: ["05:30 AM", "07:00 AM", "10:00 AM", "02:30 PM", "05:00 PM"],
    portfolio: [
      {
        id: "p2-1",
        title: "Signature Sharp Kanjeevaram Box Pleat",
        category: "Bridal Draping",
        image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
        description: "Zero bulk waist contour with knife-edge pallu alignment."
      },
      {
        id: "p2-2",
        title: "Pre-Pleated 1-Minute Draped Saree",
        category: "Pre-Draped",
        image: "/images/dress/sarees/pant-dhoti-sarees/Woman_wearing_dhoti_saree_202609091705.jpeg",
        description: "Contemporary fluid drape styled with dhoti pleats for effortless movement."
      },
      {
        id: "p2-3",
        title: "Traditional 9-Yard Madisar Draping",
        category: "Madisar",
        image: "/images/dress/sarees/classic-6-yard-drapes/Woman_wearing_red_silk_saree_202609091700.jpeg",
        description: "Comfortable authentic Iyer and Iyengar styles with all-day comfort."
      },
      {
        id: "p2-4",
        title: "Modern Mermaid Saree Gown Cut",
        category: "Reception",
        image: "/images/dress/western-wear/cocktail-party-nights/Emerald_green_saree_gown_displayed_202609091724.jpeg",
        description: "Sculpted pallu trail pinned securely for dinner dancing."
      }
    ],
    packages: [
      {
        id: "pkg-2-1",
        name: "Single Saree Perfect Pin-Up",
        price: 1500,
        duration: "35 mins",
        description: "For wedding guests, pooja celebrations, and formal ceremonies.",
        inclusions: [
          "Professional body-contour pleating and waist shaping",
          "Special silicone-coated safety pins to protect delicate zari",
          "Pallu weight balancing to prevent shoulder strain",
          "Ironing touch-up on pleat edges if required"
        ],
        isPopular: false
      },
      {
        id: "pkg-2-2",
        name: "Bridal Kanjeevaram Signature Draping",
        price: 3500,
        duration: "60 mins",
        description: "The gold standard for the bride. Includes waist belt anchor and veil setting.",
        inclusions: [
          "Heavy gold zari Kanjeevaram structural pleating",
          "Odiyanam (waist belt) locking & anti-slip lining",
          "Head veil / second dupatta draping and pinning",
          "Emergency movement drill to ensure 100% sitting/walking ease"
        ],
        isPopular: true
      },
      {
        id: "pkg-2-3",
        name: "Family Wedding Party Draping (Up to 5 Pax)",
        price: 6500,
        duration: "2.5 hours",
        description: "Bride + 4 family members styled swiftly during early morning muhurtham hours.",
        inclusions: [
          "Bridal master drape + 4 bridesmaid/family sarees",
          "Coordinated pleat styling matching family theme",
          "Dedicated assistant on-site for rapid turnaround",
          "Complimentary safety pin & styling accessory kit"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "r2-1",
        author: "Divya Swaminathan",
        location: "Chennai",
        rating: 5,
        date: "3 weeks ago",
        comment: "Kavitha akka arrived at 5:00 AM sharp! My heavy wedding saree felt as light as feather and the pleats did not move an inch through the entire 4-hour ceremony.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-3",
    slug: "farhana-sheikh",
    name: "Farhana Sheikh",
    category: "Mehendi/Henna Artists",
    speciality: "Organic Dark-Stain Rajasthani & Arabic Bridal Henna",
    location: "Nungambakkam & Egmore, Chennai",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1400&auto=format&fit=crop",
    rating: 4.95,
    reviewCount: 112,
    startingPrice: 2500,
    experienceYears: 8,
    bio: "Artisan henna designer formulating our own 100% pure organic Sojat henna with nilgiri eucalyptus oils. Renowned for dark mahogany stains, custom love story motifs, and symmetrical Rajasthani jali work.",
    verified: true,
    availableSlots: ["10:00 AM", "01:30 PM", "04:30 PM", "07:30 PM"],
    portfolio: [
      {
        id: "p3-1",
        title: "Royal Storytelling Bridal Henna",
        category: "Bridal",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
        description: "Intricate Radha-Krishna and palanquin motifs running up to the elbows."
      },
      {
        id: "p3-2",
        title: "Modern Arabic Floral Negative Space",
        category: "Arabic",
        image: "https://images.unsplash.com/photo-1560031802-9a741366b26c?q=80&w=800&auto=format&fit=crop",
        description: "Bold shaded roses with delicate geometric netting."
      },
      {
        id: "p3-3",
        title: "Minimalist Mandala Palms",
        category: "Festive",
        image: "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800&auto=format&fit=crop",
        description: "Refined sacred geometry mandala centered with fingertip caps."
      }
    ],
    packages: [
      {
        id: "pkg-3-1",
        name: "Festive Palms & Backhands",
        price: 2500,
        duration: "60 mins",
        description: "Both hands front and back till wrist, perfect for Diwali, Eid, and Karwa Chauth.",
        inclusions: [
          "Freshly rolled organic nilgiri henna cones",
          "Choice between floral Arabic or traditional mandala",
          "Doorstep home visit included within city limits",
          "Aftercare lemon-sugar glaze application"
        ],
        isPopular: false
      },
      {
        id: "pkg-3-2",
        name: "Royal Heritage Bridal Package",
        price: 7500,
        duration: "4 hours",
        description: "Elbow-length bridal masterpiece on both hands plus intricate bridal feet design.",
        inclusions: [
          "Bespoke love story elements (proposal date, skyline, initials)",
          "Elbow-length front & back intricate Rajasthani art",
          "Bridal feet design up to mid-calf",
          "Complimentary herbal clove sealant & aftercare balm kit"
        ],
        isPopular: true
      },
      {
        id: "pkg-3-3",
        name: "Sangeet Party Group Package (Up to 10 Guests)",
        price: 14000,
        duration: "4 hours",
        description: "2 artists at venue providing fast, elegant designs for wedding guests.",
        inclusions: [
          "2 professional henna artists stationed at your venue",
          "Fast-track elegant strip designs for up to 10-12 guests",
          "All organic cones and aftercare sprays provided",
          "Dedicated focus on bride's closest family"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "r3-1",
        author: "Shabana Begum",
        location: "Chennai",
        rating: 5,
        date: "1 month ago",
        comment: "Her cones smell so natural and pure. The stain turned deep dark mahogany on my wedding day! All my relatives asked for her contact.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-4",
    slug: "deepak-verma",
    name: "Deepak Verma",
    category: "Hair Stylists",
    speciality: "Bridal Floral Braids & Red Carpet Textured Blowouts",
    location: "Alwarpet & ECR, Chennai",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1400&auto=format&fit=crop",
    rating: 4.89,
    reviewCount: 86,
    startingPrice: 3000,
    experienceYears: 11,
    bio: "Editorial session stylist trained in Mumbai and London. Celebrated for creating regal South Indian floral temple braids, messy bridal buns that stay pinned for 12 hours, and Hollywood glass-hair blowouts.",
    verified: true,
    availableSlots: ["06:00 AM", "09:00 AM", "01:30 PM", "05:00 PM"],
    portfolio: [
      {
        id: "p4-1",
        title: "Traditional Mallipoo & Billai Temple Braid",
        category: "Bridal Hair",
        image: "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540.jpeg",
        description: "Intertwined fresh jasmine string with 9-tier gold billai ornamentation."
      },
      {
        id: "p4-2",
        title: "Textured Bohemian Low Bun with Baby's Breath",
        category: "Reception Bun",
        image: "/images/dress/western-wear/evening-gowns/Midnight_blue_satin_evening_gown_202609091726.jpeg",
        description: "Voluminous textured crown with delicate floral weaving."
      },
      {
        id: "p4-3",
        title: "Red Carpet Hollywood Curls",
        category: "Party Style",
        image: "/images/dress/western-wear/cocktail-dresses/Woman_wearing_burgundy_satin_dress_202609091731.jpeg",
        description: "Mirror shine S-wave curls treated with humidity-block serum."
      }
    ],
    packages: [
      {
        id: "pkg-4-1",
        name: "Signature Occasion Blowout & Curls",
        price: 3000,
        duration: "45 mins",
        description: "Voluminous bounce, beachy waves, or sleek glass blowout for parties.",
        inclusions: [
          "Pre-heat thermal shield treatment",
          "Custom curl or sleek iron sculpting",
          "Long-lasting humidity-resistant hold spray",
          "Shine gloss drops application"
        ],
        isPopular: false
      },
      {
        id: "pkg-4-2",
        name: "South Indian Heritage Temple Braid",
        price: 5500,
        duration: "90 mins",
        description: "The classic Muhurtham bridal crown braid with authentic floral setting.",
        inclusions: [
          "Hair padding & volume extension integration",
          "Kunjalam (tassel) anchoring and billai ornaments setting",
          "Fresh jasmine (mallipoo) & rose veni stringing",
          "Zero pull, comfortable scalp weight distribution"
        ],
        isPopular: true
      },
      {
        id: "pkg-4-3",
        name: "Bridal Transformation (2 Looks Day & Night)",
        price: 9500,
        duration: "Full Day (2 Looks)",
        description: "Morning traditional temple braid followed by evening reception Hollywood updo.",
        inclusions: [
          "Morning traditional temple bridal braid",
          "Evening glam reception transformation (textured bun or cascading waves)",
          "All hair extension rentals and padding included",
          "Standby touch-up between photo sessions"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "r4-1",
        author: "Aishwarya Natarajan",
        location: "Chennai",
        rating: 5,
        date: "2 months ago",
        comment: "Deepak gave me the exact floral braid I dreamed of! Even with heavy real gold billais, my head didn't hurt at all. Truly a master artist.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-5",
    slug: "rhea-sengupta",
    name: "Rhea Sengupta",
    category: "Personal Stylists",
    speciality: "Couture Wedding Trousseau & Luxury Wardrobe Curation",
    location: "Boat Club Road, Chennai & Virtual",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop",
    rating: 4.98,
    reviewCount: 140,
    startingPrice: 4500,
    experienceYears: 10,
    bio: "Former luxury fashion magazine editor and celebrity wardrobe consultant. Specializes in helping brides and wedding guests coordinate their designer outfits, match heirloom jewellery, and build timeless luxury capsules.",
    verified: true,
    availableSlots: ["10:30 AM", "02:00 PM", "04:30 PM", "07:00 PM"],
    portfolio: [
      {
        id: "p5-1",
        title: "Curated Bridal Trousseau Moodboard",
        category: "Bridal Styling",
        image: "/images/dress/lehengas/tiered-flared-lehengas/Woman_wearing_seafoam_green_lehenga_202609091657.jpeg",
        description: "Complete 5-ceremony color and silhouette coordination with jewellery."
      },
      {
        id: "p5-2",
        title: "Heirloom Kanjeevaram Blouse & Jewel Pairing",
        category: "Jewellery Pairing",
        image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
        description: "Pairing antique temple gold chokers with contrast zardozi blouses."
      },
      {
        id: "p5-3",
        title: "Mother-Daughter Coordinated Wedding Edit",
        category: "Family Styling",
        image: "/images/dress/lehengas/bridesmaid-lehengas/Woman_wearing_dusty_rose_lehenga_202609091649.jpeg",
        description: "Complementary soft pastel silks with harmonious motifs."
      }
    ],
    packages: [
      {
        id: "pkg-5-1",
        name: "1-on-1 Lookbook & Jewellery Pairing",
        price: 4500,
        duration: "60 mins",
        description: "Digital or in-person consultation to style 3 full event looks with matching accessories.",
        inclusions: [
          "Color palette analysis tailored to your undertones and event lighting",
          "Styling 3 full looks using your existing or newly purchased pieces",
          "Direct links to matching designer jewellery, footwear, and clutches",
          "Custom digital lookbook PDF delivered within 24 hours"
        ],
        isPopular: false
      },
      {
        id: "pkg-5-2",
        name: "Bridal Trousseau & VIP Shopping Assistant",
        price: 12500,
        duration: "4 hours",
        description: "Half-day in-person or virtual concierge shopping across leading luxury boutiques.",
        inclusions: [
          "Curated itinerary across top heritage and contemporary designers",
          "Pre-reserved VIP salon appointments with styling previews",
          "Fabric & zari authenticity checks with price negotiation guidance",
          "Fit & tailoring notes provided directly to master tailors"
        ],
        isPopular: true
      },
      {
        id: "pkg-5-3",
        name: "Master Wardrobe Audit & Seasonal Capsule",
        price: 18000,
        duration: "Full Day (6 hours)",
        description: "Complete in-home review of your luxury closet, repurposing heirloom sarees and building smart capsules.",
        inclusions: [
          "Comprehensive in-closet audit of your Indian and Western wear",
          "Cataloging pieces for repair, dry cleaning, or modern restyling",
          "20+ ready-to-wear outfit formulas photographed for your phone",
          "Shopping list of 5 key investment pieces to unlock 30+ new looks"
        ],
        isPopular: false
      }
    ],
    reviews: [
      {
        id: "r5-1",
        author: "Kavya Sridharan",
        location: "Chennai",
        rating: 5,
        date: "2 weeks ago",
        comment: "Rhea saved me from making impulsive bridal purchases! She showed me how to re-style my mother's heirloom Kanjeevaram for my reception. Her taste is impeccable.",
        verifiedBooking: true
      }
    ]
  },
  {
    id: "pro-6",
    slug: "priya-ramanathan",
    name: "Priya Ramanathan",
    category: "Makeup Artists",
    speciality: "Dewy Glass Skin, South Indian Bride & Editorial Glam",
    location: "Adyar & ECR, Chennai",
    city: "Chennai",
    profileImage: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1400&auto=format&fit=crop",
    rating: 4.93,
    reviewCount: 104,
    startingPrice: 7500,
    experienceYears: 7,
    bio: "Specializing in dewy glass skin for South Indian muhurthams and contemporary evening parties. Minimalist approach focusing on elevating your inherent features rather than masking them.",
    verified: true,
    availableSlots: ["06:00 AM", "09:30 AM", "01:30 PM", "05:00 PM"],
    portfolio: [
      {
        id: "p6-1",
        title: "Morning Golden Hour Muhurtham",
        category: "Bridal",
        image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
        description: "Subtle radiant glow with classic winged eyeliner and fresh mallipoo framing."
      },
      {
        id: "p6-2",
        title: "Contemporary Indo-Western Reception",
        category: "Reception",
        image: "/images/dress/western-wear/cocktail-party-nights/Emerald_green_saree_gown_displayed_202609091724.jpeg",
        description: "Bronze dewy skin with softly smoked chocolate eyes."
      }
    ],
    packages: [
      {
        id: "pkg-6-1",
        name: "Dewy Reception Glamour",
        price: 7500,
        duration: "90 mins",
        description: "Luminous glass skin finish with lightweight high-definition coverage.",
        inclusions: [
          "Botanical facial prep and glow primer",
          "Glass skin HD base with micro-concealing",
          "Feathered brows and custom lash accents",
          "Long-wear hydrating lip stain"
        ],
        isPopular: false
      },
      {
        id: "pkg-6-2",
        name: "South Indian Muhurtham Bride",
        price: 16000,
        duration: "3 hours",
        description: "Enduring radiance designed for daytime temple rituals and high-res cameras.",
        inclusions: [
          "Hydra-infusion skin barrier prep",
          "HD transfer-proof foundation application",
          "Traditional bindi & nose pin alignment",
          "Complimentary full-size touch-up gloss"
        ],
        isPopular: true
      }
    ],
    reviews: [
      {
        id: "r6-1",
        author: "Shruti V.",
        location: "Chennai",
        rating: 5,
        date: "3 weeks ago",
        comment: "Priya understood that I wanted minimal makeup that highlighted my natural features. The result was ethereal and felt like second skin!",
        verifiedBooking: true
      }
    ]
  }
];

// Helper methods with localStorage synchronization for persistent dashboard updates
const STORAGE_KEY = "femazon_beauty_professionals_v3";

export function getStoredProfessionals(): BeautyProfessional[] {
  if (typeof window === "undefined") {
    return INITIAL_BEAUTY_PROFESSIONALS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BEAUTY_PROFESSIONALS));
      return INITIAL_BEAUTY_PROFESSIONALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BEAUTY_PROFESSIONALS;
  } catch {
    return INITIAL_BEAUTY_PROFESSIONALS;
  }
}

export function saveStoredProfessionals(pros: BeautyProfessional[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pros));
  } catch (e) {
    console.error("Failed to save professionals to local storage", e);
  }
}

export function getProfessionalBySlug(slug: string): BeautyProfessional | undefined {
  const pros = getStoredProfessionals();
  return pros.find(p => p.slug === slug || p.id === slug);
}
