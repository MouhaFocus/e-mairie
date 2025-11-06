'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { RequestStatus } from '@/lib/supabase/types'

export async function createRequest(data: {
  type_of_act: 'birth' | 'marriage' | 'death'
  person_fullname: string
  father_name?: string
  mother_name?: string
  date_of_birth?: string
  place_of_birth?: string
  number_of_copies: number
  purpose?: string
  attachments?: any[]
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: request, error } = await (supabase
    .from('requests') as any)
    .insert({
      citizen_id: user.id,
      ...data,
      attachments: data.attachments || [],
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app')
  return { success: true, data: request }
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  comment?: string
) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is agent or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
    return { error: 'Unauthorized' }
  }

  // Update request status
  const { error } = await (supabase
    .from('requests') as any)
    .update({ status })
    .eq('id', requestId)

  if (error) {
    return { error: error.message }
  }

  // Add comment to events if provided
  if (comment) {
    await (supabase.from('request_events') as any).insert({
      request_id: requestId,
      actor_id: user.id,
      new_status: status,
      comment,
    })
  }

  revalidatePath('/admin/requests')
  revalidatePath(`/admin/requests/${requestId}`)
  return { success: true }
}

export async function assignRequest(requestId: string, agentId: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase
    .from('requests') as any)
    .update({ assigned_to: agentId })
    .eq('id', requestId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/requests')
  revalidatePath(`/admin/requests/${requestId}`)
  return { success: true }
}

export async function addRequestNote(requestId: string, notes: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase
    .from('requests') as any)
    .update({ notes })
    .eq('id', requestId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/requests/${requestId}`)
  return { success: true }
}

