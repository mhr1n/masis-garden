import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdmmnaygesayufugenzv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbW1uYXlnZXNheXVmdWdlbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTgwMDMsImV4cCI6MjEwMjUzNDAwM30.oITHKCJDFTaw2B_AC6SQUftVBgi1Qrpina0wZO0tWkE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
  },
});

export const isSupabaseConfigured = () => true;
