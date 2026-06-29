'use client';

import type { UploadedImage } from '@/lib/types';

export default function ImageThumbnails({ images, onRemove }: { images: UploadedImage[]; onRemove: (id: string) => void }) {
  if (!images.length) return null;
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {images.map((image) => (
        <div key={image.id} className="animate-thumb relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e]">
          <img src={image.src} alt={image.name} className="h-full w-full object-cover" />
          <button type="button" onClick={() => onRemove(image.id)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-xs text-white">×</button>
        </div>
      ))}
      <span className="rounded-full border border-[#333] px-3 py-1 text-xs text-[#8e8ea0]">{images.length}/5 images</span>
    </div>
  );
}
