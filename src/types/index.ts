export interface BlogPost {
  id: string;
  title: string;
  titleTurkish?: string;
  excerpt: string;
  excerptTurkish?: string;
  date: string;
  dateISO: string;
  slug: string;
  thumbnail?: string;
  isTurkish: boolean;
  category?: string;
  author?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  order: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Event {
  id: string;
  title: string;
  posterImage: string;
  category: string;
  status: "upcoming" | "recent";
  date?: string;
  location?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail?: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
