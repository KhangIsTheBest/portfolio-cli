export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Profile {
  id: number;
  fullName: string;
  title: string;
  aboutMe: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  avatarUrl: string;
  cvViUrl?: string;
  cvEnUrl?: string;
  leetcodeUsername?: string;
  leetcodeSession?: string;
  youtubeChannelId?: string;
  youtubeHandle?: string;
  updatedAt: string;
}

export interface Technology {
  id: number;
  name: string;
  iconUrl: string;
  createdAt?: string;
}

export interface ProjectImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content?: string;
  githubUrl?: string;
  demoUrl?: string;
  thumbnailUrl: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  contentType?: 'HTML' | 'MARKDOWN';
  createdAt: string;
  updatedAt: string;
  technologies: Technology[];
  images?: ProjectImage[];
}

export interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailUrl: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  contentType?: 'HTML' | 'MARKDOWN';
  createdAt: string;
  technologies: Technology[];
}

export interface BlogAuthor {
  id: number;
  fullName: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  thumbnailUrl?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: BlogAuthor;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// LeetCode Types
export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  contestRating?: number;
  contestGlobalRanking?: number;
  contestAttended?: number;
  submissionCalendar?: string; // JSON map timestamp -> count
  recentSubmissions: LeetCodeSubmission[];
}

export interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  code?: string;
  runtime?: string;
  memory?: string;
}

// YouTube Video Types
export interface YouTubeVideo {
  id: number;
  title: string;
  youtubeUrl: string;
  videoId: string;
  thumbnailUrl?: string;
  description?: string;
  category?: string;
  duration?: string;
  displayOrder: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

