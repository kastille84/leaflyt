const { createClient } = require("@supabase/supabase-js");
const { keysBasedOnEnv } = require("./server/utility/generalUtils");

const supabaseUrl = keysBasedOnEnv().supabase.url;
const supabaseKey = keysBasedOnEnv().supabase.apiKey;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.supabaseUrl = supabaseUrl;
exports.supabaseKey = supabaseKey;
exports.supabase = supabase;
