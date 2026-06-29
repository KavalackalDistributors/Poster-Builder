'use client';

import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';
import ChatArea from '@/components/ChatArea';
import InputBar from '@/components/InputBar';
import PosterPanel from '@/components/PosterPanel';
import Sidebar from '@/components/Sidebar';
import { loadSessions, upsertSession } from '@/lib/chatHistory';
import { ChatMessage, ChatSession, PosterDesign, PosterSize, PosterStyle, UploadedImage, emptyPoster } from '@/lib/types';

export default function Home() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [poster, setPoster] = useState<PosterDesign>(emptyPoster);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [style, setStyle] = useState<PosterStyle>('modern');
  const [size, setSize] = useState<PosterSize>('portrait');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSessions(loadSessions()), []);

  const persist = (nextMessages: ChatMessage[], nextPoster = poster, nextImages = images) => {
    if (!nextMessages.length) return;
    const now = new Date().toISOString();
    const first = nextMessages.find((message) => message.role === 'user')?.content || 'Untitled poster';
    const chatSession: ChatSession = {
      id: currentId ?? crypto.randomUUID(),
      title: first.slice(0, 48),
      messages: nextMessages,
      posterState: nextPoster,
      images: nextImages,
      createdAt: sessions.find((item) => item.id === currentId)?.createdAt ?? now,
      updatedAt: now,
    };
    setCurrentId(chatSession.id);
    setSessions(upsertSession(chatSession));
  };

  const sendMessage = async (text: string) => {
    if (!session?.user || loading || (!text && images.length === 0)) {
      if (!session?.user) setAuthOpen(true);
      return;
    }
    const prompt = `${text}\nPreferred style: ${style}. Poster size: ${size}. Uploaded images: ${images.length}.`;
    const userMessage: ChatMessage = { role: 'user', content: text || 'Create a poster using these images.', images };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    persist(nextMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: prompt }] }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'PosterAI could not generate that poster.');
      const aiMessage: ChatMessage = { role: 'assistant', content: data.reply, poster: data.poster };
      const finalMessages = [...nextMessages, aiMessage];
      setPoster(data.poster);
      setMessages(finalMessages);
      persist(finalMessages, data.poster);
    } catch (error) {
      const fallback: ChatMessage = { role: 'assistant', content: error instanceof Error ? error.message : 'Something went wrong. Try another prompt.' };
      const finalMessages = [...nextMessages, fallback];
      setMessages(finalMessages);
      persist(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const newPoster = () => {
    setCurrentId(null);
    setMessages([]);
    setPoster(emptyPoster);
    setImages([]);
    setDrawerOpen(false);
  };

  const restore = (chatSession: ChatSession) => {
    setCurrentId(chatSession.id);
    setMessages(chatSession.messages);
    setPoster(chatSession.posterState);
    setImages(chatSession.images ?? []);
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    const canvas = await html2canvas(posterRef.current, { backgroundColor: null, scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = 'posterai-design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1800px] bg-[#0f0f0f] text-white">
      <Sidebar sessions={sessions} currentId={currentId} onSelect={restore} onNew={newPoster} onAuth={() => setAuthOpen(true)} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-4 md:px-6">
          <button onClick={() => setDrawerOpen(true)} className="rounded-full p-2 hover:bg-white/10 md:hidden">☰</button>
          <div className="font-semibold">{messages.length ? 'Poster chat' : 'New poster'}</div>
          {!session?.user && <button onClick={() => setAuthOpen(true)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Sign In</button>}
        </header>
        <ChatArea messages={messages} poster={poster} images={images} loading={loading} size={size} onSuggestion={sendMessage} />
        <InputBar images={images} setImages={setImages} onSend={sendMessage} disabled={!session?.user} loading={loading} style={style} setStyle={setStyle} size={size} setSize={setSize} />
      </section>
      <PosterPanel poster={poster} images={images} loading={loading} size={size} posterRef={posterRef} onDownload={downloadPoster} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
