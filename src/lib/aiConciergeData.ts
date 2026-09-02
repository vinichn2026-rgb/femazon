export interface BingoOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  category: string;
}

export interface CuratedLookItem {
  name: string;
  details: string;
  image?: string;
}

export interface CuratedLook {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  heroImage: string;
  outfit: CuratedLookItem;
  jewellery: CuratedLookItem;
  footwear: CuratedLookItem;
  bag: CuratedLookItem;
  makeup: CuratedLookItem;
  hairstyle: CuratedLookItem;
  priceEstimate: number;
}

export interface ConciergeProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  stylingReason: string;
  link: string;
}

export interface ConciergeService {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  location: string;
  highlight: string;
  link: string;
}

export const INITIAL_BINGO_OPTIONS: BingoOption[] = [
  { id: 'style-me', icon: '👗', title: 'Style Me', subtitle: 'Help me find an outfit', category: 'styling' },
  { id: 'shop-for-me', icon: '🛍️', title: 'Shop for Me', subtitle: 'Find products based on what I need', category: 'shopping' },
  { id: 'office-look', icon: '💼', title: 'Office Look', subtitle: 'Smart & stylish workwear', category: 'occasion' },
  { id: 'party-look', icon: '🎉', title: 'Party Look', subtitle: 'Create my party outfit', category: 'occasion' },
  { id: 'wedding-festive', icon: '💍', title: 'Wedding / Festive', subtitle: 'Traditional & celebration looks', category: 'occasion' },
  { id: 'casual-look', icon: '🌸', title: 'Casual Look', subtitle: 'Easy everyday styling', category: 'occasion' },
  { id: 'makeup', icon: '💄', title: 'Makeup', subtitle: 'Find my makeup look', category: 'beauty' },
  { id: 'hair', icon: '💇‍♀️', title: 'Hair', subtitle: 'Hairstyle & hair service', category: 'beauty' },
  { id: 'mehendi', icon: '🌿', title: 'Mehendi', subtitle: 'Find a mehendi artist', category: 'services' },
  { id: 'accessories', icon: '💎', title: 'Accessories', subtitle: 'Jewellery, bags & footwear', category: 'styling' },
  { id: 'plan-event', icon: '🎊', title: 'Plan My Event', subtitle: 'Help me plan an occasion', category: 'services' },
  { id: 'ai-wardrobe', icon: '🤖', title: 'AI Wardrobe', subtitle: 'Style the clothes I already own', category: 'wardrobe' },
  { id: 'complete-look', icon: '✨', title: 'Complete My Look', subtitle: 'Build my outfit from head to toe', category: 'complete-look' },
  { id: 'just-chat', icon: '💬', title: 'Just Chat', subtitle: 'I have something else in mind', category: 'chat' },
];

export const VIBE_OPTIONS = [
  { id: 'glam', icon: '✨', label: 'Glam' },
  { id: 'chic', icon: '🖤', label: 'Chic' },
  { id: 'feminine', icon: '🌸', label: 'Feminine' },
  { id: 'bold', icon: '🔥', label: 'Bold' },
  { id: 'minimal', icon: '🤍', label: 'Minimal' },
  { id: 'elegant', icon: '💎', label: 'Elegant' },
];

export const GARMENT_OPTIONS = [
  { id: 'dress', icon: '👗', label: 'Dress' },
  { id: 'saree', icon: '🥻', label: 'Saree' },
  { id: 'kurti', icon: '👚', label: 'Kurti' },
  { id: 'coord', icon: '✨', label: 'Co-ord' },
  { id: 'lehenga', icon: '💃', label: 'Lehenga' },
  { id: 'surprise', icon: '🤷', label: 'Surprise Me' },
];

export const BUDGET_OPTIONS = [
  { id: 'b1', label: 'Under ₹1,500' },
  { id: 'b2', label: '₹1,500–₹3,000' },
  { id: 'b3', label: '₹3,000–₹5,000' },
  { id: 'b4', label: '₹5,000–₹10,000' },
  { id: 'b5', label: 'No Limit 💎' },
];

