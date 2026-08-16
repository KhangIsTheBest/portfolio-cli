import { Profile, Technology, Project, Blog } from '@/types';

export const mockProfile: Profile = {
  id: 1,
  fullName: "Phan Duy Khang",
  title: "Backend / Full-Stack Developer",
  aboutMe: "Software Engineering student with a strong foundation in Data Structures & Algorithms and excellent self-learning abilities. Passionate about Backend Engineering, aiming to build high-performance, scalable systems to solve complex real-world problems.",
  githubUrl: "https://github.com/KhangIsTheBest",
  linkedinUrl: "https://linkedin.com/in/phanduykhang",
  email: "pdkhang1304@gmail.com",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang",
  updatedAt: new Date().toISOString()
};

export const mockTechnologies: Technology[] = [];

export const mockProjects: Project[] = [];

export const mockBlogs: Blog[] = [];
