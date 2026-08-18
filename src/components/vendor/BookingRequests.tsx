"use client";

import { useEffect, useState } from "react";

type ServiceRequest = {
  id: string;
  title: string;
  category: string;
  slot: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

const STORAGE_KEY = "femazon_service_requests";

function loadRequests(): ServiceRequest[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ServiceRequest[];
  } catch {
    return [];
  }
}

function saveRequests(requests: ServiceRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function BookingRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  const updateStatus = (id: string, status: ServiceRequest['status']) => {
    const nextRequests = requests.map((request) =>
      request.id === id ? { ...request, status } : request
    );
    setRequests(nextRequests);
    saveRequests(nextRequests);
  };

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Service booking requests</p>
          <h2 className="mt-3 text-2xl font-semibold">Manage new service requests</h2>
          <p className="mt-2 text-sm text-zinc-600">Accept or reject pending booking requests from customers.</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600">No service requests have been submitted yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{request.title}</p>
                  <p className="text-sm text-zinc-600">{request.category} · {request.slot}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    request.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : request.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={request.status !== 'pending'}
                  onClick={() => updateStatus(request.id, 'accepted')}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:bg-zinc-300 disabled:text-zinc-500"
                >
                  Accept
                </button>
                <button
                  type="button"
                  disabled={request.status !== 'pending'}
                  onClick={() => updateStatus(request.id, 'rejected')}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:bg-zinc-300 disabled:text-zinc-500"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
