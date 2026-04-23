'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_LABELS, type Category, type Profile } from '@/types'
import { initials, avatarColor } from '@/lib/utils'
import { ShieldCheck } from 'lucide-react'

const COUNTRIES = ['India','Australia','New Zealand','United Kingdom','United States','United Arab Emirates','Netherlands','Germany','France','Canada','Singapore','Malaysia','Philippines','Nigeria','Kenya','South Africa','Brazil','Other']

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    name: profile?.name ?? '',
    title: profile?.title ?? '',
    country: profile?.country ?? 'India',
    role: profile?.role ?? 'student',
    bio: profile?.bio ?? '',
    years_experience: profile?.years_experience?.toString() ?? '',
    specializations: profile?.specializations ?? [] as Category[],
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function toggleSpec(cat: Category) {
    setForm(f => ({
      ...f,
      specializations: f.specializations.includes(cat)
        ? f.specializations.filter(s => s !== cat)
        : [...f.specializations, cat],
    }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.from('profiles').update({
      name: form.name,
      title: form.title,
      country: form.country,
      role: form.role,
      bio: form.bio || null,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      specializations: form.specializations,
    }).eq('id', profile!.id)

    if (error) { setError(error.message); setLoading(false); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
    setLoading(false)
  }

  const av = avatarColor(form.name || 'U')

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-medium ${av}`}>
          {initials(form.name || 'U')}
        </div>
        <div>
          <p className="font-medium text-gray-900">{form.name || 'Your name'}</p>
          <p className="text-sm text-gray-500">{form.title || 'Your title'} · {form.country}</p>
          {profile?.is_verified
            ? <span className="inline-flex items-center gap-1 text-xs text-brand-600 mt-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified professional</span>
            : <span className="text-xs text-gray-400 mt-1">Not yet verified</span>
          }
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}
      {saved && <div className="bg-brand-50 text-brand-700 text-sm p-3 rounded-lg mb-4">Profile saved!</div>}

      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full name</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Title</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Country</label>
            <select value={form.country} onChange={e => set('country', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
              <option value="student">Student</option>
              <option value="professional">Professional / Mentor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3}
            placeholder="Tell the community about your background and what you can help with…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Years of experience <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="number" min="0" max="50" value={form.years_experience} onChange={e => set('years_experience', e.target.value)}
            className="w-32 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([cat, label]) => (
              <button type="button" key={cat} onClick={() => toggleSpec(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.specializations.includes(cat)
                    ? 'bg-brand-400 text-white border-brand-400'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="self-start bg-brand-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50 mt-2">
          {loading ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
