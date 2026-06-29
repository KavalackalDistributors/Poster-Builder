import type { ChatSession } from '@/lib/types';

const KEY = 'posterai.chat.sessions';

export function loadSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as ChatSession[];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function upsertSession(session: ChatSession) {
  const sessions = loadSessions();
  const next = [session, ...sessions.filter((item) => item.id !== session.id)].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  saveSessions(next);
  return next;
}

export function groupSessions(sessions: ChatSession[]) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - 86400000;
  const last7 = startToday - 6 * 86400000;
  return {
    Today: sessions.filter((session) => +new Date(session.createdAt) >= startToday),
    Yesterday: sessions.filter((session) => +new Date(session.createdAt) >= startYesterday && +new Date(session.createdAt) < startToday),
    'Last 7 days': sessions.filter((session) => +new Date(session.createdAt) >= last7 && +new Date(session.createdAt) < startYesterday),
  };
}
