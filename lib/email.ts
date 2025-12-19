import { Resend } from 'resend';
import { changeAlertTemplate } from '../emails/change-alert';

const resendKey = process.env.RESEND_API_KEY;
const defaultFrom = process.env.RESEND_FROM_EMAIL || 'alerts@signaldrop.app';

export const resendClient = resendKey ? new Resend(resendKey) : null;

export async function sendChangeEmail(params: {
  to: string;
  url: string;
  summary: string;
  significance: string;
}) {
  if (!resendClient) {
    throw new Error('Resend client not configured');
  }

  const html = changeAlertTemplate({
    url: params.url,
    summary: params.summary,
    significance: params.significance,
    userEmail: params.to
  });

  await resendClient.emails.send({
    from: defaultFrom,
    to: params.to,
    subject: `SignalDrop: change detected at ${params.url}`,
    html
  });
}
