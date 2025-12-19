import Link from 'next/link';

const features = [
  {
    title: 'Magic-link sign-in',
    copy: 'Invite teammates and customers without passwords or friction.'
  },
  {
    title: 'Daily smart crawls',
    copy: 'SignalDrop fetches every URL once per day and detects meaningful changes.'
  },
  {
    title: 'Actionable email alerts',
    copy: 'Summaries explain what changed and why it matters, so you never miss a signal.'
  }
];

export default function MarketingPage() {
  return (
    <main className="stack">
      <header className="stack" style={{ gap: '1.5rem' }}>
        <div className="stack" style={{ gap: '0.5rem' }}>
          <p className="text-sm font-semibold text-slate-600">SignalDrop</p>
          <h1 style={{ fontSize: '2.7rem', margin: 0 }}>Email alerts when the web shifts.</h1>
          <p className="text-lg text-slate-700" style={{ maxWidth: '650px' }}>
            Monitor critical URLs, summarize meaningful changes, and alert your team in a single
            email. No dashboards, no noise—just the signal.
          </p>
        </div>
        <div className="stack" style={{ gap: '0.75rem', flexDirection: 'row' }}>
          <Link className="btn btn-primary" href="/dashboard">
            Launch SignalDrop
          </Link>
          <a className="btn btn-secondary" href="https://forms.gle/YiZXBzDemo" target="_blank" rel="noreferrer">
            Talk to sales
          </a>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600" style={{ marginBottom: '0.75rem' }}>
            What makes SignalDrop different?
          </p>
          <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {features.map((feature) => (
              <div key={feature.title} className="stack">
                <h3 style={{ margin: 0 }}>{feature.title}</h3>
                <p className="text-slate-700" style={{ margin: 0 }}>{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </header>
      <section className="card stack">
        <h2 style={{ margin: 0 }}>How it works</h2>
        <ol className="text-slate-700" style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>Add URLs you care about and set your sending domain in Resend.</li>
          <li>SignalDrop crawls them daily via a Vercel cron job.</li>
          <li>When content changes, we summarize the diff, explain the impact, and send one email.</li>
        </ol>
        <p className="text-slate-700" style={{ margin: 0 }}>
          Pricing is simple: $99/month, unlimited monitored URLs per team. Cancel anytime.
        </p>
      </section>
    </main>
  );
}
