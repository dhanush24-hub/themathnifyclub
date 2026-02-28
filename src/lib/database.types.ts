export interface Announcement {
  id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
}

export interface AboutContent {
  id: string;
  content: string;
  updated_at: string;
}

export interface PatronMentor {
  id: string;
  name: string;
  role: string;
  description: string | null;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  team_head_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface DepartmentMember {
  id: string;
  department_id: string;
  name: string;
  is_head: boolean;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export interface ContactContent {
  id: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  other_content: string | null;
  updated_at: string;
}

export interface JoinApplication {
  id: string;
  full_name: string;
  roll_number: string;
  department: string;
  year: string;
  phone: string;
  why_join: string;
  preferred_department: string;
  created_at: string;
}

export interface HomeContent {
  id: string;
  hero_headline: string | null;
  hero_subheadline: string | null;
  overview_text: string | null;
  updated_at: string;
}
