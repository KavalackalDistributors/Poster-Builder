'use client';

import type { RefObject } from 'react';
import type { PosterDesign, PosterSize, UploadedImage } from '@/lib/types';
import PosterCanvas from './PosterCanvas';

export default function PosterPanel({ poster, images, loading, size, posterRef, onDownload }: { poster: PosterDesign; images: UploadedImage[]; loading: boolean; size: PosterSize; posterRef?: RefObject<HTMLDivElement>; onDownload?: () => void }) {
  return (
    <aside className="hidden w-[400px] shrink-0 border-l border-white/10 bg-[#121212] p-5 xl:flex 2xl:w-[500px]">
      <div className="sticky top-5 flex h-[calc(100vh-2.5rem)] w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-[#8e8ea0]">Live poster</p><h2 className="font-semibold">Preview</h2></div>
          {onDownload && <button onClick={onDownload} className="rounded-full border border-[#333] px-4 py-2 text-sm hover:bg-white/10">Download</button>}
        </div>
        <div className="grid flex-1 place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f0f] p-4">
          <PosterCanvas ref={posterRef} poster={poster} image={images[0]?.src ?? null} loading={loading} hasStarted size={size} />
        </div>
      </div>
    </aside>
  );
}
