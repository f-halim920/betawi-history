import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fwotzwjjcbfnhvipyuhd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn("⚠️ VITE_SUPABASE_ANON_KEY is missing. Supabase won't work correctly.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "");
