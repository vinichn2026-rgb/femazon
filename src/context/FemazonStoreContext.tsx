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
  addToCart: (item: Omit<CartItem, 'id'>, openDrawerImmediately?: boolean) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;

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
  }) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  moveWishlistToCart: (product: WishlistItem, size?: string) => Promise<void>;
  moveAllWishlistToCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;

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
  syncGuestData: () => Promise<boolean>;

  // Auth Modal
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register' | 'otp';
  openAuthModal: (view?: 'login' | 'register' | 'otp') => void;
  closeAuthModal: () => void;

  // Wallet
  walletBalance: number;
  addWalletCredits: (amount: number) => void;
}

const FemazonStoreContext = createContext<FemazonStoreContextType | undefined>(undefined);

const GUEST_CART_STORAGE_KEY = "femazon_guest_cart_v1";
const GUEST_WISHLIST_STORAGE_KEY = "femazon_guest_wishlist_v1";
const LOCAL_STORAGE_BOOKINGS_KEY = "femazon_bookings_v1";

function getGuestCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestCartToStorage(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    if (cart.length === 0) {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    } else {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
    }
  } catch {}
}

function getGuestWishlistFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestWishlistToStorage(wishlist: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    if (wishlist.length === 0) {
      localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
    } else {
      localStorage.setItem(GUEST_WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  } catch {}
}

function mapDbCartItemToCartItem(item: any): CartItem {
  const prod = item.product || {};
  let resolvedImage = prod.image || 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600';
  if (!resolvedImage && prod.images) {
    try {
      const parsed = typeof prod.images === 'string' ? JSON.parse(prod.images) : prod.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        resolvedImage = parsed[0];
      }
    } catch {}
  }

  return {
    id: String(item.id),
    productId: item.productId,
    name: prod.name || 'Designer Product',
    brand: prod.brandName || prod.brand || 'Femazon Luxe',
    price: Number(prod.discountPrice || prod.price || 0),
    originalPrice: Number(prod.price || 0),
    discountPrice: prod.discountPrice ? Number(prod.discountPrice) : undefined,
    image: resolvedImage,
    size: item.size || undefined,
    color: item.color || undefined,
    quantity: Number(item.quantity) || 1,
    category: prod.category || prod.subcategory || 'Fashion'
  };
}

function mapDbWishlistItemToWishlistItem(item: any): WishlistItem {
  const prod = item.product || {};
  let resolvedImage = prod.image || 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600';
  if (!resolvedImage && prod.images) {
    try {
      const parsed = typeof prod.images === 'string' ? JSON.parse(prod.images) : prod.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        resolvedImage = parsed[0];
      }
    } catch {}
  }

  return {
    id: String(item.id),
    productId: item.productId,
    name: prod.name || 'Designer Product',
    brand: prod.brandName || prod.brand || 'Femazon Luxe',
    price: Number(prod.discountPrice || prod.price || 0),
    originalPrice: Number(prod.price || 0),
    image: resolvedImage,
    category: prod.category || prod.subcategory || 'Fashion'
  };
}

