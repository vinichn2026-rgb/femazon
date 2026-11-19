"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Check,
  AlertCircle,
  Eye,
  RefreshCw,
  Phone,
  Layers
} from "lucide-react";
import { 
  BeautyProfessional, 
  ServicePackage, 
  PortfolioItem, 
  PROFESSIONAL_CATEGORIES,
  getStoredProfessionals, 
  saveStoredProfessionals 
} from "@/data/professionalsData";
import { useFemazonStore, BookingItem } from "@/context/FemazonStoreContext";

export function VendorServicesClient() {
  const { bookings } = useFemazonStore();

  const [professionals, setProfessionals] = useState<BeautyProfessional[]>([]);
  const [selectedProId, setSelectedProId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"profile" | "portfolio" | "packages" | "bookings">("profile");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string>("");

  useEffect(() => {
    const list = getStoredProfessionals();
    setProfessionals(list);
    if (list.length > 0 && !selectedProId) {
      setSelectedProId(list[0].id);
    }
  }, []);

  const currentPro = professionals.find(p => p.id === selectedProId) || professionals[0];

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    speciality: "",
    category: "Makeup Artists" as BeautyProfessional["category"],
    location: "",
    city: "Chennai",
    profileImage: "",
    coverImage: "",
    experienceYears: 5,
    bio: "",
    startingPrice: 2000
  });

  // Load current pro data into profile form
  useEffect(() => {
    if (currentPro) {
      setProfileForm({
        name: currentPro.name,
        speciality: currentPro.speciality,
        category: currentPro.category,
        location: currentPro.location,
        city: currentPro.city,
        profileImage: currentPro.profileImage,
        coverImage: currentPro.coverImage || "",
        experienceYears: currentPro.experienceYears,
        bio: currentPro.bio,
        startingPrice: currentPro.startingPrice
      });
    }
  }, [currentPro?.id]);

  // Portfolio Form State
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    category: "Bridal",
    image: "",
    description: ""
  });

  // Package Form State
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    price: "",
    duration: "90 mins",
    description: "",
    inclusions: "",
    isPopular: false
  });

  // Update & Save Helpers
  const triggerSuccess = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(""), 3500);
  };

  const updateCurrentPro = (updater: (pro: BeautyProfessional) => BeautyProfessional) => {
    const updatedList = professionals.map(p => p.id === currentPro.id ? updater(p) : p);
    setProfessionals(updatedList);
    saveStoredProfessionals(updatedList);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentPro(pro => ({
      ...pro,
      name: profileForm.name,
      speciality: profileForm.speciality,
      category: profileForm.category,
      location: profileForm.location,
      city: profileForm.city,
      profileImage: profileForm.profileImage,
      coverImage: profileForm.coverImage,
      experienceYears: Number(profileForm.experienceYears),
      bio: profileForm.bio,
      startingPrice: Number(profileForm.startingPrice)
    }));
    triggerSuccess("Profile details updated successfully!");
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title || !portfolioForm.image) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: portfolioForm.title,
      category: portfolioForm.category,
      image: portfolioForm.image,
      description: portfolioForm.description
    };

    updateCurrentPro(pro => ({
      ...pro,
      portfolio: [newItem, ...pro.portfolio]
    }));

    setPortfolioForm({ title: "", category: "Bridal", image: "", description: "" });
    setShowAddPortfolio(false);
    triggerSuccess("New portfolio look added!");
  };

  const handleDeletePortfolio = (id: string) => {
    if (!confirm("Are you sure you want to remove this look from your portfolio?")) return;
    updateCurrentPro(pro => ({
      ...pro,
      portfolio: pro.portfolio.filter(item => item.id !== id)
    }));
    triggerSuccess("Portfolio item removed.");
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const incList = packageForm.inclusions
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPackageId) {
      updateCurrentPro(pro => ({
        ...pro,
        packages: pro.packages.map(pkg => 
          pkg.id === editingPackageId ? {
            ...pkg,
            name: packageForm.name,
            price: Number(packageForm.price),
            duration: packageForm.duration,
            description: packageForm.description,
            inclusions: incList,
            isPopular: packageForm.isPopular
          } : pkg
        )
      }));
      triggerSuccess("Service package updated!");
    } else {
      const newPkg: ServicePackage = {
        id: `pkg-${Date.now()}`,
        name: packageForm.name,
        price: Number(packageForm.price),
        duration: packageForm.duration,
        description: packageForm.description,
        inclusions: incList,
        isPopular: packageForm.isPopular
      };

      updateCurrentPro(pro => {
        const pkgs = [...pro.packages, newPkg];
        const minPrice = Math.min(...pkgs.map(p => p.price));
        return {
          ...pro,
          packages: pkgs,
          startingPrice: minPrice > 0 ? minPrice : pro.startingPrice
        };
      });
      triggerSuccess("New service package created!");
    }

    setEditingPackageId(null);
    setShowAddPackage(false);
    setPackageForm({ name: "", price: "", duration: "90 mins", description: "", inclusions: "", isPopular: false });
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      name: pkg.name,
      price: String(pkg.price),
      duration: pkg.duration,
      description: pkg.description,
      inclusions: pkg.inclusions.join("\n"),
      isPopular: !!pkg.isPopular
    });
    setShowAddPackage(true);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    updateCurrentPro(pro => ({
      ...pro,
      packages: pro.packages.filter(p => p.id !== pkgId)
    }));
    triggerSuccess("Package deleted.");
  };

  // Filter bookings for current professional
  const proBookings = bookings.filter(b => 
    b.providerName?.toLowerCase().includes(currentPro?.name?.toLowerCase() || "") ||
    b.serviceName?.toLowerCase().includes(currentPro?.name?.toLowerCase() || "")
  );

  if (!currentPro) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="animate-spin text-[#4A1513] mx-auto mb-3" size={32} />
          <p className="text-stone-600 font-medium text-sm">Loading Professional Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900 pb-20">
      
      {/* Top Banner Navigation */}
      <div className="bg-[#4A1513] text-white py-4 px-4 sm:px-8 border-b border-[#380E0C]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/vendor/dashboard"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-stone-200"
              title="Back to Vendor Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] block">
                Femazon Partner Portal
              </span>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                Beauty &amp; Styling Professionals Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/professionals/${currentPro.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg font-medium transition"
            >
              <Eye size={13} />
              <span>View Public Profile</span>
            </Link>

            <Link
              href="/"
              className="text-xs text-stone-300 hover:text-white transition"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-8">
        
        {/* Success Alert Banner */}
        {savedSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{savedSuccessMsg}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setSavedSuccessMsg("")}
              className="text-emerald-600 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Professional Switcher Strip */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-stone-200/90 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-stone-100 shrink-0">
              <img
                src={currentPro.profileImage}
                alt={currentPro.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Currently Managing:
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                {currentPro.name} • {currentPro.speciality}
              </h3>
            </div>
          </div>

          {/* Profile Selector Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">
              Switch Profile:
            </label>
            <select
              value={selectedProId}
              onChange={(e) => setSelectedProId(e.target.value)}
              className="py-2 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-[#FAF7F5] focus:outline-none focus:border-[#4A1513] text-stone-800"
            >
              {professionals.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-stone-200 mb-8 bg-white rounded-2xl p-1.5 shadow-2xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === "profile" ? "bg-[#4A1513] text-white shadow-xs" : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            1. Profile &amp; Bio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === "portfolio" ? "bg-[#4A1513] text-white shadow-xs" : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            2. Portfolio Looks ({currentPro.portfolio.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === "packages" ? "bg-[#4A1513] text-white shadow-xs" : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            3. Service Packages &amp; Pricing ({currentPro.packages.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "bookings" ? "bg-[#4A1513] text-white shadow-xs" : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            <span>4. Manage Bookings</span>
            {proBookings.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "bookings" ? "bg-white/20 text-white" : "bg-[#4A1513] text-white"}`}>
                {proBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================
            TAB 1: PROFILE MANAGEMENT
           ======================================================== */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm max-w-4xl">
            <div className="mb-6 pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Specialist Identity &amp; Service Details
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Your public profile displayed on the Femazon Marketplace.
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck size={14} /> Verified Member
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name / Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513] bg-white"
                  >
                    {PROFESSIONAL_CATEGORIES.filter(c => c !== "All Categories").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Speciality Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.speciality}
                    onChange={(e) => setProfileForm({ ...profileForm, speciality: e.target.value })}
                    placeholder="e.g. Luxury Bridal & HD Airbrush Makeup"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Location / Service Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. T. Nagar & Cathedral Road, Chennai"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={profileForm.experienceYears}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Profile Picture URL (Real Photo) *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.profileImage}
                    onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.coverImage}
                    onChange={(e) => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Professional Bio &amp; Credentials *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513] leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 2: PORTFOLIO MANAGEMENT
           ======================================================== */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Manage Portfolio Looks &amp; Editorial Photos
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clients browse these verified photos before booking. Upload real bridal and client transformations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="px-5 py-2.5 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#380E0C] transition shadow-xs flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Portfolio Look</span>
              </button>
            </div>

            {/* Add Portfolio Look Card Form */}
            {showAddPortfolio && (
              <form onSubmit={handleAddPortfolio} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#4A1513]/30 shadow-md">
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                  Upload New Look to Portfolio
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Look Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Muhurtham Silk Saree Drape"
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Category Tag *
                    </label>
                    <select
                      value={portfolioForm.category}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513] bg-white"
                    >
                      <option value="Bridal">Bridal</option>
                      <option value="Reception">Reception</option>
                      <option value="Sangeet">Sangeet</option>
                      <option value="Festive">Festive</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Image URL (High-Res Photo) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/dress/... or https://images.unsplash.com/..."
                      value={portfolioForm.image}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, image: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Short Description / Technique Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Knife-edge pleat alignment with zero pin-drag on zari."
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#380E0C]"
                  >
                    Publish Look
                  </button>
                </div>
              </form>
            )}

            {/* Current Portfolio Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {currentPro.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 text-[#4A1513] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h5 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">
                        {item.title}
                      </h5>
                      {item.description && (
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="mt-3 w-full py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Trash2 size={12} />
                      <span>Remove Look</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: SERVICE PACKAGES & PRICING
           ======================================================== */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Multiple Service Packages &amp; Transparent Pricing
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Define your service tiers, transparent pricing, duration, and bulleted inclusions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingPackageId(null);
                  setPackageForm({ name: "", price: "", duration: "90 mins", description: "", inclusions: "", isPopular: false });
                  setShowAddPackage(!showAddPackage);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#380E0C] transition shadow-xs flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Plus size={14} />
                <span>Create New Package</span>
              </button>
            </div>

            {/* Create / Edit Package Form */}
            {showAddPackage && (
              <form onSubmit={handleSavePackage} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#4A1513]/30 shadow-md">
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                  {editingPackageId ? "Edit Service Package" : "Create New Service Package"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bridal Muhurtham Signature Package"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Transparent Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="500"
                      placeholder="18500"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 hours / 3 hours / Full Day"
                      value={packageForm.duration}
                      onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="popularCheckbox"
                      checked={packageForm.isPopular}
                      onChange={(e) => setPackageForm({ ...packageForm, isPopular: e.target.checked })}
                      className="w-4 h-4 accent-[#4A1513] rounded cursor-pointer"
                    />
                    <label htmlFor="popularCheckbox" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      Mark as &ldquo;Most Popular&rdquo; package on profile
                    </label>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Package Summary / Target Occasion *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Comprehensive bridal makeover designed to withstand 12+ hours."
                      value={packageForm.description}
                      onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Package Inclusions (1 per line) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder={"Skin preparation & hydrating primer\nHD Airbrush foundation finish\nWaterproof eye setting\nJewellery adjustments & veil setting"}
                      value={packageForm.inclusions}
                      onChange={(e) => setPackageForm({ ...packageForm, inclusions: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddPackage(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#380E0C]"
                  >
                    {editingPackageId ? "Save Package Changes" : "Create Package"}
                  </button>
                </div>
              </form>
            )}

            {/* Packages List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentPro.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-stone-400 font-semibold">
                        ⏱ {pkg.duration}
                      </span>
                      {pkg.isPopular && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
                      {pkg.name}
                    </h4>

                    <p className="text-xs text-stone-500 mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="p-3 bg-[#FAF7F5] rounded-xl border border-stone-200/60 mb-4">
                      <span className="font-serif text-2xl font-bold text-[#4A1513]">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                      Inclusions ({pkg.inclusions.length}):
                    </span>
                    <ul className="space-y-1.5 mb-6">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => handleEditPackage(pkg)}
                      className="flex-1 py-2 rounded-xl border border-stone-300 hover:border-[#4A1513] hover:text-[#4A1513] text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Package"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: BOOKING MANAGEMENT
           ======================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Client Appointments &amp; Bookings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage confirmed appointments, verify customer event addresses, and coordinate schedules.
                </p>
              </div>

              <div className="text-xs font-bold text-[#4A1513] bg-[#4A1513]/10 px-3 py-1.5 rounded-full">
                {proBookings.length} Recorded Bookings
              </div>
            </div>

            {proBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs">
                <Calendar size={40} className="text-stone-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  No Client Appointments Recorded Yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                  When customers book packages on your profile page, their appointment details appear here instantly.
                </p>
                <Link
                  href={`/professionals/${currentPro.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Eye size={13} />
                  <span>Test Book on Your Profile</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {proBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#4A1513]">
                          #{String(b.id)}
                        </span>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                          {b.serviceName}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {b.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                        <span className="flex items-center gap-1">
                          <User size={13} className="text-stone-400" />
                          <strong>{b.customerName || "Customer"}</strong>
                        </span>
                        {b.customerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone size={13} className="text-stone-400" />
                            {b.customerPhone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-stone-400" />
                          {b.date} ({b.time})
                        </span>
                        {b.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-stone-400" />
                            {b.location}
                          </span>
                        )}
                      </div>

                      {b.notes && (
                        <p className="text-xs text-stone-500 italic pt-1">
                          Note: &ldquo;{b.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <span className="font-serif text-lg font-bold text-[#4A1513]">
                        ₹{Number(b.total).toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={() => triggerSuccess(`Booking #${String(b.id)} marked as completed.`)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
