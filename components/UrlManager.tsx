'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import type { MonitoredUrl } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

export function UrlManager({ user }: { user: User | null }) {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [urls, setUrls] = useState<MonitoredUrl[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('monitored_urls')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setUrls(data ?? []);
      });
  }, [supabase, user]);

  const handleAdd = async () => {
    if (!input) return;
    if (!user) {
      setMessage('Sign in first.');
      return;
    }
    setLoading(true);
    const { data: profile } = await supabase.auth.getUser();
    const email = profile.user?.email ?? '';
    const { data, error } = await supabase
      .from('monitored_urls')
      .insert({ url: input, contact_email: email })
      .select()
      .single();
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setUrls((prev) => [data as MonitoredUrl, ...prev]);
    setInput('');
    setMessage('URL added. First crawl happens within 24 hours.');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('monitored_urls').delete().eq('id', id);
    setUrls((prev) => prev.filter((u) => u.id !== id));
  };

  if (!user) {
    return (
      <div className="card stack">
        <h2 style={{ margin: 0 }}>Monitored URLs</h2>
        <p className="text-slate-700" style={{ margin: 0 }}>
          Sign in to add or remove URLs.
        </p>
      </div>
    );
  }

  return (
    <div className="card stack">
      <div className="stack" style={{ gap: '0.3rem' }}>
        <h2 style={{ margin: 0 }}>Monitored URLs</h2>
        <p className="text-slate-700" style={{ margin: 0 }}>
          Add URLs to watch. SignalDrop checks them once per day and emails when material changes land.
        </p>
      </div>
      <div className="stack" style={{ gap: '0.5rem' }}>
        <input
          className="input"
          type="url"
          placeholder="https://example.com/pricing"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd} disabled={loading || !input}>
          {loading ? 'Saving...' : 'Add URL'}
        </button>
        {message && <p className="text-slate-600" style={{ margin: 0 }}>{message}</p>}
      </div>
      <div className="stack">
        {urls.map((u) => (
          <div key={u.id} className="stack" style={{ gap: '0.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0 }}>{u.url}</p>
                <p className="text-slate-600" style={{ margin: 0, fontSize: '0.9rem' }}>
                  Last check: {u.last_checked_at ? new Date(u.last_checked_at).toLocaleString() : 'Pending'}
                </p>
              </div>
              <button className="btn btn-secondary" onClick={() => handleDelete(u.id)}>
                Remove
              </button>
            </div>
            {u.last_summary && (
              <p className="text-slate-700" style={{ margin: 0 }}>
                Last summary: {u.last_summary}
              </p>
            )}
          </div>
        ))}
        {urls.length === 0 && <p className="text-slate-600">No URLs yet.</p>}
      </div>
    </div>
  );
}
