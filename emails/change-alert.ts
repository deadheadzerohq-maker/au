export const changeAlertTemplate = (
  params: {
    url: string;
    summary: string;
    significance: string;
    userEmail: string;
  }
) => {
  return `
  <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <p style="color:#64748b; font-size:12px; margin:0 0 12px 0;">SignalDrop alert</p>
    <h2 style="margin:0 0 8px 0;">Change detected at ${params.url}</h2>
    <p style="margin:0 0 16px 0; color:#0f172a;">${params.summary}</p>
    <div style="padding:12px; background:#0f172a; color:#e2e8f0; border-radius:12px;">
      <strong>Why it matters:</strong>
      <p style="margin:8px 0 0 0; color:#e2e8f0;">${params.significance}</p>
    </div>
    <p style="margin:20px 0 0 0; color:#475569; font-size:13px;">
      Sent to ${params.userEmail}. Manage URLs in your SignalDrop dashboard.
    </p>
  </div>`;
};
