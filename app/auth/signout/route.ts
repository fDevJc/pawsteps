import { getSupabaseServerClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = await getSupabaseServerClient()

  // Clear the user's session
  console.log('--- Attempting to sign out ---');
  await supabase.auth.signOut()
  console.log('--- Sign out attempted ---');

  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 302,
  })
}
