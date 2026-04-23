import { createClient } from '@/lib/supabase/server'
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from '@/types'
import { initials, avatarColor } from '@/lib/utils'
import { ShieldCheck } from 'lucide-react'
import MentorRequestButton from '@/components/mentors/MentorRequestButton'

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: Promise<{ spec?: string }>
}) {
  const params  = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: myProfile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  let query = supabase
    .from('profiles')
    .select('*')
    .in('role', ['professional', 'admin'])
    .order('is_verified', { ascending: false })

  if (params.spec && params.spec !== 'all') {
    query = query.contains('specializations', [params.spec])
  }

  const { data: mentors } = await query.limit(40)

  const SPECS: { value: string; label: string }[] = [
    { value: 'all', label: 'All' },
    ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Mentors</h1>
        <p className="text-sm text-gray-500 mt-0.5">Only name, title and country are shown</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {SPECS.map(s => (
          <a key={s.value}
            href={`/dashboard/mentors${s.value !== 'all' ? `?spec=${s.value}` : ''}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (params.spec ?? 'all') === s.value
                ? 'bg-brand-400 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {s.label}
          </a>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {mentors?.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">No mentors found for this filter.</div>
        )}
        {mentors?.map(mentor => {
          const av = avatarColor(mentor.name)
          return (
            <div key={mentor.id} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${av}`}>
                  {initials(mentor.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900">{mentor.name}</span>
                    {mentor.is_verified && (
                      <ShieldCheck className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{mentor.title}</p>
                  <p className="text-xs text-gray-400">{mentor.country}</p>
                </div>
              </div>

              {mentor.specializations?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(mentor.specializations as Category[]).map(s => (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[s]}`}>
                      {CATEGORY_LABELS[s]}
                    </span>
                  ))}
                </div>
              )}

              {mentor.bio && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{mentor.bio}</p>
              )}

              {mentor.years_experience && (
                <p className="text-xs text-gray-400">{mentor.years_experience} years experience</p>
              )}

              {myProfile && myProfile.id !== mentor.id && (
                <MentorRequestButton mentorId={mentor.id} mentorName={mentor.name} fromProfile={myProfile} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
