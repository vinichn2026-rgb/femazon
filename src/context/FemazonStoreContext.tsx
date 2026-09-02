"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  tier: 'Member' | 'Ruby' | 'Gold' | 'Platinum' | 'Luxe Royal';
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

  // Auth / Profile
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLogoutConfirmOpen: boolean;
  requestLogout: () => void;
  confirmLogout: () => Promise<void>;
  cancelLogout: () => void;
}

const FemazonStoreContext = createContext<FemazonStoreContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = "femazon_cart_v1";
const LOCAL_STORAGE_WISHLIST_KEY = "femazon_wishlist_v1";

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
    },
    {
      id: "w3",
      productId: "p3",
      name: "Brocade Silk Festive Saree",
      brand: "Femazon Exclusive",
      price: 14500,
      originalPrice: 16500,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
      category: "Sarees"
    },
    {
      id: "w4",
      productId: "p4",
      name: "Couture Evening Gown with Cape",
      brand: "Label Niti Bothra",
      price: 28000,
      originalPrice: 32000,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
      category: "Gowns"
    }
  ]);

  // Auth User State
  const [user, setUser] = useState<UserProfile | null>(initialUser || {
    id: "usr_101",
    name: "Vinitha Chandran",
    email: "vinitha@femazon.luxury",
    phone: "+91 98765 43210",
    role: "CUSTOMER",
    tier: "Ruby",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  });

  // Logout Modal State
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Hydrate from LocalStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.warn("Could not load stored cart/wishlist", e);
    }
  }, []);

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

  // Logout Handlers
  const requestLogout = () => setIsLogoutConfirmOpen(true);
  const cancelLogout = () => setIsLogoutConfirmOpen(false);

  const confirmLogout = async () => {
    try {
      setIsLogoutConfirmOpen(false);
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      router.push('/login');
    } catch (err) {
      router.push('/login');
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

        user,
        setUser,
        isLogoutConfirmOpen,
        requestLogout,
        confirmLogout,
        cancelLogout
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
