import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const supabaseClient = createServerClient( // Removed <Database> generic
    supabaseUrl as string,
    supabaseKey as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `cookies()` may not be available in a Server Component.
            // If this happens, you can ignore this error.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete(name);
          } catch (error) {
            // The `cookies()` may not be available in a Server Component.
            // If this happens, you can ignore this error.
          }
        },
      },
    }
  );

  return supabaseClient;
}
