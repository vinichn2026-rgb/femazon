"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Package, CalendarDays, Store, Info, Check, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: number) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      setIsOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER": return <Package size={16} className="text-blue-500" />;
      case "BOOKING": return <CalendarDays size={16} className="text-purple-500" />;
      case "VENDOR": return <Store size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-zinc-500" />;
    }
  };

  return (
    <div className="relative flex items-center h-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-text-main transition hover:text-primary flex items-center h-full"
      >
        <Bell size={22} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-accent/20 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-accent/10 bg-[#fbf9f6]">
            <h3 className="font-serif text-lg text-text-main">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAsRead()}
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-text-main transition-colors flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-zinc-400 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-sm">
                <Bell className="mx-auto mb-2 opacity-50" size={24} />
                You're all caught up!
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-accent/5 cursor-pointer hover:bg-zinc-50 transition-colors flex gap-4 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-white border border-accent/10 flex items-center justify-center shadow-sm">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-text-main' : 'font-medium text-zinc-700'}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 ml-2" />}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-2 font-medium uppercase tracking-wider">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
