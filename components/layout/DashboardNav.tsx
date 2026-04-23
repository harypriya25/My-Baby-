'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MessageCircle, Users, User, LogOut, FlaskConical, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { initials, avatarColor } from '@/lib/utils'

const NAV = [
  { href: '/dashboard/questions', icon: MessageCircle, label: 'Questions' },
  { href: '/dashboard/mentors',   icon: Users,         label: 'Mentors'   },
  { href: '/dashboard/profile',   icon: User,          label: 'My profile'},
]

export default function DashboardNav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const name = profile?.name ?? 'Member'
  const avColor = avatarColor(name)

  const Inner = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900">FoodLogic</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-brand-50 text-brand-800 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Profile & sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${avColor}`}>
            {initials(name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{profile?.title}</p>
          </div>
        </div>
        <button onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <Inner />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-400 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">FoodLogic</span>
        </div>
        <button onClick={() => setOpen(o => !o)} className="p-2 rounded-lg hover:bg-gray-100">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-20" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <Inner />
          </aside>
        </div>
      )}

      {/* Mobile content offset */}
      <div className="lg:hidden h-14" />
    </>
  )
}
