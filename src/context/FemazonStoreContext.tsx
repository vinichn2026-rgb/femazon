"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface CartItem {
  id: string;
  productId: string | number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  category?: string;
}

export interface WishlistItem {
  id: string | number;
  productId: string | number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
}

export interface BookingItem {
  id: number | string;
  serviceId?: number;
  serviceName: string;
  providerName: string;
  supporterName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
  providerImage?: string;
  date: string;
  time: string;
  location?: string;
  total: number;
  status: 'REQUEST_RECEIVED' | 'UNDER_REVIEW' | 'SUPPORTER_ASSIGNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  duration?: number;
  serviceImage?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

interface FemazonStoreContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'id'>, openDrawerImmediately?: boolean) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: {
    id: string | number;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
  }) => void;
  removeFromWishlist: (productId: string | number) => void;
  moveWishlistToCart: (product: WishlistItem, size?: string) => void;
  moveAllWishlistToCart: () => void;

  // Bookings
  bookings: BookingItem[];
  bookingCount: number;
  addBooking: (booking: Omit<BookingItem, 'id'>) => void;
  refreshBookings: () => Promise<void>;

  // Auth / Profile
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggingOut: boolean;
  isLogoutConfirmOpen: boolean;
  requestLogout: () => void;
  confirmLogout: () => Promise<void>;
  cancelLogout: () => void;
  refreshAuth: () => Promise<boolean>;

  // Auth Modal (Aza Fashions style)
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register' | 'otp';
  openAuthModal: (view?: 'login' | 'register' | 'otp') => void;
  closeAuthModal: () => void;

  // Wallet
  walletBalance: number;
  addWalletCredits: (amount: number) => void;
}

const FemazonStoreContext = createContext<FemazonStoreContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = "femazon_cart_v1";
const LOCAL_STORAGE_WISHLIST_KEY = "femazon_wishlist_v1";
const LOCAL_STORAGE_USER_KEY = "femazon_user_v1";
const LOCAL_STORAGE_BOOKINGS_KEY = "femazon_bookings_v1";

const DEFAULT_BOOKINGS: BookingItem[] = [];

