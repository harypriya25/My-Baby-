import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: requests } = await supabase
    .from('mentor_requests')
    .select(`*, from_user:profiles!mentor_requests_from_user_id_fkey(name, title, country)`)
    .eq('to_mentor_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My profile</h1>
      <ProfileForm profile={profile} />

      {requests && requests.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending mentorship requests</h2>
          <div className="flex flex-col gap-3">
            {requests.map((r: any) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="font-medium text-sm text-gray-900">{r.from_user?.name} · {r.from_user?.title} · {r.from_user?.country}</div>
                <p className="text-sm text-gray-600 mt-1">{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
