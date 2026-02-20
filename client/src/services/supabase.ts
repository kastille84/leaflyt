import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { keysBasedOnEnv } from "../utils/GeneralUtils";

export const supabaseUrl = keysBasedOnEnv().supabase.url;

const supabaseKey = keysBasedOnEnv().supabase.apiKey;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
