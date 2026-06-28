'use client';

import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import ChatPanel from '@/components/ChatPanel';
import PosterCanvas from '@/components/PosterCanvas';
import { ChatMessage, PosterDesign, emptyPoster } from '@/lib/types';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [poster, setPoster] = useState<PosterDesign>(emptyPoster);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    const canvas = await html2canvas(posterRef.current, { backgroundColor: null, scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = 'posterai-design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToast('Poster downloaded successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 font-black text-white">PA</div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">PosterAI</h1>
            <p className="text-xs font-medium text-slate-500">Gemini-powered poster studio</p>
          </div>
        </div>
        <button onClick={downloadPoster} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600">
          Download Poster
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row">
        <ChatPanel messages={messages} setMessages={setMessages} onPoster={setPoster} image={image} onImageChange={setImage} loading={loading} setLoading={setLoading} />
        <section className="flex min-h-[calc(100vh-76px)] flex-1 flex-col items-center justify-center gap-6 p-5 lg:p-10">
          <div className="max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">Live Preview</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Watch your campaign poster evolve in real time.</h2>
          </div>
          <PosterCanvas ref={posterRef} poster={poster} image={image} loading={loading} hasStarted={messages.length > 0} />
        </section>
      </div>

      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div>}
    </main>
  );
}
