import crypto from 'crypto';

type DiffResult = {
  hash: string;
  summary: string;
  significance: string;
};

const CODEx_API_URL = process.env.CODEX_API_URL || 'https://api.openai.com/v1/chat/completions';
const CODEX_MODEL = process.env.CODEX_MODEL || 'gpt-4o-mini';

export async function detectMeaningfulChange(previous: string | null, current: string): Promise<DiffResult> {
  const hash = crypto.createHash('sha256').update(current).digest('hex');

  if (previous === null) {
    return {
      hash,
      summary: 'Initial capture. Baseline content stored for future comparisons.',
      significance: 'Newly monitored URL — no alert sent.'
    };
  }

  if (crypto.createHash('sha256').update(previous).digest('hex') === hash) {
    return {
      hash,
      summary: 'No meaningful change detected.',
      significance: 'Content hash matched previous version.'
    };
  }

  const body = {
    model: CODEX_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are SignalDrop, an analyst that spots meaningful web updates. Compare the previous and current content, highlight only material changes (pricing, messaging, product updates, new sections), and keep it under 120 words.'
      },
      {
        role: 'user',
        content: `Previous:\n${previous}\n\nCurrent:\n${current}`
      }
    ],
    temperature: 0.2,
    max_tokens: 240
  };

  const resp = await fetch(CODEx_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CODEX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const fallback = previous.slice(0, 500);
    return {
      hash,
      summary: `Content changed but summarization failed: ${resp.status}. Previous snapshot (truncated): ${fallback}`,
      significance: 'Alert generated with degraded summary.'
    };
  }

  const data = await resp.json();
  const summary: string = data.choices?.[0]?.message?.content ?? 'Content changed; summary unavailable.';

  return {
    hash,
    summary,
    significance: 'Material update detected and summarized.'
  };
}
