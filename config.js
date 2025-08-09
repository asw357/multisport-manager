export const SUPABASE_URL = 'https://yqbejgnhmizkeuxxpbbb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmVqZ25obWl6a2V1eHhwYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Nzg2NDksImV4cCI6MjA3MDE1NDY0OX0.L_v6XgPh7F6KrWKlu72f6jbL_QTU-hdMQa0lA-QFryM';
export const getClient = async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};
