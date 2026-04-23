'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FlaskConical } from 'lucide-react'

const COUNTRIES = ['India','Australia','New Zealand','United Kingdom','United States','United Arab Emirates','Netherlands','Germany','France','Canada','Singapore','Malaysia','Philippines','Nigeria','Kenya','South Africa','Brazil','Other']

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '', password: '', name: '', title: '',
    country: 'India', role: 'student' as 'student' | 'professional',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, title: form.title, country: form.country, role: form.role },
      },
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard/questions')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">FoodLogic</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Only your name, title and country are shown to others</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-4">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full name</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="Your name" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Professional title</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="e.g. Food Science student, Process Engineer" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Country</label>
            <select value={form.country} onChange={e => set('country', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">I am joining as</label>
            <div className="grid grid-cols-2 gap-3">
              {(['student','professional'] as const).map(r => (
                <button type="button" key={r}
                  onClick={() => set('role', r)}
                  className={`border rounded-lg p-3 text-sm text-left transition-colors ${form.role === r ? 'border-brand-400 bg-brand-50 text-brand-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <div className="font-medium capitalize">{r}</div>
                  <div className="text-xs mt-0.5 text-gray-400">{r === 'student' ? 'Ask questions & find mentors' : 'Answer questions & mentor'}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
            <input required type="password" value={form.password} onChange={e => set('password', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="Minimum 8 characters" minLength={8} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brand-400 text-white py-2.5 rounded-lg font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 font-medium hover:text-brand-600">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
