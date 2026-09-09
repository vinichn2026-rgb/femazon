"use client";

import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  Shirt, 
  Scissors,
  Check
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

type MeasurementProfile = {
  id: string;
  name: string;
  category: string;
  bust: number;
  waist: number;
  hips: number;
  shoulder: number;
  blouseLength: number;
  sleeveLength: number;
  armHole: number;
  frontNeckDepth: number;
  backNeckDepth: number;
  skirtLength: number;
  height: string;
  unit: 'inch' | 'cm';
  isDefault: boolean;
};

const DEFAULT_PROFILES: MeasurementProfile[] = [
  {
    id: "m_1",
    name: "My Bridal & Lehenga Fit",
    category: "Lehengas & Blouses",
    bust: 36,
    waist: 30,
    hips: 39,
    shoulder: 14.5,
    blouseLength: 14,
    sleeveLength: 11,
    armHole: 16,
    frontNeckDepth: 7,
    backNeckDepth: 9,
    skirtLength: 42,
    height: "5' 5\"",
    unit: "inch",
    isDefault: true
  },
  {
    id: "m_2",
    name: "Kurti & Anarkali Standard",
    category: "Chudithar & Suits",
    bust: 36,
    waist: 31,
    hips: 40,
    shoulder: 14.5,
    blouseLength: 15,
    sleeveLength: 17,
    armHole: 16.5,
    frontNeckDepth: 6.5,
    backNeckDepth: 6.5,
    skirtLength: 40,
    height: "5' 5\"",
    unit: "inch",
    isDefault: false
  }
];

export default function MeasurementsPage() {
  const { user } = useFemazonStore();
  const [profiles, setProfiles] = useState<MeasurementProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>("m_1");
  const [isEditing, setIsEditing] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Form State
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const [formData, setFormData] = useState<MeasurementProfile>(activeProfile);

  useEffect(() => {
    if (activeProfile) {
      setFormData(activeProfile);
    }
  }, [activeProfileId, activeProfile]);

  const handleFieldChange = (field: keyof MeasurementProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfiles(prev => prev.map(p => p.id === formData.id ? formData : p));
    setIsEditing(false);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleCreateNewProfile = () => {
    const newProfile: MeasurementProfile = {
      id: "m_" + Date.now(),
      name: "Custom Sizing " + (profiles.length + 1),
      category: "Couture Fit",
      bust: 36,
      waist: 30,
      hips: 39,
      shoulder: 14,
      blouseLength: 14,
      sleeveLength: 10,
      armHole: 16,
      frontNeckDepth: 7,
      backNeckDepth: 8,
      skirtLength: 41,
      height: "5' 4\"",
      unit: "inch",
      isDefault: false
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4A1513] mb-1">
            <Scissors size={15} />
            <span>Luxury Custom Fitting</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            My Measurements &amp; Fit Profile
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Save your exact sizing for tailor-fit designer lehengas, blouses, and custom couture.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNewProfile}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Add New Fit Profile</span>
        </button>
      </div>

      {/* Success Banner */}
      {isSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Your custom measurements have been saved successfully for future designer orders ✓</span>
        </div>
      )}

      {/* Profile Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => {
              setActiveProfileId(p.id);
              setIsEditing(false);
            }}
            className={`px-5 py-3 rounded-2xl border text-left transition-all cursor-pointer shrink-0 ${
              activeProfileId === p.id
                ? 'bg-white border-[#4A1513] shadow-xs ring-1 ring-[#4A1513]'
                : 'bg-white/60 border-stone-200 hover:border-stone-300 text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${activeProfileId === p.id ? 'text-[#4A1513]' : 'text-stone-800'}`}>
                {p.name}
              </span>
              {p.isDefault && (
                <span className="px-1.5 py-0.5 rounded-sm bg-[#4A1513]/10 text-[#4A1513] text-[9px] font-bold uppercase">
                  Default
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">{p.category}</p>
          </button>
        ))}
      </div>

      {/* Measurement Editor Form & Visual Guide */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">
              {formData.name}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Unit: <strong className="text-stone-700 uppercase">{formData.unit}</strong> • Height: <strong className="text-stone-700">{formData.height}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:border-[#4A1513] text-[#4A1513] text-xs font-bold uppercase tracking-wider transition hover:bg-[#FAF7F5] cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Edit Sizing</span>
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
              >
                <Check size={14} />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Bust */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Bust / Chest
              </label>
              <span className="text-[11px] text-stone-400">Around fullest point</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.bust}
                onChange={(e) => handleFieldChange('bust', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Waist */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Natural Waist
              </label>
              <span className="text-[11px] text-stone-400">Above navel</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.waist}
                onChange={(e) => handleFieldChange('waist', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Hips */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Hips
              </label>
              <span className="text-[11px] text-stone-400">Around widest area</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.hips}
                onChange={(e) => handleFieldChange('hips', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Shoulder */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Shoulder Width
              </label>
              <span className="text-[11px] text-stone-400">Tip to tip across back</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.shoulder}
                onChange={(e) => handleFieldChange('shoulder', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Blouse Length */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Blouse Length
              </label>
              <span className="text-[11px] text-stone-400">Shoulder to waist hem</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.blouseLength}
                onChange={(e) => handleFieldChange('blouseLength', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Lehenga Skirt Length */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Skirt / Lehenga Length
              </label>
              <span className="text-[11px] text-stone-400">Waist to floor (with heels)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.skirtLength}
                onChange={(e) => handleFieldChange('skirtLength', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Sleeve Length */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Sleeve Length
              </label>
              <span className="text-[11px] text-stone-400">Shoulder edge down</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.sleeveLength}
                onChange={(e) => handleFieldChange('sleeveLength', parseFloat(e.target.value) || 0)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs font-semibold text-stone-500">inches</span>
            </div>
          </div>

          {/* Front & Back Neck Depth */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Front / Back Neck
              </label>
              <span className="text-[11px] text-stone-400">Depth in inches</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.frontNeckDepth}
                onChange={(e) => handleFieldChange('frontNeckDepth', parseFloat(e.target.value) || 0)}
                className="w-1/2 bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
              <span className="text-xs text-stone-400">/</span>
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={formData.backNeckDepth}
                onChange={(e) => handleFieldChange('backNeckDepth', parseFloat(e.target.value) || 0)}
                className="w-1/2 bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
            </div>
          </div>

          {/* User Height */}
          <div className="p-4 rounded-2xl bg-[#FAF7F5]/50 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Height
              </label>
              <span className="text-[11px] text-stone-400">Feet &amp; inches</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled={!isEditing}
                value={formData.height}
                onChange={(e) => handleFieldChange('height', e.target.value)}
                className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-[#4A1513] disabled:bg-stone-50"
              />
            </div>
          </div>

        </div>

        {/* Couture Tailoring Advice Box */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#FAF7F5] border border-stone-200 flex items-start gap-3.5">
          <Info size={18} className="text-[#4A1513] shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-900 font-semibold">How Femazon Tailoring Works:</strong> When ordering custom couture lehengas or blouses, our master stylists automatically reference your saved profile. You can also schedule a complimentary 1-on-1 virtual measurement session with our head tailor.
          </div>
        </div>

      </form>

    </div>
  );
}
