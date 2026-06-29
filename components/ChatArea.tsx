'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage, PosterDesign, PosterSize, UploadedImage } from '@/lib/types';
import PosterCanvas from './PosterCanvas';

const suggestions = ['Create a poster for my coffee shop', 'Make a bold sale poster for sneakers', 'Luxury perfume advertisement poster'];

export default function ChatArea({ messages, poster, images, loading, size, onSuggestion }: { messages: ChatMessage[]; poster: PosterDesign; images: UploadedImage[]; loading: boolean; size: PosterSize; onSuggestion: (text: string) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#4285f4] to-[#8b5cf6] text-2xl font-bold">P</div>
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">PosterAI</h1>
          <p className="mt-4 text-xl text-[#8e8ea0]">Describe your poster and watch it come to life</p>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {suggestions.map((suggestion) => <button key={suggestion} onClick={() => onSuggestion(suggestion)} className="rounded-3xl border border-[#333] bg-[#1a1a1a] p-5 text-left text-sm transition hover:-translate-y-1 hover:border-[#4285f4] hover:bg-[#202020]">{suggestion}</button>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`animate-message flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#4285f4] to-[#8b5cf6] text-sm font-bold">P</div>}
            <div className={`max-w-[82%] rounded-[1.5rem] px-5 py-4 ${message.role === 'user' ? 'bg-[#2f2f2f]' : 'bg-[#1a1a1a]'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.images?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.images.map((image) => <img key={image.id} src={image.src} alt={image.name} className="h-16 w-16 rounded-xl object-cover" />)}</div> : null}
              {message.poster && (
                <div className="mt-4 rounded-[2rem] border border-white/10 bg-[#0f0f0f] p-3 xl:hidden">
                  <PosterCanvas poster={message.poster} image={images[0]?.src ?? null} loading={false} hasStarted size={size} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="animate-message flex gap-4"><div className="h-9 w-9 rounded-full bg-[#333]" /><div className="rounded-[1.5rem] bg-[#1a1a1a] px-5 py-4 text-[#8e8ea0]">PosterAI is designing...</div></div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
