import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SignalDrop | Alerts when the web shifts',
  description: 'Monitor URLs, summarize meaningful changes, and alert your team via email.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-10 font-sans">{children}</div>
      </body>
    </html>
  );
}
