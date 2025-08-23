import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Handig voor Console-debug: window.supabase
// (voor productie is dit niet per se nodig, maar helpt nu even)
if (typeof window !== "undefined") {
  window.supabase = supabase;
}
