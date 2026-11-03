'use client';

import { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: string;
}

export function ProductImage({
  src,
  alt,
  className = 'w-full h-full object-contain',
  fallbackIcon = '📦',
}: ProductImageProps) {
  const [error, setError] = useState(false);

  // If no source provided or image failed to load, display clean fallback badge
  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center rounded-xl select-none p-1 bg-white/[0.04] border border-white/10">
        <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{fallbackIcon}</span>
        <span className="text-[9px] font-bold text-[#4b7a5e] uppercase tracking-wider text-center line-clamp-1 mt-0.5">
          {alt.split(' ')[0]}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}
