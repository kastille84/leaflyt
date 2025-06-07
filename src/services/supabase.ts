import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
