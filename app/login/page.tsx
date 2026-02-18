'use client'

import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/')
      }
    })
  }, [router, supabase.auth])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Sign In to PawSteps</h1>
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center h-12 px-6 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
      >
        <Image src="/google.svg" alt="Google logo" width={20} height={20} className="mr-2" /> {/* Assuming you have a google.svg in public */}
        Sign In with Google
      </button>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/">
          <span className="hover:underline">Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
