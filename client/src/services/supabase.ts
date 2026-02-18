import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { keysBasedOnEnv } from "../utils/GeneralUtils";

export const supabaseUrl = keysBasedOnEnv().supabase.url;
console.log("supabaseUrl - client", supabaseUrl);
console.log("keysBasedOnEnv() - client", keysBasedOnEnv());
const supabaseKey = keysBasedOnEnv().supabase.apiKey;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
