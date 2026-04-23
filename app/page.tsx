import Link from 'next/link'
import { FlaskConical, Users, MessageCircle, ShieldCheck, Globe, ChevronRight } from 'lucide-react'

const stats = [
  { label: 'Verified mentors', value: '142+' },
  { label: 'Questions answered', value: '890+' },
  { label: 'Countries', value: '34' },
  { label: 'Community members', value: '2.1k' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified professionals only answer',
    desc: 'Every answer comes from a verified professional or senior — not generic AI. Real expertise from the food and engineering industry.',
  },
  {
    icon: Globe,
    title: 'Privacy by design',
    desc: 'Only your name, title, and country are shown. No city, no personal contact details. You control who reaches you.',
  },
  {
    icon: Users,
    title: 'Mentor matching',
    desc: 'Find a mentor in food science, dairy tech, or chemical engineering. Send a direct mentorship request and connect 1-on-1.',
  },
  {
    icon: MessageCircle,
    title: 'Three specialist areas',
    desc: 'Career guidance for students, food science & dairy technology, and engineering troubleshooting — pressure systems, heat exchangers, CIP, and more.',
  },
]

const sampleQuestions = [
  { category: 'Engineering', tag: 'bg-purple-100 text-purple-800', q: 'How do I size a pressure relief valve for a steam jacketed vessel?', answers: 3 },
  { category: 'Dairy tech', tag: 'bg-blue-100 text-blue-800', q: 'What causes fouling in plate heat exchangers during pasteurization?', answers: 5 },
  { category: 'Career', tag: 'bg-amber-100 text-amber-800', q: 'What industries hire fresh food science graduates?', answers: 7 },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">FoodLogic</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2">Sign in</Link>
            <Link href="/auth/register" className="text-sm bg-brand-400 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">Join free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-brand-50 text-brand-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          For food science, dairy tech & chemical engineering
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-5">
          From rural classrooms<br />to global food industries
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Connect with verified professionals. Ask real questions, get real answers.
          No generic AI — only human expertise from the industry.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/register" className="bg-brand-400 text-white px-7 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors flex items-center gap-2">
            Join the community <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/questions" className="border border-gray-200 text-gray-700 px-7 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Browse questions
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-semibold text-brand-400">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-center mb-12">Built for the industry, by people from it</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map(f => (
            <div key={f.title} className="flex gap-4">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample questions */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">What people are asking</h2>
          <div className="flex flex-col gap-4">
            {sampleQuestions.map(q => (
              <div key={q.q} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${q.tag} mr-2`}>{q.category}</span>
                  <p className="mt-2 text-gray-800 font-medium">{q.q}</p>
                </div>
                <div className="text-sm text-gray-400 whitespace-nowrap">{q.answers} answers</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/auth/register" className="text-brand-400 font-medium hover:text-brand-600 text-sm">
              Join to ask your question →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-3">Ready to help the next generation?</h2>
        <p className="text-gray-500 mb-8">Whether you&apos;re a student with questions or a professional with answers — there&apos;s a place for you here.</p>
        <Link href="/auth/register" className="bg-brand-400 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors">
          Create your free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-400 rounded flex items-center justify-center">
            <FlaskConical className="w-3 h-3 text-white" />
          </div>
          <span className="font-medium text-gray-600">FoodLogic</span>
        </div>
        <p>Built to connect food science & engineering communities across the world.</p>
      </footer>
    </div>
  )
}
