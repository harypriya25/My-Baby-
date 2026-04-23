'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function PostAnswer({ questionId, profile }: { questionId: string; profile: Profile }) {
  const [body, setBody]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router                = useRouter()
  const supabase              = createClient()

  const canAnswer = profile.is_verified || profile.role === 'professional' || profile.role === 'admin'

  if (!canAnswer) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        Only verified professionals can post answers. If you are a professional,{' '}
        <a href="/dashboard/profile" className="underline font-medium">update your profile</a> to request verification.
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('answers').insert({
      question_id: questionId,
      author_id: profile.id,
      body: body.trim(),
    })
    if (error) { setError(error.message); setLoading(false); return }
    setBody('')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="font-medium text-gray-900 mb-3">Post your answer</h3>
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-3">{error}</div>}
      <form onSubmit={submit}>
        <textarea required value={body} onChange={e => setBody(e.target.value)} rows={5}
          placeholder="Share your professional expertise. Be specific — include examples, standards, or calculations where helpful."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none mb-3" />
        <button type="submit" disabled={loading}
          className="bg-brand-400 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
          {loading ? 'Posting…' : 'Post answer'}
        </button>
      </form>
    </div>
  )
}
