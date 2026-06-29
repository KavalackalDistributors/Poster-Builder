'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  if (!open) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await signIn('credentials', { email: form.get('email'), password: form.get('password'), redirect: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div><h2 className="text-2xl font-semibold">{isSignUp ? 'Create account' : 'Welcome back'}</h2><p className="text-sm text-[#8e8ea0]">Sign in to generate and save posters.</p></div>
          <button onClick={onClose} className="rounded-full p-2 text-[#8e8ea0] hover:bg-white/10">✕</button>
        </div>
        <button onClick={() => signIn('google')} className="mb-4 w-full rounded-2xl border border-[#333] px-4 py-3 font-medium hover:bg-white/5">Continue with Google</button>
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-[#8e8ea0]"><span className="h-px flex-1 bg-[#333]" />or<span className="h-px flex-1 bg-[#333]" /></div>
        <form onSubmit={submit} className="space-y-3">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 outline-none focus:border-[#4285f4]" />
          <input name="password" type="password" required minLength={6} placeholder="Password" className="w-full rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 outline-none focus:border-[#4285f4]" />
          <button className="w-full rounded-2xl bg-gradient-to-br from-[#4285f4] to-[#8b5cf6] px-4 py-3 font-semibold">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-sm text-[#8e8ea0] hover:text-white">{isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}</button>
      </div>
    </div>
  );
}
