"use client";

import { useState } from "react";

type Service = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceLabel: string;
  slots: string[];
};

const services: Service[] = [
  {
    id: "makeup",
    title: "Bridal Makeup",
    category: "Makeup",
    description:
      "Expert bridal and event makeup with luxury finishes for any special occasion.",
    priceLabel: "From ₹15,999",
    slots: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
  },
  {
    id: "mehendi",
    title: "Mehendi Artistry",
    category: "Mehendi",
    description:
      "Handcrafted mehendi designs for brides and guests, featuring intricate florals and motifs.",
    priceLabel: "From ₹4,999",
    slots: ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  },
  {
    id: "photography",
    title: "Event Photography",
    category: "Photography",
    description:
      "Professional coverage for weddings, ceremonies, and portraits with fast digital delivery.",
    priceLabel: "From ₹12,499",
    slots: ["9:00 AM", "11:00 AM", "1:00 PM", "6:00 PM"],
  },
];

export function ServicesDirectory() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingMessage, setBookingMessage] = useState<string>("");

  const handleOpen = (service: Service) => {
    setSelectedService(service);
    setSelectedSlot("");
  };

  const handleClose = () => {
    setSelectedService(null);
    setSelectedSlot("");
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedSlot) {
      return;
    }

    const booking = {
      title: selectedService.title,
      category: selectedService.category,
      slot: selectedSlot,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem("femazon_booking", JSON.stringify(booking));
    }

    setBookingMessage(
      `Confirmed ${selectedService.title} at ${selectedSlot}. Our team will reach out with next steps.`
    );
    handleClose();
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
            Service directory
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Book premium beauty and event services</h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Explore curated service packages for makeup, mehendi, and photography. Choose a time slot that fits your schedule.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
              Makeup
            </span>
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
              Mehendi
            </span>
            <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-800">
              Photography
            </span>
          </div>
        </section>

        {bookingMessage ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
            <p className="font-semibold">Booking confirmed</p>
            <p className="mt-2 text-sm">{bookingMessage}</p>
          </div>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between rounded-3xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700">
                <span>{service.category}</span>
                <span>{service.priceLabel}</span>
              </div>
              <h2 className="text-2xl font-semibold">{service.title}</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">{service.description}</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  {service.slots.length} slots
                </span>
                <button
                  type="button"
                  onClick={() => handleOpen(service)}
                  className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Book slot
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {selectedService ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
                  Slot selection
                </p>
                <h2 className="mt-3 text-2xl font-semibold">{selectedService.title}</h2>
                <p className="mt-2 text-sm text-zinc-600">Pick a convenient slot to reserve your service.</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-zinc-200 px-3 py-2 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-zinc-100 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Available slots</p>
                <div className="mt-4 grid gap-3">
                  {selectedService.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        selectedSlot === slot
                          ? "border-amber-600 bg-amber-50 text-amber-900"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white border border-zinc-200 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Booking summary</p>
                <div className="mt-4 space-y-3 text-sm text-zinc-700">
                  <div>
                    <p className="font-medium">Service</p>
                    <p>{selectedService.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Category</p>
                    <p>{selectedService.category}</p>
                  </div>
                  <div>
                    <p className="font-medium">Selected slot</p>
                    <p>{selectedSlot || "Choose a slot to continue"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={handleConfirmBooking}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 hover:bg-zinc-800"
                >
                  Confirm booking
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
