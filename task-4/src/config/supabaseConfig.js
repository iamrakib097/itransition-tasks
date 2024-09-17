import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Use the service role key here

const supabase = createClient(supabaseUrl, supabaseRole);

export default supabase;
