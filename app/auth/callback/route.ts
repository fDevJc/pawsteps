import { getSupabaseServerClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // --- Start Debugging Logs ---
  console.log('--- Auth Callback Debug ---');
  console.log('Full request URL:', request.url);
  console.log('Request Origin:', requestUrl.origin);
  console.log('Code parameter:', code);
  console.log('--- End Debugging Logs ---');

  if (code) {
    const cookieStore = cookies()
    const supabase = await getSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
