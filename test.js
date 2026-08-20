import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addPolicy() {
  // Wait, anon key cannot execute raw SQL usually. But maybe I can use the supabase sql function?
  console.log("Cannot run raw SQL from client if we don't have service role key.");
}
