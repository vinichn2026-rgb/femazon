"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import { MarketplaceProfessional } from '@/data/marketplaceData';

interface ServiceBookingModalProps {
  professional: MarketplaceProfessional | null;
  initialService?: { name: string; duration: string; price: number; description: string } | null;
  onClose: () => void;
}

export function ServiceBookingModal({ professional, initialService, onClose }: ServiceBookingModalProps) {
  const { user } = useFemazonStore();
  
  const [selectedService, setSelectedService] = useState(
    initialService || (professional?.servicesOffered?.[0] ?? null)
  );
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  if (!professional) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (!professional.serviceId || !professional.providerId) {
        throw new Error('This provider is not available for booking right now.');
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: professional.serviceId,
          providerId: professional.providerId,
          serviceName: selectedService?.name || professional.name,
          date,
          time,
          location,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          notes: notes ? `${notes} (Selected: ${selectedService?.name} with ${professional.name})` : `Selected: ${selectedService?.name} with ${professional.name}`,
          duration: 1
        })
      });

      const response = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(response?.error || 'Failed to submit booking request');
      }

      if (response?.id === undefined || response?.id === null) {
        throw new Error('The booking response was incomplete. Please check your bookings before retrying.');
      }

      setBookingReference(String(response.id));
      setIsSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit booking request.';
      console.error('[ServiceBookingModal] Booking request failed:', message);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#4A1513] text-white p-5 flex items-start justify-between">
          <div className="pr-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-rose-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Service booking request
            </span>
            <h3 className="font-serif text-xl font-bold">{professional.name}</h3>
            <p className="text-xs text-stone-200">{professional.role} • {professional.location || 'Service area not provided'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-serif text-2xl font-bold text-stone-900 mb-2">Booking Request Received!</h4>
              <p className="text-sm text-stone-600 mb-6 max-w-sm mx-auto">
                Your request for <strong>{selectedService?.name}</strong> with <strong>{professional.name}</strong> on <strong>{date} at {time}</strong> has been received. The provider has not yet confirmed the appointment.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 mb-6">
                Booking Reference: #{bookingReference}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#4A1513] text-white rounded-xl font-semibold text-sm hover:bg-[#38100e] transition shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {errorMessage}
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Service
                </label>
                <div className="space-y-2">
                  {professional.servicesOffered.map((serv, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedService?.name === serv.name 
                          ? 'border-[#4A1513] bg-rose-50/40 text-stone-900' 
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService?.name === serv.name}
                          onChange={() => setSelectedService(serv)}
                          className="accent-[#4A1513]"
                        />
                        <div>
                          <div className="text-sm font-semibold">{serv.name}</div>
                          <div className="text-xs text-stone-500">{serv.duration} • {serv.description}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#4A1513] shrink-0 ml-2">
                        {serv.price > 0 ? `₹${serv.price.toLocaleString('en-IN')}` : 'Pricing on request'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                    />
                    <Calendar size={15} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                    >
                      <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                      <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                      <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                    </select>
                    <Clock size={15} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Full Name"
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              {/* Service Address / Location */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Service Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Apartment, Street address, City"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                  />
                  <MapPin size={15} className="absolute left-3 top-3 text-stone-400" />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Special Notes or Requests (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Skin sensitivities, preferred organic products, occasion details..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              {/* Safety guarantee */}
              <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-3 text-xs text-stone-600">
                <ShieldCheck size={18} className="text-[#4A1513] shrink-0" />
                <span>Booking requests are subject to provider confirmation.</span>
              </div>

              {/* Total & Submit */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100 mt-4">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider">Estimated Amount</div>
                  <div className="font-serif text-lg font-bold text-[#4A1513]">
                    {(selectedService?.price || professional.startingPrice) > 0
                      ? `₹${(selectedService?.price || professional.startingPrice).toLocaleString('en-IN')}`
                      : 'Enquire'}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#4A1513] text-white rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#38100e] transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Requesting...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
