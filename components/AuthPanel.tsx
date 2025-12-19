'use client';

import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

export function AuthPanel({ onAuth }: { onAuth: (user: User | null) => void }) {
  const supabase = getBrowserClient();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => onAuth(data.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      onAuth(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('Check your email for a recovery link.');
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [onAuth, supabase]);

  const handleMagicLink = async () => {
    setStatus('Sending magic link...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? `Error: ${error.message}` : 'Check your email for a sign-in link.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onAuth(null);
  };

  return (
    <div className="card stack">
      <div className="stack" style={{ gap: '0.25rem' }}>
        <h2 style={{ margin: 0 }}>Authentication</h2>
        <p className="text-slate-700" style={{ margin: 0 }}>
          Sign in with a magic link to manage your monitored URLs.
        </p>
      </div>
      <div className="stack" style={{ gap: '0.5rem' }}>
        <input
          className="input"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <button className="btn btn-primary" onClick={handleMagicLink} disabled={!email}>
            Send magic link
          </button>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
        {status && <p className="text-slate-600" style={{ margin: 0 }}>{status}</p>}
      </div>
    </div>
  );
}
