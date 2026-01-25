import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { keysBasedOnEnv } from "../utils/GeneralUtils";

export const supabaseUrl = keysBasedOnEnv().supabase.url;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