export function FemazonStoreProvider({
  children,
  initialUser
}: {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Cart State (No hardcoded mock dummy items; strictly per-user database isolation)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State (No hardcoded mock dummy items; strictly per-user database isolation)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Bookings State
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  // Auth User State
  const [user, setUser] = useState<UserProfile | null>(initialUser || null);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'otp'>('login');

  const openAuthModal = useCallback((view: 'login' | 'register' | 'otp' = 'login') => {
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

  // In-flight deduplication refs
  const authPromiseRef = useRef<Promise<boolean> | null>(null);
  const cartPromiseRef = useRef<Promise<void> | null>(null);
  const wishlistPromiseRef = useRef<Promise<void> | null>(null);
  const bookingsPromiseRef = useRef<Promise<void> | null>(null);

  // Fetch / Refresh Cart strictly from server for the authenticated user, or load guest cart
  const refreshCart = useCallback(async () => {
    if (cartPromiseRef.current) return cartPromiseRef.current;

    const promise = (async () => {
      try {
        const res = await fetch('/api/cart');
        if (res.status === 401) {
          // Guest mode: load isolated browser guest cart
          const guestCart = getGuestCartFromStorage();
          setCart(guestCart);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items) ? data.items : [];
          const mapped = items.map(mapDbCartItemToCartItem);
          setCart(mapped);
        }
      } catch (err) {
        console.warn('[Cart Sync Warning]:', err);
        const guestCart = getGuestCartFromStorage();
        setCart(guestCart);
      } finally {
        cartPromiseRef.current = null;
      }
    })();

    cartPromiseRef.current = promise;
    return promise;
  }, []);

  // Fetch / Refresh Wishlist strictly from server for the authenticated user, or load guest wishlist
  const refreshWishlist = useCallback(async () => {
    if (wishlistPromiseRef.current) return wishlistPromiseRef.current;

    const promise = (async () => {
      try {
        const res = await fetch('/api/wishlist');
        if (res.status === 401) {
          // Guest mode: load isolated browser guest wishlist
          const guestWishlist = getGuestWishlistFromStorage();
          setWishlist(guestWishlist);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items) ? data.items : [];
          const mapped = items.map(mapDbWishlistItemToWishlistItem);
          setWishlist(mapped);
        }
      } catch (err) {
        console.warn('[Wishlist Sync Warning]:', err);
        const guestWishlist = getGuestWishlistFromStorage();
        setWishlist(guestWishlist);
      } finally {
        wishlistPromiseRef.current = null;
      }
    })();

    wishlistPromiseRef.current = promise;
    return promise;
  }, []);

  // Synchronise Guest Cart & Wishlist to Authenticated User Account
  const syncGuestData = useCallback(async () => {
    const guestCart = getGuestCartFromStorage();
    const guestWishlist = getGuestWishlistFromStorage();

    if (guestCart.length === 0 && guestWishlist.length === 0) {
      return false;
    }

    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestCart,
          guestWishlist
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Clear guest data from storage immediately after successful synchronization
        saveGuestCartToStorage([]);
        saveGuestWishlistToStorage([]);

        if (Array.isArray(data?.cart)) {
          setCart(data.cart.map(mapDbCartItemToCartItem));
        }
        if (Array.isArray(data?.wishlist)) {
          setWishlist(data.wishlist.map(mapDbWishlistItemToWishlistItem));
        }
        return true;
      }
    } catch (err) {
      console.warn('[Sync Guest Data Error]:', err);
    }
    return false;
  }, []);

  // Refresh user auth strictly from server session (/api/auth/me)
  // Handles safe migration of guest items upon authenticated login
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

            // Never store sensitive personal info (email, phone, name) in localStorage
            try {
              localStorage.removeItem('femazon_user_v1');
            } catch (e) {}

            // Synchronise any pending guest cart & wishlist items to the user's account
            const synced = await syncGuestData();
            if (!synced) {
              await refreshCart();
              await refreshWishlist();
            }
            return true;
          }
        }

        // If server returns 401, clear user and fall back to guest storage
        if (res.status === 401) {
          setUser(null);
          setCart(getGuestCartFromStorage());
          setWishlist(getGuestWishlistFromStorage());
          try {
            localStorage.removeItem('femazon_user_v1');
            localStorage.removeItem('femazon_cart_v1');
            localStorage.removeItem('femazon_wishlist_v1');
          } catch (e) {}
        }
        return false;
      } catch (e) {
        setUser(null);
        setCart(getGuestCartFromStorage());
        setWishlist(getGuestWishlistFromStorage());
        return false;
      } finally {
        authPromiseRef.current = null;
      }
    })();

    authPromiseRef.current = promise;
    return promise;
  }, [refreshCart, refreshWishlist, syncGuestData]);

  // Fetch / Refresh Bookings
  const refreshBookings = useCallback(async () => {
    if (bookingsPromiseRef.current) return bookingsPromiseRef.current;

    const promise = (async () => {
      try {
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

  // Hydrate guest storage & session on initial mount
  useEffect(() => {
    setIsMounted(true);

    // 1. Initial hydration for guest cart & wishlist so UI renders immediately
    setCart(getGuestCartFromStorage());
    setWishlist(getGuestWishlistFromStorage());

    try {
      const savedBookings = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    } catch (e) {}

    // 2. Check server session cookie; if authenticated, migrates guest items & loads DB cart
    refreshAuth();
  }, [refreshAuth]);

  // Sync Bookings to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings, isMounted]);

  // Cart Metrics
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Add To Cart with Server Persistence and User Isolation
  const addToCart = async (item: Omit<CartItem, 'id'>, openDrawerImmediately = true) => {
    const normalizedSize = item.size && String(item.size).trim() !== '' ? String(item.size).trim() : undefined;
    const normalizedColor = item.color && String(item.color).trim() !== '' ? String(item.color).trim() : undefined;
    const qtyToAdd = Math.max(1, Number(item.quantity) || 1);

    // Guest User Cart Handling: isolate strictly in client browser storage
    if (!user) {
      setCart(prev => {
        const existingIdx = prev.findIndex(
          p => String(p.productId) === String(item.productId) &&
               (p.size || '') === (normalizedSize || '') &&
               (p.color || '') === (normalizedColor || '')
        );

        let nextCart: CartItem[];
        if (existingIdx > -1) {
          nextCart = [...prev];
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + qtyToAdd
          };
        } else {
          const guestItem: CartItem = {
            ...item,
            id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            size: normalizedSize,
            color: normalizedColor,
            quantity: qtyToAdd
          };
          nextCart = [guestItem, ...prev];
        }
        saveGuestCartToStorage(nextCart);
        return nextCart;
      });

      if (openDrawerImmediately) {
        setIsCartOpen(true);
      }
      return;
    }

    // Authenticated User: Optimistic local state update + POST /api/cart
    setCart(prev => {
      const existingIdx = prev.findIndex(
        p => String(p.productId) === String(item.productId) &&
             (p.size || '') === (normalizedSize || '') &&
             (p.color || '') === (normalizedColor || '')
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qtyToAdd
        };
        return updated;
      }

      const tempItem: CartItem = {
        ...item,
        size: normalizedSize,
        color: normalizedColor,
        quantity: qtyToAdd,
        id: `temp_${Date.now()}`
      };
      return [tempItem, ...prev];
    });

    if (openDrawerImmediately) {
      setIsCartOpen(true);
    }

    // Persist to database via POST /api/cart
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(item.productId),
          quantity: qtyToAdd,
          size: normalizedSize || null,
          color: normalizedColor || null
        })
      });

      if (res.status === 401) {
        setUser(null);
        setCart(getGuestCartFromStorage());
        return;
      }

      if (res.ok) {
        const savedItem = await res.json();
        // Replace temp item with real server record
        setCart(prev => {
          const mapped = mapDbCartItemToCartItem(savedItem);
          const filtered = prev.filter(p => !p.id.startsWith('temp_'));
          const existingIdx = filtered.findIndex(
            p => String(p.productId) === String(mapped.productId) &&
                 (p.size || '') === (mapped.size || '') &&
                 (p.color || '') === (mapped.color || '')
          );

          if (existingIdx > -1) {
            const nextList = [...filtered];
            nextList[existingIdx] = mapped;
            return nextList;
          }
          return [mapped, ...filtered];
        });
      } else {
        // Revert on error
        refreshCart();
      }
    } catch (err) {
      console.error('[Add to Cart Error]:', err);
      refreshCart();
    }
  };

  // Update Cart Quantity with Server Persistence
  const updateCartQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (!user) {
      setCart(prev => {
        const nextCart = prev.map(item => (item.id === id ? { ...item, quantity } : item));
        saveGuestCartToStorage(nextCart);
        return nextCart;
      });
      return;
    }

    // Optimistic update for authenticated user
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      if (!res.ok) {
        refreshCart();
      }
    } catch (err) {
      console.error('[Update Quantity Error]:', err);
      refreshCart();
    }
  };

  // Remove from Cart with Server Persistence
  const removeFromCart = async (id: string) => {
    if (!user) {
      setCart(prev => {
        const nextCart = prev.filter(item => item.id !== id);
        saveGuestCartToStorage(nextCart);
        return nextCart;
      });
      return;
    }

    // Optimistic remove for authenticated user
    setCart(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        refreshCart();
      }
    } catch (err) {
      console.error('[Remove From Cart Error]:', err);
      refreshCart();
    }
  };

  // Clear Cart with Server Persistence
  const clearCart = async () => {
    setCart([]);

    if (!user) {
      saveGuestCartToStorage([]);
      return;
    }

    try {
      await fetch('/api/cart', {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('[Clear Cart Error]:', err);
    }
  };

  // Wishlist Helpers with Server Persistence and User Isolation
  const wishlistCount = wishlist.length;

  const isInWishlist = (productId: string | number) => {
    return wishlist.some(item => String(item.productId) === String(productId));
  };

  const toggleWishlist = async (product: {
    id: string | number;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
  }) => {
    const prodId = Number(product.id);
    const exists = wishlist.some(item => String(item.productId) === String(product.id));

    if (!user) {
      // Guest User Wishlist Handling: isolate strictly in client browser storage
      setWishlist(prev => {
        let nextWishlist: WishlistItem[];
        if (exists) {
          nextWishlist = prev.filter(item => String(item.productId) !== String(product.id));
        } else {
          const guestWishItem: WishlistItem = {
            id: `guest_w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            productId: product.id,
            name: product.name,
            brand: product.brand || 'Femazon Couture',
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            image: product.image || 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
            category: product.category || 'Dresses'
          };
          nextWishlist = [guestWishItem, ...prev];
        }
        saveGuestWishlistToStorage(nextWishlist);
        return nextWishlist;
      });
      return;
    }

    // Optimistic update for authenticated user
    if (exists) {
      setWishlist(prev => prev.filter(item => String(item.productId) !== String(product.id)));
    } else {
      const newItem: WishlistItem = {
        id: `temp_w_${Date.now()}`,
        productId: product.id,
        name: product.name,
        brand: product.brand || 'Femazon Couture',
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image || 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600',
        category: product.category || 'Dresses'
      };
      setWishlist(prev => [newItem, ...prev]);
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: prodId })
      });

      if (res.status === 401) {
        setUser(null);
        setWishlist(getGuestWishlistFromStorage());
        return;
      }

      if (res.ok) {
        refreshWishlist();
      } else {
        refreshWishlist();
      }
    } catch (err) {
      console.error('[Toggle Wishlist Error]:', err);
      refreshWishlist();
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    if (!user) {
      setWishlist(prev => {
        const nextWishlist = prev.filter(item => String(item.productId) !== String(productId));
        saveGuestWishlistToStorage(nextWishlist);
        return nextWishlist;
      });
      return;
    }

    const prodId = Number(productId);
    setWishlist(prev => prev.filter(item => String(item.productId) !== String(productId)));

    try {
      const res = await fetch(`/api/wishlist/${prodId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        refreshWishlist();
      }
    } catch (err) {
      console.error('[Remove Wishlist Error]:', err);
      refreshWishlist();
    }
  };

  const moveWishlistToCart = async (item: WishlistItem, size = 'M') => {
    await addToCart({
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
    await removeFromWishlist(item.productId);
  };

  const moveAllWishlistToCart = async () => {
    const itemsToMove = [...wishlist];
    for (const item of itemsToMove) {
      await addToCart({
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
    }
    for (const item of itemsToMove) {
      await removeFromWishlist(item.productId);
    }
    setIsCartOpen(true);
  };

  // Bookings Helpers
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const bookingCount = user ? activeBookings.length : 0;

  const addBooking = (booking: Omit<BookingItem, 'id'>) => {
    const newBooking: BookingItem = {
      ...booking,
      id: `BKG${String(bookings.length + 1).padStart(3, '0')}`
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  // Logout Handlers with Complete Isolation Cleanup
  const requestLogout = () => setIsLogoutConfirmOpen(true);
  const cancelLogout = () => setIsLogoutConfirmOpen(false);

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsLogoutConfirmOpen(false);

      // Call server logout to invalidate HTTP cookies
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

      // Completely clear user state and sensitive cart/wishlist data
      setUser(null);
      setCart([]);
      setWishlist([]);
      setBookings([]);

      // Clear local storage entries so next user on this machine has a clean state
      try {
        localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
        localStorage.removeItem('femazon_user_v1');
        localStorage.removeItem('femazon_cart_v1');
        localStorage.removeItem('femazon_wishlist_v1');
        localStorage.removeItem(LOCAL_STORAGE_BOOKINGS_KEY);
      } catch (e) {}

      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoggingOut(false);
      router.push('/shop');
      router.refresh();
    } catch (err) {
      setIsLoggingOut(false);
      setUser(null);
      setCart([]);
      setWishlist([]);
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
        refreshCart,

        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        moveAllWishlistToCart,
        refreshWishlist,

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
        syncGuestData,

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