export function FemazonStoreProvider({
  children,
  initialUser
}: {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "cart_init_1",
      productId: "p1",
      name: "Surkh Syahi Aaina Anarkali Set",
      brand: "Paulmi & Harsh",
      price: 18895,
      originalPrice: 20995,
      image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
      size: "M",
      quantity: 1,
      category: "Kurta Sets"
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: "w1",
      productId: "p1",
      name: "Surkh Syahi Aaina Anarkali Set",
      brand: "Paulmi & Harsh",
      price: 18895,
      originalPrice: 20995,
      image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
      category: "Kurta Sets"
    },
    {
      id: "w2",
      productId: "p2",
      name: "Emerald Green Embroidered Lehenga",
      brand: "Sheetal Batra",
      price: 45000,
      originalPrice: 52000,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
      category: "Lehengas"
    }
  ]);

  // Bookings State
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  // Auth User State (Starts null unless a valid authenticated session exists)
  const [user, setUser] = useState<UserProfile | null>(initialUser || null);

  // Auth Modal (Aza Fashions style slide/popup)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'otp'>('otp');

  const openAuthModal = useCallback((view: 'login' | 'register' | 'otp' = 'otp') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(2500);

  const addWalletCredits = useCallback((amount: number) => {
    setWalletBalance(prev => prev + amount);
  }, []);

  // Logout Modal State & Loading
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // In-flight request deduplication refs to prevent duplicate calls in React StrictMode
  const authPromiseRef = useRef<Promise<boolean> | null>(null);
  const bookingsPromiseRef = useRef<Promise<void> | null>(null);

  // Refresh user auth strictly from server session (/api/auth/me)
  const refreshAuth = useCallback(async () => {
    if (authPromiseRef.current) return authPromiseRef.current;

    const promise = (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.user) {
            const nameParts = (data.user.name || '').trim().split(' ');
            const firstName = nameParts[0] || 'Member';
            const lastName = nameParts.slice(1).join(' ') || '';
            const activeUser: UserProfile = {
              id: String(data.user.id),
              name: data.user.name || firstName,
              firstName,
              lastName,
              email: data.user.email,
              phone: data.user.phone || '',
              role: data.user.role || 'CUSTOMER',
              avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            };
            setUser(activeUser);
            try {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(activeUser));
            } catch (e) {}
            return true;
          }
        }
        
        // If server returns 401 or invalid user, strictly log out
        setUser(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } catch (e) {}
        return false;
      } catch (e) {
        setUser(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } catch (err) {}
        return false;
      } finally {
        authPromiseRef.current = null;
      }
    })();

    authPromiseRef.current = promise;
    return promise;
  }, []);

  const lastBookingsFetchRef = useRef<number>(0);

  // Fetch / Refresh Bookings
  const refreshBookings = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && (now - lastBookingsFetchRef.current < 60_000)) {
      return;
    }
    if (bookingsPromiseRef.current) return bookingsPromiseRef.current;

    const promise = (async () => {
      try {
        lastBookingsFetchRef.current = Date.now();
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: BookingItem[] = data.map((b: any) => ({
              id: b.id,
              serviceId: b.serviceId,
              serviceName: b.service?.name || b.serviceName || 'Fashion Service',
              providerName: b.provider?.name || b.providerName || 'Femazon Specialist',
              supporterName: b.supporterName,
              customerName: b.customerName,
              customerPhone: b.customerPhone,
              notes: b.notes,
              providerImage: b.provider?.image || b.providerImage,
              serviceImage: b.service?.image || b.serviceImage,
              date: b.date || new Date().toISOString().split('T')[0],
              time: b.time || '10:00 AM',
              location: b.location || 'At-Home Service',
              total: b.total || 0,
              status: b.status || 'REQUEST_RECEIVED',
              duration: b.duration || 1,
              createdAt: b.createdAt
            }));
            setBookings(mapped);
            return;
          }
        }
        setBookings([]);
      } catch (e) {
        setBookings([]);
      } finally {
        bookingsPromiseRef.current = null;
      }
    })();

    bookingsPromiseRef.current = promise;
    return promise;
  }, []);

  // Hydrate and validate session
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedBookings = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    } catch (e) {
      console.warn("Could not load stored state", e);
    }

    // Validate session on mount
    refreshAuth();
  }, [refreshAuth]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isMounted]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, isMounted]);

  // Sync User to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {}
  }, [user, isMounted]);

  // Sync Bookings to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings, isMounted]);

  // Cart Helpers
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (item: Omit<CartItem, 'id'>, openDrawerImmediately = true) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        p => String(p.productId) === String(item.productId) && p.size === item.size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity || 1;
        return updated;
      }
      const newItem: CartItem = {
        ...item,
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      };
      return [newItem, ...prev];
    });

    if (openDrawerImmediately) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Helpers
  const wishlistCount = wishlist.length;

  const isInWishlist = (productId: string | number) => {
    return wishlist.some(item => String(item.productId) === String(productId));
  };

  const toggleWishlist = (product: {
    id: string | number;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
  }) => {
    setWishlist(prev => {
      const exists = prev.some(item => String(item.productId) === String(product.id));
      if (exists) {
        return prev.filter(item => String(item.productId) !== String(product.id));
      } else {
        const newItem: WishlistItem = {
          id: `w_${Date.now()}`,
          productId: product.id,
          name: product.name,
          brand: product.brand || 'Femazon Couture',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image || 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
          category: product.category || 'Dresses'
        };
        return [newItem, ...prev];
      }
    });
  };

  const removeFromWishlist = (productId: string | number) => {
    setWishlist(prev => prev.filter(item => String(item.productId) !== String(productId)));
  };

  const moveWishlistToCart = (item: WishlistItem, size = 'M') => {
    addToCart({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      size: size,
      quantity: 1,
      category: item.category
    }, true);
    removeFromWishlist(item.productId);
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach(item => {
      addToCart({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        size: 'M',
        quantity: 1,
        category: item.category
      }, false);
    });
    setWishlist([]);
    setIsCartOpen(true);
  };

  // Bookings Helpers
  // Count only active (CONFIRMED or PENDING) bookings
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const bookingCount = user ? activeBookings.length : 0;

  const addBooking = (booking: Omit<BookingItem, 'id'>) => {
    const newBooking: BookingItem = {
      ...booking,
      id: `BKG${String(bookings.length + 1).padStart(3, '0')}`
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  // Logout Handlers
  const requestLogout = () => setIsLogoutConfirmOpen(true);
  const cancelLogout = () => setIsLogoutConfirmOpen(false);

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsLogoutConfirmOpen(false);
      
      // Call server logout
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      
      // Clear sensitive states
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      
      // Brief aesthetic pause for "Signing you out..."
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoggingOut(false);
      router.push('/shop');
      router.refresh();
    } catch (err) {
      setIsLoggingOut(false);
      setUser(null);
      router.push('/shop');
    }
  };

  return (
    <FemazonStoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        moveAllWishlistToCart,

        bookings,
        bookingCount,
        addBooking,
        refreshBookings,

        user,
        setUser,
        isLoggingOut,
        isLogoutConfirmOpen,
        requestLogout,
        confirmLogout,
        cancelLogout,
        refreshAuth,

        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,

        walletBalance,
        addWalletCredits
      }}
    >
      {children}
    </FemazonStoreContext.Provider>
  );
}

export function useFemazonStore() {
  const context = useContext(FemazonStoreContext);
  if (!context) {
    throw new Error('useFemazonStore must be used within a FemazonStoreProvider');
  }
  return context;
}
