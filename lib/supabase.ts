
import { createClient } from '@supabase/supabase-js';

// Пряме використання наданих користувачем ключів для гарантованої роботи
const supabaseUrl = process.env.SUPABASE_URL || 'https://dnqkuemqegmhhhfdyoia.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucWt1ZW1xZWdtaGhoZmR5b2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzg4MTMsImV4cCI6MjA4NDkxNDgxM30.gfPvDxy6OB-aQyWRr6GKj0t_RL0qs5KbhnAY8Bsu-wc';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
