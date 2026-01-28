'use client';

import React, { useState } from 'react';
import { RiImageLine, RiCloseLine, RiExternalLinkLine } from 'react-icons/ri';

interface ImageUrlInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  previewSize?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'banner' | 'portrait';
  gameSlug?: string; // Game slug for generating default image URLs
  imageType?: 'icon' | 'banner' | 'hero' | 'logo'; // Type of image for default URL
}

/**
 * ImageUrlInput - URL input with live image preview
 */
export default function ImageUrlInput({
  label,
  name,
  value,
  onChange,
  placeholder = 'https://example.com/image.png',
  description,
  previewSize = 'lg',
  aspectRatio = 'square',
  gameSlug,
  imageType,
}: ImageUrlInputProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(false);
    setImageLoading(true);
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const hasValidUrl = value && value.trim().length > 0;

  // Generate default image URL from gameSlug if available
  const getPreviewUrl = () => {
    if (hasValidUrl) return value;
    if (gameSlug && imageType) {
      return `https://images.gamecp.com/images/${gameSlug}/${imageType}.webp`;
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  // Preview container sizing
  const previewContainerClasses =
    aspectRatio === 'banner'
      ? 'aspect-[21/9] w-full max-w-[280px]'
      : aspectRatio === 'portrait'
        ? 'aspect-[2/3] w-full max-w-[120px]'
        : 'aspect-square w-full max-w-[120px]';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Preview Area - Now on top and larger */}
      <div
        className={`${previewContainerClasses} rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center overflow-hidden transition-all hover:border-muted-foreground/30 group relative`}
      >
        {previewUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {/* Hover overlay with link */}
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
              onClick={e => e.stopPropagation()}
            >
              <RiExternalLinkLine className="w-6 h-6 text-white drop-shadow-lg" />
            </a>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <RiImageLine className="w-10 h-10" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="url"
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 pr-9 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          {hasValidUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Clear"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          )}
        </div>
        {imageError && hasValidUrl && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
            Failed to load image. Check the URL.
          </p>
        )}
        {description && !imageError && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
