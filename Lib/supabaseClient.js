import { createClient } from '@supabase/supabase-js'

// Vite exposes only variables prefixed with VITE_ to browser code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail early if the local .env file is missing required Supabase values.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

const sessionStorageAdapter = {
  getItem: (key) => {
    try {
      return window.sessionStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      window.sessionStorage.setItem(key, value)
    } catch {
      // Ignore storage errors and let auth continue with in-memory state.
    }
  },
  removeItem: (key) => {
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Ignore storage errors.
    }
  },
}

// Shared Supabase browser client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: sessionStorageAdapter,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
