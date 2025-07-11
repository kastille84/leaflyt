const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.supabaseUrl = supabaseUrl;
exports.supabaseKey = supabaseKey;
exports.supabase = supabase;
