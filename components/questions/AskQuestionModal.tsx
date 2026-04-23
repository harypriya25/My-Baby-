'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_LABELS, type Category, type Profile } from '@/types'
import { PlusCircle, X } from 'lucide-react'

export default function AskQuestionModal({ profile }: { profile: Profile }) {
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const router              = useRouter()
  const supabase            = createClient()

  const [form, setForm] = useState({
    title: '', body: '', category: 'food_science' as Category, tags: '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const { error } = await supabase.from('questions').insert({
      author_id: profile.id,
      title: form.title,
      body: form.body,
      category: form.category,
      tags,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setOpen(false)
    setForm({ title: '', body: '', category: 'food_science', tags: '' })
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
        <PlusCircle className="w-4 h-4" /> Ask question
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Ask a question</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Title</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. How do I prevent fouling in a pasteuriser?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Details</label>
                <textarea required value={form.body} onChange={e => set('body', e.target.value)}
                  placeholder="Describe your question in detail — include context like equipment, temperatures, or symptoms if relevant."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
                  {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Tags <span className="text-gray-400 font-normal">(optional, comma separated)</span></label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="e.g. pasteurisation, heat exchanger, CIP"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-brand-400 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                  {loading ? 'Posting…' : 'Post question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
