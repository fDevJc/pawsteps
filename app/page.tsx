import { getSupabaseServerClient } from '@/app/lib/supabase/server'
import { getActivities, handleCreateFamily, handleAddActivityMeal, handleAddActivityPoop, handleAddActivityWalk, handleAddActivityMedicine } from '@/app/lib/supabase/server-actions'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { cache } from 'react' // Import cache
import ActivityTimeline from '@/app/components/ActivityTimeline' // Import ActivityTimeline
import AIBriefing from '@/app/components/AIBriefing' // Import AIBriefing

type ActivityType = Database['public']['Enums']['activity_type']

const createCachedSupabaseClient = cache(getSupabaseServerClient) // Wrap the client creation with cache

export default async function Home() {
  const supabase = await createCachedSupabaseClient() // Use the cached client


  const { data: { user } } = await supabase.auth.getUser()
  let userFamilyId: string | null = null
  let activities: Database['public']['Tables']['activities']['Row'][] = []
  // aiBriefing 변수 및 호출 로직 제거

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    } else {
      userFamilyId = profile?.family_id
      if (userFamilyId) {
        activities = await getActivities()
      }
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to PawSteps!</h1>
        <p className="text-lg text-center mb-6">Please sign in to manage your pet&apos;s activities.</p>
        <a
          href="/login" // We'll create this login page later, for now it can be a dummy
          className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700"
        >
          Sign In with Google
        </a>
      </div>
    )
  }

  if (!userFamilyId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <h1 className="text-2xl font-bold mb-4">Create Your Family</h1>
        <p className="text-lg text-center mb-6">You need to create a family to start tracking activities.</p>
        <form action={handleCreateFamily} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="text"
            name="familyName"
            placeholder="Family Name"
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="submit"
            className="flex h-12 items-center justify-center rounded-full bg-green-600 px-6 text-white transition-colors hover:bg-green-700"
          >
            Create Family
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black text-black dark:text-white p-4">
      <header className="w-full max-w-lg text-center py-4 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-3xl font-bold">🐾 PawSteps 🐾</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Hello, {user.email}! Your Family ID: {userFamilyId}
        </p>
      </header>

      <main className="w-full max-w-lg flex flex-col gap-6 py-6">
        {/* Top: AI Briefing Area - Phase 4 */}
        {userFamilyId && <AIBriefing familyId={userFamilyId} />}

        {/* Central: Quick Log Buttons */}
        <section className="grid grid-cols-2 gap-4">
          <form action={handleAddActivityMeal}>
            <button className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md w-full h-24">
              <Image src="/file.svg" alt="Meal" width={32} height={32} className="dark:invert mb-2" />
              <span className="font-semibold">식사</span>
            </button>
          </form>
          <form action={handleAddActivityPoop}>
            <button className="flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow-md w-full h-24">
              <Image src="/file.svg" alt="Poop" width={32} height={32} className="dark:invert mb-2" />
              <span className="font-semibold">배변</span>
            </button>
          </form>
          <form action={handleAddActivityWalk}>
            <button className="flex flex-col items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg shadow-md w-full h-24">
              <Image src="/file.svg" alt="Walk" width={32} height={32} className="dark:invert mb-2" />
              <span className="font-semibold">산책</span>
            </button>
          </form>
          <form action={handleAddActivityMedicine}>
            <button className="flex flex-col items-center justify-center bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg shadow-md w-full h-24">
              <Image src="/file.svg" alt="Medicine" width={32} height={32} className="dark:invert mb-2" />
              <span className="font-semibold">투약</span>
            </button>
          </form>
        </section>

        {userFamilyId && <ActivityTimeline initialActivities={activities} familyId={userFamilyId} />}
      </main>

      <footer className="w-full max-w-lg text-center py-4 mt-6 border-t border-gray-200 dark:border-zinc-700">
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-red-500 hover:text-red-700 text-sm">
            Sign out
          </button>
        </form>
      </footer>
    </div>
  )
}
