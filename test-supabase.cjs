const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wdmmnaygesayufugenzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbW1uYXlnZXNheXVmdWdlbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTgwMDMsImV4cCI6MjEwMjUzNDAwM30.oITHKCJDFTaw2B_AC6SQUftVBgi1Qrpina0wZO0tWkE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.log('Supabase check status:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('NOTICE: Tables need to be created in Supabase SQL editor using supabase_schema.sql!');
    }
  } else {
    console.log('SUCCESS! Connected to Supabase products table. Existing rows:', data.length);
  }
}

testConnection();
