export type MonitoredUrl = {
  id: string;
  user_id: string;
  url: string;
  last_hash: string | null;
  last_checked_at: string | null;
  last_summary: string | null;
  created_at: string;
};
