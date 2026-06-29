'use client';

import { signOut, useSession } from 'next-auth/react';
import type { ChatSession } from '@/lib/types';
import { groupSessions } from '@/lib/chatHistory';

export default function Sidebar({ sessions, currentId, onSelect, onNew, onAuth, open, onClose }: { sessions: ChatSession[]; currentId: string | null; onSelect: (session: ChatSession) => void; onNew: () => void; onAuth: () => void; open: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const grouped = groupSessions(sessions);
  const content = (
    <div className="flex h-full flex-col bg-[#1a1a1a] p-3 text-white">
      <div className="mb-5 flex items-center gap-3 px-2 py-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4285f4] to-[#8b5cf6] font-bold">P</div>
        <span className="sidebar-label hidden text-lg font-semibold tracking-tight lg:inline">PosterAI</span>
      </div>
      <button onClick={onNew} className="mb-5 flex items-center gap-3 rounded-2xl border border-[#333] px-3 py-3 text-sm font-medium transition hover:bg-white/10">
        <span>✎</span><span className="sidebar-label hidden lg:inline">New Poster</span>
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto space-y-5">
        {Object.entries(grouped).map(([label, items]) => items.length > 0 && (
          <div key={label}>
            <p className="sidebar-label mb-2 hidden px-2 text-xs font-medium uppercase tracking-wider text-[#8e8ea0] lg:block">{label}</p>
            <div className="space-y-1">
              {items.map((item) => (
                <button key={item.id} onClick={() => { onSelect(item); onClose(); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/10 ${currentId === item.id ? 'bg-white/10' : ''}`}>
                  <span className="shrink-0">💬</span><span className="sidebar-label hidden truncate lg:inline">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-3">
        {session?.user ? (
          <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-white/5">
            <img src={session.user.image ?? `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name ?? 'User'}`} alt="User avatar" className="h-9 w-9 rounded-full" />
            <div className="sidebar-label hidden min-w-0 flex-1 lg:block"><p className="truncate text-sm font-medium">{session.user.name ?? 'PosterAI User'}</p><button onClick={() => signOut()} className="text-xs text-[#8e8ea0]">Sign out</button></div>
            <span className="sidebar-label hidden text-[#8e8ea0] lg:inline">⚙</span>
          </div>
        ) : (
          <button onClick={onAuth} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black lg:block">Sign In</button>
        )}
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden h-screen shrink-0 border-r border-white/10 transition-all duration-300 md:block md:w-[60px] lg:w-[220px] xl:w-[260px] 2xl:w-[300px]">{content}</aside>
      <div className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} />
      <aside className={`drawer-sidebar fixed inset-y-0 left-0 z-50 w-[260px] transform border-r border-white/10 transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>{content}</aside>
    </>
  );
}
