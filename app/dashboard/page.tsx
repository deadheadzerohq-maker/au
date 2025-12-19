'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AuthPanel } from '@/components/AuthPanel';
import { UrlManager } from '@/components/UrlManager';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <main className="stack">
      <div className="stack" style={{ gap: '0.5rem' }}>
        <h1 style={{ margin: 0 }}>SignalDrop dashboard</h1>
        <p className="text-slate-700" style={{ margin: 0 }}>
          Manage authentication and the URLs you monitor. We keep the surface area small—no analytics or noisy reports.
        </p>
      </div>
      <AuthPanel onAuth={setUser} />
      <UrlManager user={user} />
    </main>
  );
}
