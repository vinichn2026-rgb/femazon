interface CachedBookings {
  data: any[];
  timestamp: number;
}

const globalForBookings = globalThis as unknown as {
  __femazon_bookings_cache__?: Map<string, CachedBookings>;
  __femazon_bookings_inflight__?: Map<string, Promise<any[]>>;
};

export const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

export function getBookingsCache() {
  if (!globalForBookings.__femazon_bookings_cache__) {
    globalForBookings.__femazon_bookings_cache__ = new Map();
  }
  return globalForBookings.__femazon_bookings_cache__;
}

export function getInFlightRequests() {
  if (!globalForBookings.__femazon_bookings_inflight__) {
    globalForBookings.__femazon_bookings_inflight__ = new Map();
  }
  return globalForBookings.__femazon_bookings_inflight__;
}

export function clearBookingsCache(userEmail?: string) {
  const cache = getBookingsCache();
  const inflight = getInFlightRequests();
  if (userEmail) {
    cache.delete(userEmail.toLowerCase());
    inflight.delete(userEmail.toLowerCase());
  } else {
    cache.clear();
    inflight.clear();
  }
}
