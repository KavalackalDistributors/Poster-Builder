'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import type { ChatMessage, PosterDesign } from '@/lib/types';
import ImageUpload from './ImageUpload';

const starters = ['Create a poster for my coffee shop', 'Make a bold sale poster for sneakers', 'Luxury perfume advertisement poster'];

interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  onPoster: (poster: PosterDesign) => void;
  image: string | null;
  onImageChange: (image: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function ChatPanel({ messages, setMessages, onPoster, image, onImageChange, loading, setLoading }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  const sendMessage = async (content = input) => {
    if (!content.trim() || loading) return;
    setError('');
    setInput('');
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: content.trim() }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
      onPoster(data.poster);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PosterAI could not respond. Please try again.');
      setMessages([...nextMessages, { role: 'assistant', content: 'I hit a snag, but I am ready to try another poster direction.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <aside className="flex h-full flex-col bg-slate-950 p-5 text-white lg:max-h-[calc(100vh-76px)] lg:w-[420px]">
      <ImageUpload image={image} onImageChange={onImageChange} />
      <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Try one of these prompts:</p>
            {starters.map((starter) => (
              <button key={starter} type="button" onClick={() => sendMessage(starter)} className="block w-full rounded-2xl bg-slate-900 p-4 text-left text-sm font-medium transition hover:bg-slate-800">
                {starter}
              </button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl p-4 text-sm leading-relaxed ${message.role === 'user' ? 'ml-8 bg-indigo-600' : 'mr-8 bg-slate-900 text-slate-200'}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="mr-8 rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">Designing your poster...</div>}
        {error && <div className="rounded-2xl bg-rose-500/20 p-3 text-sm text-rose-200">{error}</div>}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={onSubmit} className="mt-5 flex gap-2">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe your poster..." className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-indigo-400" />
        <button disabled={loading} className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-bold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50">Send</button>
      </form>
    </aside>
  );
}