export const SAMPLE_CURATED_LOOKS: Record<string, CuratedLook[]> = {
  default: [
    {
      id: 'look-1',
      title: 'Look 01 — Elegant Glam',
      subtitle: 'Effortless royalty for celebrations & cocktail parties',
      vibe: 'Elegant • Glamorous • Polished',
      heroImage: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=700',
      outfit: { name: 'Wine Velvet Embroidered Anarkali Set', details: 'Handcrafted zardozi & sequin borders' },
      jewellery: { name: 'Polki & Emerald Statement Choker', details: 'Antique gold finish with matching jhumkas' },
      footwear: { name: 'Rose Gold Metallic Block Heels', details: '3-inch cushioned comfort sole' },
      bag: { name: 'Handcrafted Pearl Embroidered Potli', details: 'Silk tassel pull with pearl handle' },
      makeup: { name: 'Soft Glow Glam & Berry Matte Lip', details: 'Defined winged liner & dewy glass base' },
      hairstyle: { name: 'Voluminous Hollywood Waves', details: 'Side-parted with delicate baby breath pins' },
      priceEstimate: 4850
    },
    {
      id: 'look-2',
      title: 'Look 02 — Modern Chic',
      subtitle: 'Contemporary silhouettes with refined luxury accents',
      vibe: 'Modern • Minimal • Chic',
      heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=700',
      outfit: { name: 'Champagne Silk Pleated Co-ord Set', details: 'Structured collar & flowy wide-leg pants' },
      jewellery: { name: 'Sculptural Gold Hoop Earrings', details: '18K micro-plated contemporary finish' },
      footwear: { name: 'Nude Pointed Toe Stiletto Pumps', details: 'Minimalist sleek Italian cut' },
      bag: { name: 'Structured Champagne Mini Baguette', details: 'Magnetic flap with gold chain strap' },
      makeup: { name: 'Clean Girl Dewy Look & Tinted Gloss', details: 'Fluffy brows & subtle champagne highlighter' },
      hairstyle: { name: 'Sleek Low Bun with Middle Part', details: 'High-gloss slicked aesthetic' },
      priceEstimate: 3950
    },
    {
      id: 'look-3',
      title: 'Look 03 — Traditional Twist',
      subtitle: 'Timeless Indian heritage with modern lightweight comfort',
      vibe: 'Traditional • Heritage • Vibrant',
      heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=700',
      outfit: { name: 'Mustard Organza Floral Draped Saree', details: 'Pre-stitched pleats with mirror-work blouse' },
      jewellery: { name: 'Kundan Chandbali & Maang Tikka', details: 'Mint green bead drops' },
      footwear: { name: 'Embroidered Juttis in Gold Thread', details: 'Double padded genuine leather' },
      bag: { name: 'Box Clutch with Crystal Clasp', details: 'Gold satin casing' },
      makeup: { name: 'Kohl-Rimmed Eyes & Coral Nude Lips', details: 'Warm terracotta blush contour' },
      hairstyle: { name: 'Messy Floral Textured Braid', details: 'Intertwined with fresh jasmine mogra' },
      priceEstimate: 5200
    }
  ]
};

export const SAMPLE_PRODUCTS: ConciergeProduct[] = [
  {
    id: 'prod-1',
    name: 'Pastel Embroidered Organza Anarkali',
    price: 2999,
    originalPrice: 4500,
    rating: 4.9,
    reviewsCount: 148,
    image: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
    category: 'Anarkali & Suits',
    stylingReason: 'A softer and more elegant version of your current traditional style with breathable lightweight luxury.',
    link: '/shop?category=Kurta+Sets'
  },
  {
    id: 'prod-2',
    name: 'Royal Wine Mirror-Work Pre-Draped Saree',
    price: 3850,
    originalPrice: 5200,
    rating: 4.8,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600',
    category: 'Pre-Draped Sarees',
    stylingReason: 'Saves 45 minutes of draping time while creating a flattering, snatched silhouette for evening events.',
    link: '/shop?category=Sarees'
  },
  {
    id: 'prod-3',
    name: 'Champagne Sequin Corset & Lehenga Skirt',
    price: 6499,
    originalPrice: 8999,
    rating: 5.0,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=600',
    category: 'Party Lehengas',
    stylingReason: 'Catches the ambient light effortlessly on the dance floor without feeling heavy or restrictive.',
    link: '/shop?category=Lehengas'
  },
  {
    id: 'prod-4',
    name: 'Handcrafted Polki Choker & Earring Ensemble',
    price: 1899,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1535615615570-3b839f4359be?auto=format&fit=crop&q=85&w=600',
    category: 'Jewellery',
    stylingReason: 'The ideal emerald droplet accent to add royal contrast against deeper wine and maroon palettes.',
    link: '/shop'
  }
];

export const SAMPLE_SERVICES: ConciergeService[] = [
  {
    id: 'serv-1',
    name: 'Bridal & Reception HD Makeup by Master Artist',
    category: 'Beauty & Glamour',
    price: 18500,
    rating: 4.95,
    reviewsCount: 320,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=85&w=600',
    location: 'Coimbatore & Chennai (Doorstep)',
    highlight: 'Includes Luxury HD Airbrush + 2 Hair Changes + Saree Draping',
    link: '/services'
  },
  {
    id: 'serv-2',
    name: 'Celebrity Organic Bridal & Festive Mehendi',
    category: 'Mehendi Artistry',
    price: 6500,
    rating: 4.9,
    reviewsCount: 185,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=600',
    location: 'All Tamil Nadu Locations',
    highlight: '100% Organic Dark Stain Guarantee + Custom Portrait Figures',
    link: '/services'
  },
  {
    id: 'serv-3',
    name: 'Personal Wedding Stylist & Wardrobe Concierge',
    category: 'Fashion Consulting',
    price: 4999,
    rating: 5.0,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=600',
    location: 'Virtual Video Consultation + In-Store Fitting',
    highlight: '360° Trousseau Planning & Designer Direct Sourcing',
    link: '/services'
  }
];
