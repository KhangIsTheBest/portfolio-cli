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

export const mockTechnologies: Technology[] = [
  { id: 1, name: "Java", iconUrl: "Java" },
  { id: 2, name: "Spring Boot", iconUrl: "Spring" },
  { id: 3, name: "TypeScript", iconUrl: "TypeScript" },
  { id: 4, name: "React", iconUrl: "React" },
  { id: 5, name: "Next.js", iconUrl: "NextJS" },
  { id: 6, name: "Angular", iconUrl: "Angular" },
  { id: 7, name: "Node.js", iconUrl: "NodeJS" },
  { id: 8, name: "Express.js", iconUrl: "Express" },
  { id: 9, name: "C# / .NET", iconUrl: "CSharp" },
  { id: 10, name: "PostgreSQL", iconUrl: "PostgreSQL" },
  { id: 11, name: "MySQL", iconUrl: "MySQL" },
  { id: 12, name: "Docker", iconUrl: "Docker" },
  { id: 13, name: "Git", iconUrl: "Git" },
  { id: 14, name: "RESTful API", iconUrl: "API" }
];

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Dự án Portfolio cá nhân",
    slug: "portfolio",
    shortDescription: "Hệ thống Portfolio cá nhân tương tác cao tích hợp giao diện GUI Glassmorphism hiện đại và chế độ Terminal CLI, kết nối Spring Boot Backend.",
    content: "Xây dựng hệ thống Portfolio cá nhân tương tác cao, hỗ trợ chuyển đổi linh hoạt giữa giao diện Modern GUI Glassmorphism và giao diện CLI. Thiết kế cơ sở dữ liệu quan hệ PostgreSQL (Neon Serverless), đồng bộ hóa thực thể qua Spring Data JPA/Hibernate. Phát triển hệ thống xác thực người dùng và phân quyền truy cập sử dụng Spring Security & JWT Token, kết hợp tối ưu dọn dẹp bộ nhớ đệm phiên đăng nhập (stale session cleanup) tại client. Tích hợp tính năng gửi Email thông báo bất đồng bộ (@Async Java Mail Sender) qua SMTP Gmail. Phát triển module tải tệp tin đa phương tiện trực tiếp lên server (Native Media Upload) hỗ trợ upload nhiều ảnh cùng lúc.",
    githubUrl: "https://github.com/KhangIsTheBest/portfolio-cli",
    demoUrl: "https://portfolio.vercel.app",
    thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60",
    featured: true,
    status: "PUBLISHED",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-06-20T00:00:00Z",
    technologies: [
      { id: 3, name: "TypeScript", iconUrl: "TypeScript" },
      { id: 5, name: "Next.js", iconUrl: "NextJS" },
      { id: 2, name: "Spring Boot", iconUrl: "Spring" },
      { id: 10, name: "PostgreSQL", iconUrl: "PostgreSQL" },
      { id: 12, name: "Docker", iconUrl: "Docker" }
    ]
  },
  {
    id: 2,
    title: "LFYS – Nền tảng học lập trình trực tuyến (Khóa luận tốt nghiệp)",
    slug: "lfys-coding-platform",
    shortDescription: "Nền tảng học lập trình trực tuyến tích hợp khóa học, tài liệu, online IDE chấm code trực tiếp và hệ thống contest.",
    content: "Xây dựng nền tảng học lập trình trực tuyến tích hợp khóa học, tài liệu, online IDE và hệ thống contest. Phát triển RESTful APIs bằng ExpressJS cùng JWT Authentication và Role-based Authorization. Thiết kế hệ thống cơ sở dữ liệu với khoảng 60 bảng dữ liệu và tối ưu truy vấn bằng indexing. Tích hợp Judge0 để chấm code trực tiếp, hỗ trợ nhiều ngôn ngữ và nhiều test case. Xây dựng hệ thống contest với realtime ranking, countdown và submission history. Docker hóa frontend, backend, MySQL và AI service. Sử dụng GitHub Actions để tự động build và deploy lên Ubuntu VPS.",
    githubUrl: "https://github.com/DinosDATN/KL",
    demoUrl: "https://lfys.example.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=60",
    featured: true,
    status: "PUBLISHED",
    createdAt: "2025-08-15T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    technologies: [
      { id: 6, name: "Angular", iconUrl: "Angular" },
      { id: 7, name: "Node.js", iconUrl: "NodeJS" },
      { id: 8, name: "Express.js", iconUrl: "Express" },
      { id: 11, name: "MySQL", iconUrl: "MySQL" },
      { id: 12, name: "Docker", iconUrl: "Docker" }
    ]
  },
  {
    id: 3,
    title: "Hệ thống Quản lý & Lập lịch Tác vụ Ngầm (.NET C#)",
    slug: "net-task-scheduler",
    shortDescription: "Hệ thống xử lý tác vụ ngầm hiệu năng cao và lập lịch công việc định kỳ sử dụng C# .NET, Hangfire và TickerQ.",
    content: "Hệ thống được phát triển trong thời gian thực tập tại Tập Đoàn Đầu Tư Công Nghệ Nam Long. Giải quyết bài toán xử lý các tác vụ tốn thời gian (như gửi email hàng loạt, đồng bộ dữ liệu định kỳ, tổng hợp báo cáo) ra khỏi luồng xử lý HTTP chính của ứng dụng. Sử dụng Hangfire để quản lý lập lịch tác vụ đáng tin cậy với khả năng tự thử lại khi lỗi (automatic retry). Kết hợp thư viện TickerQ để tối ưu hàng đợi tin nhắn và phân luồng tác vụ. Giảm tải thời gian phản hồi API trung bình và tăng tính chịu tải của hệ thống.",
    githubUrl: "https://github.com/KhangIsTheBest/net-job-scheduler",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    featured: false,
    status: "PUBLISHED",
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2025-11-30T00:00:00Z",
    technologies: [
      { id: 9, name: "C# / .NET", iconUrl: "CSharp" },
      { id: 11, name: "MySQL", iconUrl: "MySQL" },
      { id: 13, name: "Git", iconUrl: "Git" }
    ]
  }
];

export const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 16 & Tailwind CSS v4",
    slug: "nextjs16-tailwind-v4",
    shortDescription: "A comprehensive developer guide on setting up a new Next.js 16 project utilizing the freshly updated Tailwind CSS v4 compiler.",
    content: "Next.js 16 brings powerful updates to the App Router and async requests, while Tailwind CSS v4 introduces a brand-new native CSS-first engine. Together, they create a blazing fast developer experience. In this post, we look at configuring custom themes directly within `@theme` syntax in `globals.css` and how to make the most of server-side data fetching.",
    featured: true,
    published: true,
    createdAt: "2026-06-05T08:00:00Z",
    updatedAt: "2026-06-10T14:30:00Z",
    createdBy: { id: 1, fullName: "Phan Duy Khang" }
  },
  {
    id: 2,
    title: "Building Resilient REST APIs with Spring Boot 3.5",
    slug: "spring-boot-3-resilience",
    shortDescription: "Deep dive into configuring global exception handlers, custom response envelopes, validation, and CORS policies in Java backends.",
    content: "Writing code that works under perfect conditions is easy. Writing code that handles database outages, validation failures, and unauthorized request attempts gracefully is what distinguishes senior engineers. In this blog post, we dissect how to build a unified response wrapper, handle bad input requests using `@Valid`, and set up secure CORS configurations for modern SPAs.",
    featured: false,
    published: true,
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-05-15T09:00:00Z",
    createdBy: { id: 1, fullName: "Phan Duy Khang" }
  }
];
