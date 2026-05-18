import { createClient } from '@supabase/supabase-js'

// Vite exposes only variables prefixed with VITE_ to browser code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail early if the local .env file is missing required Supabase values.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

// Shared Supabase browser client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
