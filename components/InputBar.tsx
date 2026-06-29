'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import type { PosterSize, PosterStyle, UploadedImage } from '@/lib/types';
import ImageThumbnails from './ImageThumbnails';

const styles: PosterStyle[] = ['modern', 'bold', 'minimal', 'luxury', 'playful'];
const sizes: PosterSize[] = ['portrait', 'landscape', 'square'];

interface InputBarProps {
  images: UploadedImage[];
  setImages: (images: UploadedImage[]) => void;
  onSend: (text: string) => void;
  disabled: boolean;
  loading: boolean;
  style: PosterStyle;
  setStyle: (style: PosterStyle) => void;
  size: PosterSize;
  setSize: (size: PosterSize) => void;
}

export default function InputBar({ images, setImages, onSend, disabled, loading, style, setStyle, size, setSize }: InputBarProps) {
  const [text, setText] = useState('');
  const [styleOpen, setStyleOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canSend = !disabled && !loading && (!!text.trim() || images.length > 0);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files)
      .filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      .slice(0, 5 - images.length);

    Promise.all(allowed.map((file) => new Promise<UploadedImage>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: crypto.randomUUID(), src: String(reader.result), name: file.name });
      reader.readAsDataURL(file);
    }))).then((next) => setImages([...images, ...next].slice(0, 5));
  };

  const submit = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent px-4 pb-4 pt-8">
      <div className="mx-auto max-w-3xl">
        <ImageThumbnails images={images} onRemove={(id) => setImages(images.filter((image) => image.id !== id))} />
        <div className="rounded-[1.75rem] border border-[#333] bg-[#1e1e1e] p-3 shadow-2xl">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={keyDown}
            rows={1}
            placeholder={disabled ? 'Sign in to create posters...' : 'Describe your poster...'}
            className="max-h-[200px] min-h-12 w-full resize-none bg-transparent px-2 py-2 text-white outline-none placeholder:text-[#8e8ea0]"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full p-3 text-[#8e8ea0] hover:bg-white/10 hover:text-white">📎</button>
              <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => addFiles(event.target.files)} />
              <div className="relative">
                <button type="button" onClick={() => setStyleOpen(!styleOpen)} className="rounded-full px-3 py-2 text-sm text-[#8e8ea0] hover:bg-white/10 hover:text-white">✨ {style}</button>
                {styleOpen && <div className="absolute bottom-12 left-0 rounded-2xl border border-[#333] bg-[#1a1a1a] p-2 shadow-xl">{styles.map((item) => <button key={item} onClick={() => { setStyle(item); setStyleOpen(false); }} className="block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-white/10">{item}</button>)}</div>}
              </div>
              <div className="relative">
                <button type="button" onClick={() => setSizeOpen(!sizeOpen)} className="rounded-full px-3 py-2 text-sm text-[#8e8ea0] hover:bg-white/10 hover:text-white">📐 {size}</button>
                {sizeOpen && <div className="absolute bottom-12 left-0 rounded-2xl border border-[#333] bg-[#1a1a1a] p-2 shadow-xl">{sizes.map((item) => <button key={item} onClick={() => { setSize(item); setSizeOpen(false); }} className="block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-white/10">{item}</button>)}</div>}
              </div>
            </div>
            <button type="button" disabled={!canSend} onClick={submit} className="grid h-11 w-11 place-items-center rounded-full bg-[#333] text-[#8e8ea0] transition hover:scale-105 enabled:bg-gradient-to-br enabled:from-[#4285f4] enabled:to-[#8b5cf6] enabled:text-white disabled:cursor-not-allowed">↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
