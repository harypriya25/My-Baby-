'use client'
import { useRouter, usePathname } from 'next/navigation'
import { CATEGORY_LABELS, type Category } from '@/types'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'

const CATS: { value: string; label: string }[] = [
  { value: 'all', label: 'All topics' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

export default function QuestionFilters({
  currentCategory,
  currentSearch,
}: {
  currentCategory?: string
  currentSearch?: string
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch ?? '')

  function navigate(cat?: string, q?: string) {
    const params = new URLSearchParams()
    if (cat && cat !== 'all') params.set('category', cat)
    if (q) params.set('search', q)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate(currentCategory, search)}
          placeholder="Search questions…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {CATS.map(c => (
          <button key={c.value}
            onClick={() => navigate(c.value, search)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (currentCategory ?? 'all') === c.value
                ? 'bg-brand-400 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
