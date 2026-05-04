# FoodLogic 🧪

A mentorship platform for food science, dairy technology, and chemical engineering professionals and students.

- **Verified professionals only** answer questions — no generic AI responses
- **Privacy first** — only name, title, and country are shown
- **Three specialist areas** — food science/dairy, engineering troubleshooting, career guidance

---

## Tech stack

| Layer    | Technology                   |
|----------|------------------------------|
| Frontend | Next.js 15 (App Router)      |
| Styling  | Tailwind CSS                 |
| Database | Supabase (Postgres + Auth)   |
| Hosting  | Vercel (free tier)           |

---

## Setup guide (step by step)

### Step 1 — Get the code on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click **+** → **New repository**, name it `foodlogic`, set it to **Public**, click **Create repository**
3. Upload all these project files (or use Git CLI):

```bash
cd foodlogic
git init
git add .
git commit -m "Initial FoodLogic app"
git remote add origin https://github.com/YOUR_USERNAME/foodlogic.git
git push -u origin main
```

---

### Step 2 — Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up with GitHub
2. Click **New project**, give it the name `foodlogic`, choose a region close to your users (e.g. Singapore for India), set a database password, click **Create**
3. Wait ~2 minutes for the project to be ready
4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ`)

---

### Step 3 — Run the database schema

1. In your Supabase project, go to **SQL Editor** → **New query**
2. Open the file `lib/schema.sql` from this project
3. Paste the entire contents into the SQL editor
4. Click **Run** — you should see "Success" for each statement
5. Go to **Table Editor** — you should see tables: `profiles`, `questions`, `answers`, `mentor_requests`, `answer_upvotes`

---

### Step 4 — Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Click **Add New → Project**
3. Find your `foodlogic` repository and click **Import**
4. Under **Environment Variables**, add these two:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |

5. Click **Deploy** — Vercel will build and give you a URL like `foodlogic.vercel.app`

---

### Step 5 — Configure Supabase Auth redirect

1. Go back to your Supabase project → **Authentication → URL Configuration**
2. Under **Site URL**, enter your Vercel URL: `https://foodlogic.vercel.app`
3. Under **Redirect URLs**, add: `https://foodlogic.vercel.app/api/auth/callback`
4. Click **Save**

---

### Step 6 — Your first admin account

1. Go to your live site and register an account
2. In Supabase **Table Editor → profiles**, find your row
3. Set `role` to `admin` and `is_verified` to `true`
4. You now have full access and can verify other professionals

---

## Verifying professionals

When a professional registers, an admin needs to:
1. Go to Supabase **Table Editor → profiles**
2. Find the user, set `is_verified = true`
3. They can now answer questions

> Future improvement: build an admin panel inside the app for this.

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.local.example .env.local
# Edit .env.local and add your Supabase URL and anon key

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000
```

---

## Project structure

```
foodlogic/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx          # Sign in
│   │   └── register/page.tsx       # Sign up
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + auth guard
│   │   ├── questions/page.tsx      # Q&A feed
│   │   ├── mentors/page.tsx        # Mentor directory
│   │   └── profile/page.tsx        # Edit profile
│   └── api/auth/callback/route.ts  # Supabase auth callback
├── components/
│   ├── layout/DashboardNav.tsx     # Sidebar navigation
│   ├── questions/
│   │   ├── AskQuestionModal.tsx    # Post a question
│   │   ├── PostAnswer.tsx          # Post an answer (professionals)
│   │   └── QuestionFilters.tsx     # Filter/search
│   ├── mentors/
│   │   └── MentorRequestButton.tsx # Send mentorship request
│   └── ProfileForm.tsx             # Edit profile form
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── schema.sql                  # Database schema — run once in Supabase
│   └── utils.ts                    # Helpers (timeAgo, initials, etc.)
├── types/index.ts                  # TypeScript types
└── middleware.ts                   # Auth route protection
```

---

## Roadmap / next features

- [ ] Email notifications when a question gets answered
- [ ] Admin panel for verifying professionals inside the app
- [ ] Question detail page with full answer thread
- [ ] Upvoting answers
- [ ] Accepted answer marking by question author
- [ ] Search across answers
- [ ] Mentor request inbox / messaging

---

Built with the mission of helping students from rural backgrounds discover careers in food science and engineering.

