'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { Send, X } from 'lucide-react'

export default function MentorRequestButton({
  mentorId, mentorName, fromProfile,
}: { mentorId: string; mentorName: string; fromProfile: Profile }) {
  const [open, setOpen]     = useState(false)
  const [msg, setMsg]       = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')
  const supabase            = createClient()

  async function send() {
    if (!msg.trim()) return
    setLoading(true)
    const { error } = await supabase.from('mentor_requests').insert({
      from_user_id: fromProfile.id,
      to_mentor_id: mentorId,
      message: msg.trim(),
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="text-sm text-brand-600 bg-brand-50 px-3 py-2 rounded-lg">
      Request sent! {mentorName} will be notified.
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-brand-400 text-brand-600 py-2 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors">
        <Send className="w-3.5 h-3.5" /> Request mentorship
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Message to {mentorName}</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-3">Briefly introduce yourself and what you&apos;re hoping to learn.</p>
            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-3">{error}</div>}
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4}
              placeholder={`Hi ${mentorName}, I'm a food science student from India interested in dairy processing…`}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none mb-3" />
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={send} disabled={loading || !msg.trim()}
                className="flex-1 bg-brand-400 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                {loading ? 'Sending…' : 'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
