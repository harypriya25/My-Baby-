export type UserRole = 'student' | 'professional' | 'admin'

export type Category = 'food_science' | 'dairy_tech' | 'engineering' | 'career'

export interface Profile {
  id: string
  name: string
  title: string
  country: string
  role: UserRole
  bio: string | null
  specializations: Category[]
  is_verified: boolean
  years_experience: number | null
  created_at: string
}

export interface Question {
  id: string
  author_id: string
  title: string
  body: string
  category: Category
  tags: string[]
  is_answered: boolean
  answer_count: number
  view_count: number
  created_at: string
  author?: Pick<Profile, 'name' | 'title' | 'country'>
}

export interface Answer {
  id: string
  question_id: string
  author_id: string
  body: string
  upvotes: number
  is_accepted: boolean
  created_at: string
  author?: Pick<Profile, 'name' | 'title' | 'country' | 'is_verified'>
}

export interface MentorRequest {
  id: string
  from_user_id: string
  to_mentor_id: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  food_science: 'Food science',
  dairy_tech: 'Dairy technology',
  engineering: 'Engineering',
  career: 'Career guidance',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  food_science: 'bg-teal-100 text-teal-800',
  dairy_tech: 'bg-blue-100 text-blue-800',
  engineering: 'bg-purple-100 text-purple-800',
  career: 'bg-amber-100 text-amber-800',
}
