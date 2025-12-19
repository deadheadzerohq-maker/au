import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { detectMeaningfulChange } from '@/lib/diff';
import { sendChangeEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('authorization');
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const { data: urls, error } = await supabaseAdmin
    .from('monitored_urls')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!urls || urls.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const results = [] as Array<{ url: string; changed: boolean; error?: string }>;

  for (const row of urls) {
    try {
      const response = await fetch(row.url);
      if (!response.ok) {
        results.push({ url: row.url, changed: false, error: `Fetch failed: ${response.status}` });
        continue;
      }
      const body = await response.text();
      const diff = await detectMeaningfulChange(row.last_content, body);

      const now = new Date().toISOString();
      await supabaseAdmin
        .from('monitored_urls')
        .update({
          last_hash: diff.hash,
          last_summary: diff.summary,
          last_content: body,
          last_checked_at: now
        })
        .eq('id', row.id);

      if (row.last_hash && row.last_hash !== diff.hash) {
        await supabaseAdmin.from('change_events').insert({
          monitored_url_id: row.id,
          summary: diff.summary,
          significance: diff.significance,
          snapshot: body
        });
        await sendChangeEmail({
          to: row.contact_email,
          url: row.url,
          summary: diff.summary,
          significance: diff.significance
        });
        results.push({ url: row.url, changed: true });
      } else {
        results.push({ url: row.url, changed: false });
      }
    } catch (err) {
      results.push({ url: row.url, changed: false, error: (err as Error).message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
