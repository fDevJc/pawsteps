'use server'

import { getGeminiResponse } from '@/app/lib/gemini';
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from './server'
import { Database } from '@/types/supabase'

type ActivityType = Database['public']['Enums']['activity_type']

export async function addActivity(
  type: ActivityType,
  note: string | null = null,
) {
  const supabase = await getSupabaseServerClient()

  // 1. Get the current user's session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // 2. Fetch the user's family_id from the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData || !profileData.family_id) {
    console.error('Error fetching user profile or family_id:', profileError)
    throw new Error('Could not retrieve user family information. Make sure user has a profile and family_id.')
  }

  const familyId = profileData.family_id

  // 3. Insert into activities with user.id, type, note, and fetched family_id
  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      type,
      note,
      family_id: familyId,
    })
    .select()

  if (error) {
    console.error('Error adding activity:', error)
    throw error
  }

  revalidatePath('/') // Revalidate the home page to show the new activity
  return data
}

export async function getActivities() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return [] // No user, no activities
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData || !profileData.family_id) {
    console.error('Error fetching user profile or family_id for getActivities:', profileError)
    return [] // Could not retrieve user family information
  }

  const familyId = profileData.family_id

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching activities:', error)
    return [] // Return empty array on error
  }

  return data
}

export async function updateActivity(
  activityId: string,
  type: ActivityType,
  note: string | null = null,
) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // Fetch the user's family_id
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData || !profileData.family_id) {
    console.error('Error fetching user profile or family_id for updateActivity:', profileError)
    throw new Error('Could not retrieve user family information.')
  }
  const familyId = profileData.family_id

  // Ensure the activity belongs to the user's family before updating
  const { data: existingActivity, error: fetchError } = await supabase
    .from('activities')
    .select('id, family_id')
    .eq('id', activityId)
    .eq('family_id', familyId) // Ensure it belongs to the family
    .single()

  if (fetchError || !existingActivity) {
    console.error('Error fetching activity for update or activity not found in family:', fetchError)
    throw new Error('Activity not found or unauthorized to update.')
  }

  const { data, error } = await supabase
    .from('activities')
    .update({
      type,
      note,
    })
    .eq('id', activityId)
    .select()

  if (error) {
    console.error('Error updating activity:', error)
    throw error
  }

  revalidatePath('/')
  return data
}

export async function deleteActivity(activityId: string) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // Fetch the user's family_id
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData || !profileData.family_id) {
    console.error('Error fetching user profile or family_id for deleteActivity:', profileError)
    throw new Error('Could not retrieve user family information.')
  }
  const familyId = profileData.family_id

  // Ensure the activity belongs to the user's family before deleting
  const { data: existingActivity, error: fetchError } = await supabase
    .from('activities')
    .select('id, family_id')
    .eq('id', activityId)
    .eq('family_id', familyId) // Ensure it belongs to the family
    .single()

  if (fetchError || !existingActivity) {
    console.error('Error fetching activity for delete or activity not found in family:', fetchError)
    throw new Error('Activity not found or unauthorized to delete.')
  }

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId)

  if (error) {
    console.error('Error deleting activity:', error)
    throw error
  }

  revalidatePath('/')
  return { success: true }
}

export async function createFamilyAndAssignToUser(familyName: string) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // 1. Create a new family
  const { data: familyData, error: familyError } = await supabase
    .from('families')
    .insert({ name: familyName })
    .select('id')
    .single()

  if (familyError || !familyData) {
    console.error('Error creating family:', familyError)
    throw new Error('Failed to create a new family.')
  }

  const newFamilyId = familyData.id

  // 2. Assign the new family_id to the user's profile
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({ family_id: newFamilyId })
    .eq('id', user.id)

  if (profileUpdateError) {
    console.error('Error assigning family to user profile:', profileUpdateError)
    // Optionally, delete the created family if profile update fails
    await supabase.from('families').delete().eq('id', newFamilyId)
    throw new Error('Failed to assign family to user.')
  }

  revalidatePath('/') // Revalidate paths that depend on user's family
  return { familyId: newFamilyId, familyName }
}

export async function handleCreateFamily(formData: FormData) {
  'use server'
  const familyName = formData.get('familyName') as string
  if (familyName) {
    await createFamilyAndAssignToUser(familyName)
  }
}

export async function handleAddActivityMeal() {
  'use server'
  await addActivity('meal')
}

export async function handleAddActivityPoop() {
  'use server'
  await addActivity('poop')
}

export async function handleAddActivityWalk() {
  'use server'
  await addActivity('walk')
}

export async function handleAddActivityMedicine() {
  'use server'
  await addActivity('medicine')
}

export async function getAIHealthBriefing(): Promise<string> {
  'use server'
  const activities = await getActivities(); // Re-use the existing getActivities function

  if (activities.length === 0) {
    return "아직 기록된 활동이 없어 건강 브리핑을 생성할 수 없습니다.";
  }

  // Group activities by type and count them
  const activitySummary: { [key: string]: number } = {};
  activities.forEach(activity => {
    activitySummary[activity.type] = (activitySummary[activity.type] || 0) + 1;
  });

  // Construct a prompt for Gemini
  let prompt = "반려동물의 최근 활동 기록이 다음과 같습니다: ";
  Object.entries(activitySummary).forEach(([type, count]) => {
    prompt += `${type} ${count}회, `;
  });
  prompt = prompt.slice(0, -2) + ". 이 정보를 바탕으로 반려동물의 오늘 건강 상태를 한 줄로 요약해 주세요. 친근하고 긍정적인 말투로 작성해주세요.";

  try {
    const aiResponse = await getGeminiResponse(prompt);
    return aiResponse;
  } catch (error) {
    console.error('Error calling Gemini API for health briefing:', error);
    return "AI 건강 브리핑을 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
}
