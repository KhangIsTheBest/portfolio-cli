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
  createdAt: string;
  updatedAt: string;
  technologies: Technology[];
  images?: ProjectImage[];
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
