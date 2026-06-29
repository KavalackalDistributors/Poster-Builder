'use client';

import { forwardRef } from 'react';
import type { PosterDesign, PosterSize } from '@/lib/types';

interface PosterCanvasProps {
  poster: PosterDesign;
  image: string | null;
  loading: boolean;
  hasStarted: boolean;
  size?: PosterSize;
}

const layoutClass = { centered: 'items-center text-center', 'left-aligned': 'items-start text-left', split: 'items-start text-left md:flex-row' };

const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(({ poster, image, loading, hasStarted, size = 'portrait' }, ref) => {
  const isSplit = poster.layout === 'split';
  return (
    <div className={`relative poster-scale max-w-[800px] overflow-hidden rounded-[2rem] shadow-glow ring-1 ring-black/5 ${size === 'landscape' ? 'poster-landscape' : size === 'square' ? 'poster-square' : ''}`}>
      <div
        ref={ref}
        className={`relative flex h-full w-full flex-col justify-between overflow-hidden p-[7%] transition-all duration-500 ${layoutClass[poster.layout]}`}
        style={{ background: `linear-gradient(145deg, ${poster.backgroundColor}, ${poster.accentColor}33)`, color: poster.textColor }}
      >
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: poster.accentColor }} />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: poster.accentColor }} />

        {!hasStarted && <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">Your poster preview</span>}

        <div className={`z-10 flex w-full flex-1 flex-col justify-center gap-8 ${isSplit ? 'md:flex-row md:items-center' : 'items-inherit'}`}>
          <div className="max-w-xl space-y-5">
            <p className="text-lg font-bold uppercase tracking-[0.25em]" style={{ color: poster.accentColor }}>{poster.tagline}</p>
            <h1 className="text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">{poster.headline}</h1>
            <p className="max-w-lg text-xl leading-relaxed opacity-85">{poster.description}</p>
            <span className="inline-flex rounded-full px-7 py-4 text-lg font-extrabold shadow-2xl" style={{ backgroundColor: poster.accentColor, color: poster.backgroundColor }}>
              {poster.cta}
            </span>
          </div>
          {image && <img src={image} alt="Product" className="z-10 max-h-[42%] max-w-[72%] rounded-[2rem] object-contain shadow-2xl md:max-h-[55%] md:max-w-[42%]" />}
        </div>

        <div className="z-10 mt-6 text-sm font-semibold uppercase tracking-[0.35em] opacity-60">PosterAI Studio</div>
      </div>
      {loading && <div className="absolute inset-0 animate-pulse bg-white/40 backdrop-blur-sm" />}
    </div>
  );
});
PosterCanvas.displayName = 'PosterCanvas';
export default PosterCanvas;
