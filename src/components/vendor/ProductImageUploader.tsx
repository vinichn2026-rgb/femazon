'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Star, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  minImages?: number;
  maxImages?: number;
  disabled?: boolean;
}

export function ProductImageUploader({
  images = [],
  onChange,
  minImages = 3,
  maxImages = 5,
  disabled = false,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    setErrorMessage(null);

    const files = Array.from(fileList);
    const availableSlots = maxImages - images.length;

    if (files.length > availableSlots) {
      setErrorMessage(`You can only upload up to ${maxImages} images in total. (${availableSlots} slot${availableSlots === 1 ? '' : 's'} remaining)`);
      return;
    }

    // Validate types and sizes
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }
    }

    setIsUploading(true);
    const newUploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload "${file.name}"`);
        }

        const data = await res.json();
        if (data.url) {
          newUploadedUrls.push(data.url);
        }
      }

      onChange([...images, ...newUploadedUrls]);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReplaceFile = async (fileList: FileList | null) => {
    const targetIdx = replaceIndexRef.current;
    if (!fileList || fileList.length === 0 || targetIdx === null) return;
    setErrorMessage(null);

    const file = fileList[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(`"${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(`"${file.name}" exceeds the 5MB size limit.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to replace image`);
      }

      const data = await res.json();
      if (data.url) {
        const updated = [...images];
        updated[targetIdx] = data.url;
        onChange(updated);
      }
    } catch (err: any) {
      console.error('Image replacement failed:', err);
      setErrorMessage(err.message || 'Image replacement failed.');
    } finally {
      setIsUploading(false);
      replaceIndexRef.current = null;
      if (replaceInputRef.current) {
        replaceInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
    setErrorMessage(null);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const remaining = images.filter((_, idx) => idx !== index);
    onChange([item, ...remaining]);
  };

  const triggerReplace = (index: number) => {
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const isValidCount = images.length >= minImages && images.length <= maxImages;

  return (
    <div className="space-y-3">
      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading || images.length >= maxImages}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleReplaceFile(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
          Product Images * ({images.length}/{maxImages})
        </label>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            isValidCount
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isValidCount ? (
            <>
              <CheckCircle2 size={13} /> Ready ({images.length} images)
            </>
          ) : (
            <>
              <AlertCircle size={13} /> {minImages - images.length > 0 ? `Need at least ${minImages - images.length} more` : `Max ${maxImages} allowed`}
            </>
          )}
        </span>
      </div>

      <p className="text-[11px] text-stone-500">
        Upload <strong>3 to 5 high-resolution images</strong> (JPG, PNG, WebP up to 5MB each). The first image is the cover thumbnail.
      </p>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-500 hover:text-rose-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className={`group relative aspect-square rounded-2xl border overflow-hidden bg-stone-100 flex flex-col justify-between shadow-2xs transition-all ${
              idx === 0
                ? 'border-[#4A1513] ring-2 ring-[#4A1513]/20'
                : 'border-stone-200 hover:border-stone-400'
            }`}
          >
            {/* Image Preview */}
            <img
              src={url}
              alt={`Product preview ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Cover Badge */}
            <div className="relative z-10 p-1.5 flex justify-between items-start">
              {idx === 0 ? (
                <span className="inline-flex items-center gap-1 bg-[#4A1513] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  <Star size={10} className="fill-white" /> Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  title="Make this the cover image"
                  className="bg-white/90 hover:bg-white text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs transition opacity-0 group-hover:opacity-100"
                >
                  Set Cover
                </button>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remove image"
                className="w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-xs"
              >
                <X size={12} />
              </button>
            </div>

            {/* Replace button on hover */}
            <div className="relative z-10 p-1.5 mt-auto bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => triggerReplace(idx)}
                className="w-full text-center py-1 text-[10px] font-semibold text-white hover:underline"
              >
                Replace
              </button>
            </div>
          </div>
        ))}

        {/* Upload Trigger Card (if slots available) */}
        {images.length < maxImages && (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#4A1513] hover:bg-[#FAF7F5] bg-white transition flex flex-col items-center justify-center p-3 text-center cursor-pointer group ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={24} className="text-[#4A1513] animate-spin mb-1" />
                <span className="text-[11px] font-semibold text-stone-700">Uploading to DB...</span>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-rose-50 text-stone-500 group-hover:text-[#4A1513] flex items-center justify-center transition mb-1.5">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-bold text-stone-800">Upload Image</span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  +{maxImages - images.length} more
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Validation helper text */}
      {!isValidCount && images.length < minImages && (
        <p className="text-[11px] text-amber-700 flex items-center gap-1">
          <AlertCircle size={13} className="shrink-0" />
          A minimum of {minImages} images is required to publish or update this product.
        </p>
      )}
    </div>
  );
}
