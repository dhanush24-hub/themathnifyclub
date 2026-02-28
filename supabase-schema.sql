-- Run this in Supabase SQL Editor to create tables and storage buckets

-- Home content (single row)
CREATE TABLE IF NOT EXISTS home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_headline TEXT,
  hero_subheadline TEXT,
  overview_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO home_content (hero_headline, hero_subheadline, overview_text) 
VALUES ('Where Logic Meets Ambition', 'THE MATHnify CLUB — Nurturing analytical excellence under CDC, NRCM', 'We empower students with structured aptitude and analytical thinking for tomorrow''s challenges.')
ON CONFLICT DO NOTHING;

-- About content
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO about_content (content) VALUES (
  'Under the visionary leadership of Dr. G. Ramu and the guidance of our mentors, THE MATHnify CLUB fosters analytical excellence and structured aptitude mastery among aspiring professionals.'
) ON CONFLICT DO NOTHING;

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patrons & Mentors
CREATE TABLE IF NOT EXISTS patrons_mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO patrons_mentors (name, role, description, sort_order) VALUES
  ('Dr. G. Ramu', 'Dean (Professor, CSE)', NULL, 0),
  ('Ms. P. Sushma', 'Mentor', NULL, 1),
  ('Mr. Raju', 'Mentor', NULL, 2);

-- Executive board
CREATE TABLE IF NOT EXISTS executive_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO executive_board (name, role, sort_order) VALUES
  ('Rahul Kumar', 'President', 0),
  ('Neeraj Guptha', 'Vice President', 1),
  ('Sandeep Reddy', 'Club Curator', 2),
  ('Prabhakar Chaubey', 'Content Creator Head', 3),
  ('Raga Rithika', 'Event Manager Head', 4),
  ('Bhavya', 'Marketing Head', 5);

-- Departments (team head is identified by is_head in department_members)
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_head BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert departments first (no head reference)
INSERT INTO departments (name, sort_order) VALUES
  ('Marketing Team', 0),
  ('Event Management Team', 1),
  ('Technical Team', 2),
  ('Content Creator Team', 3),
  ('Treasurer Team', 4)
ON CONFLICT DO NOTHING;

-- Programs (events/workshops conducted by the club)
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  details TEXT,
  program_date DATE,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If you already created the programs table earlier, run these safely:
ALTER TABLE programs ADD COLUMN IF NOT EXISTS details TEXT;

-- Event images (3–4 images recommended per program)
CREATE TABLE IF NOT EXISTS program_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO programs (title, description, details, program_date, sort_order) VALUES
  (
    'Aptitude Bootcamp',
    'Intensive sessions on quantitative aptitude, logical reasoning, and data interpretation for placements and competitive exams.',
    'THE MATHnify CLUB conducted an Aptitude Bootcamp designed to build strong fundamentals and problem-solving speed across core aptitude areas.\n\nParticipants worked through guided practice sets, shortcut strategies, and timed drills to improve accuracy under pressure.\n\nThe program concluded with a mini mock test and a feedback session to help students plan their next steps.',
    '2025-03-15',
    0
  ),
  (
    'Guest Talk: Logic in Tech',
    'A session on how analytical thinking applies in software and data roles.',
    'This guest session focused on how logical thinking and structured reasoning help in real-world tech roles.\n\nStudents learned how to break down ambiguous problems, communicate assumptions, and approach solutions step by step.\n\nThe talk ended with an interactive Q&A and a quick problem-solving activity.',
    NULL,
    1
  ),
  (
    'Weekly Practice Sessions',
    'Regular problem-solving and mock tests to keep your skills sharp.',
    'THE MATHnify CLUB hosts weekly practice sessions to help students stay consistent and improve steadily.\n\nEach session includes curated questions, group discussion, and short timed tests.\n\nOver time, students build confidence, speed, and clarity in reasoning.',
    NULL,
    2
  )
ON CONFLICT DO NOTHING;

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact
CREATE TABLE IF NOT EXISTS contact_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT,
  email TEXT,
  phone TEXT,
  other_content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO contact_content (address, email, phone) VALUES (
  'Narsimha Reddy Engineering College, Maisammaguda, Secunderabad, Telangana',
  'mathnify@nrcm.ac.in',
  NULL
) ON CONFLICT DO NOTHING;

-- Join applications
CREATE TABLE IF NOT EXISTS join_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  phone TEXT NOT NULL,
  why_join TEXT NOT NULL,
  preferred_department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - allow public read for most, restrict writes
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrons_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_applications ENABLE ROW LEVEL SECURITY;

-- Public read for all content tables
CREATE POLICY "Public read home_content" ON home_content FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read patrons_mentors" ON patrons_mentors FOR SELECT USING (true);
CREATE POLICY "Public read executive_board" ON executive_board FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read department_members" ON department_members FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read program_images" ON program_images FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read contact_content" ON contact_content FOR SELECT USING (true);

-- Public insert only for join_applications
CREATE POLICY "Public insert join_applications" ON join_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read join_applications" ON join_applications FOR SELECT USING (true);

-- Service role or authenticated users can do everything (you'll use anon key with policies - for admin use service role or add auth)
-- For simplicity: allow all operations with anon key (restrict in production via Supabase Auth)
CREATE POLICY "Allow all home_content" ON home_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all about_content" ON about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all patrons_mentors" ON patrons_mentors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all executive_board" ON executive_board FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all department_members" ON department_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all programs" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all program_images" ON program_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all contact_content" ON contact_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all join_applications" ON join_applications FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for gallery and member photos (create in Dashboard: Storage -> New bucket 'club-assets', public)
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('club-assets', 'club-assets', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read club-assets" ON storage.objects FOR SELECT USING (bucket_id = 'club-assets');
CREATE POLICY "Allow upload club-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'club-assets');
CREATE POLICY "Allow update club-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'club-assets');
CREATE POLICY "Allow delete club-assets" ON storage.objects FOR DELETE USING (bucket_id = 'club-assets');
