import { createClient } from '@/lib/supabase/server'
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from '@/types'
import { timeAgo, initials, avatarColor } from '@/lib/utils'
import { CheckCircle2, MessageCircle, Eye } from 'lucide-react'
import AskQuestionModal from '@/components/questions/AskQuestionModal'
import QuestionFilters from '@/components/questions/QuestionFilters'

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  let query = supabase
    .from('questions')
    .select(`*, author:profiles!questions_author_id_fkey(name, title, country)`)
    .order('created_at', { ascending: false })

  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  const { data: questions } = await query.limit(40)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Questions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Answered by verified professionals only</p>
        </div>
        {profile && <AskQuestionModal profile={profile} />}
      </div>

      <QuestionFilters currentCategory={params.category} currentSearch={params.search} />

      <div className="flex flex-col gap-3 mt-6">
        {questions?.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No questions yet. Be the first to ask!</p>
          </div>
        )}
        {questions?.map(q => {
          const author = q.author as { name: string; title: string; country: string } | null
          const av = avatarColor(author?.name ?? 'U')
          return (
            <div key={q.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
              <div className="flex gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${av}`}>
                  {initials(author?.name ?? 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-gray-900 leading-snug">{q.title}</h3>
                    {q.is_answered && (
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{q.body}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[q.category as Category]}`}>
                      {CATEGORY_LABELS[q.category as Category]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {author?.name} · {author?.country}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(q.created_at)}</span>
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageCircle className="w-3.5 h-3.5" /> {q.answer_count}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="w-3.5 h-3.5" /> {q.view_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers inline preview */}
              <AnswerPreview questionId={q.id} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

async function AnswerPreview({ questionId }: { questionId: string }) {
  const supabase = await createClient()
  const { data: answers } = await supabase
    .from('answers')
    .select(`*, author:profiles!answers_author_id_fkey(name, title, country, is_verified)`)
    .eq('question_id', questionId)
    .order('upvotes', { ascending: false })
    .limit(1)

  if (!answers || answers.length === 0) return null
  const a = answers[0]
  const author = a.author as { name: string; title: string; country: string; is_verified: boolean } | null

  return (
    <div className="mt-4 ml-13 pl-4 border-l-2 border-brand-100">
      <div className="flex items-center gap-2 mb-1">
        {author?.is_verified && (
          <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
        )}
        <span className="text-xs text-gray-500">{author?.name} · {author?.title} · {author?.country}</span>
      </div>
      <p className="text-sm text-gray-700 line-clamp-3">{a.body}</p>
    </div>
  )
}
