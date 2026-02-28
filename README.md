# THE MATHnify CLUB — Official Website

Official multi-page website for **THE MATHnify CLUB**, the student-led wing under the Career Development Center (CDC) of Narsimha Reddy Engineering College (NRCM), Maisammaguda, Secunderabad, Telangana.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**
- **Tailwind CSS**
- **GSAP** (scroll-triggered animations)
- **Supabase** (database, storage, auth)

## Features

- Multi-page structure: Home, About, Programs, Patrons & Mentors, Club Leads, Departments, Gallery, Contact, Join
- Scroll-triggered section reveals and hero animations
- Admin CMS at `/admin` (login at `/admin-login`) — not linked in public nav
- Dynamic content from Supabase; gallery and member photos in Supabase Storage
- Join form submissions stored in Supabase
- Responsive layout and glassmorphism-style UI

## Setup

1. **Clone and install**
   ```bash
   cd mathnify-club-website
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your [Supabase](https://supabase.com) project
   - Optional: `ADMIN_SESSION_SECRET` for a stronger admin session (default is used if unset)

3. **Database**
   - In Supabase: SQL Editor → run `supabase-schema.sql` to create tables and RLS policies
   - In Supabase: Storage → create bucket `club-assets` (public) for gallery and member photos

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin

- **URL:** `/admin-login` (not linked from the main site)
- **Username:** `themathnifyclub@admin1234`
- **Password:** `MATHnify@1234`

From the admin dashboard you can edit home/about/contact content, patrons & mentors, executive board, departments & members, gallery images, announcements, and view/delete join applications.

## Deploy on Vercel

1. Push the repo to GitHub (or connect another Git provider).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Set **Environment Variables** in the project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional) `ADMIN_SESSION_SECRET`
4. Deploy. Vercel will use the existing `package.json` and Next.js config.

## Club Logo

Place your club logo at `public/logo.png` to show it in the navbar. If the file is missing, the letter “M” is shown as fallback.

## License

Private / institutional use for THE MATHnify CLUB and NRCM CDC.
