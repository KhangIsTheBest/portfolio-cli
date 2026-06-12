import { Profile, Technology, Project, Blog } from '@/types';

export const mockProfile: Profile = {
  id: 1,
  fullName: "Đào Thế Khang",
  title: "Full-Stack Software Engineer & Solutions Architect",
  aboutMe: "I am a passionate software developer specializing in building scalable web applications. With expertise in Java/Spring Boot for robust backends and React/Next.js for modern, responsive frontends, I strive to write clean, maintainable code that solves real-world problems.",
  githubUrl: "https://github.com/khangdt",
  linkedinUrl: "https://linkedin.com/in/khangdt",
  email: "khang.dt@example.com",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=khangdt",
  updatedAt: new Date().toISOString()
};

export const mockTechnologies: Technology[] = [
  { id: 1, name: "Java", iconUrl: "Java" },
  { id: 2, name: "Spring Boot", iconUrl: "Spring" },
  { id: 3, name: "TypeScript", iconUrl: "TypeScript" },
  { id: 4, name: "React", iconUrl: "React" },
  { id: 5, name: "Next.js", iconUrl: "NextJS" },
  { id: 6, name: "Tailwind CSS", iconUrl: "Tailwind" },
  { id: 7, name: "PostgreSQL", iconUrl: "PostgreSQL" },
  { id: 8, name: "Docker", iconUrl: "Docker" },
  { id: 9, name: "Git", iconUrl: "Git" },
  { id: 10, name: "RESTful API", iconUrl: "API" }
];

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Portfolio CLI (Interactive Terminal & Dashboard)",
    slug: "portfolio-cli",
    shortDescription: "A dual-mode developer portfolio featuring a fully-interactive retro terminal CLI and a premium modern dashboard GUI, connected to a Spring Boot backend.",
    content: "This project provides a unique interactive experience. Terminal mode allows power users to navigate my portfolio using familiar command-line interfaces. Dashboard mode provides a visual, glassmorphism-styled dashboard summarizing projects, skills, and contact options. Built with Next.js 15, Tailwind CSS v4, and integrated with a custom Spring Boot API backend.",
    githubUrl: "https://github.com/khangdt/portfolio-cli",
    demoUrl: "https://portfolio-cli.example.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60",
    featured: true,
    status: "PUBLISHED",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-13T00:00:00Z",
    technologies: [
      { id: 3, name: "TypeScript", iconUrl: "TypeScript" },
      { id: 5, name: "Next.js", iconUrl: "NextJS" },
      { id: 6, name: "Tailwind CSS", iconUrl: "Tailwind" },
      { id: 2, name: "Spring Boot", iconUrl: "Spring" }
    ]
  },
  {
    id: 2,
    title: "E-Commerce Microservices Platform",
    slug: "ecommerce-microservices",
    shortDescription: "A distributed e-commerce architecture utilizing Spring Boot, Spring Cloud, PostgreSQL, and RabbitMQ.",
    content: "A scalable, production-ready microservices system. Features a Gateway service, Auth service (JWT), Product catalog service, Order service, and Notification service. Uses RabbitMQ for asynchronous message processing (event-driven architecture) and Eureka for service discovery. Configured with Prometheus and Grafana for system health and request tracing.",
    githubUrl: "https://github.com/khangdt/ecommerce-microservices",
    thumbnailUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=60",
    featured: true,
    status: "PUBLISHED",
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-05-20T00:00:00Z",
    technologies: [
      { id: 1, name: "Java", iconUrl: "Java" },
      { id: 2, name: "Spring Boot", iconUrl: "Spring" },
      { id: 7, name: "PostgreSQL", iconUrl: "PostgreSQL" },
      { id: 8, name: "Docker", iconUrl: "Docker" }
    ]
  },
  {
    id: 3,
    title: "Real-time Collaborative Task Manager",
    slug: "realtime-task-manager",
    shortDescription: "A real-time Kanban board workspace using WebSocket, React, and Redis Pub/Sub.",
    content: "This project provides real-time workspace collaboration for teams. Users can join workspaces, move task cards, assign team members, and chat, with all changes instantly reflected on other connected screens. Powered by WebSockets and backed by Redis to manage active sessions and scale WebSocket pub/sub across multiple instances.",
    githubUrl: "https://github.com/khangdt/realtime-tasks",
    demoUrl: "https://collab-tasks.example.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    featured: false,
    status: "PUBLISHED",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
    technologies: [
      { id: 3, name: "TypeScript", iconUrl: "TypeScript" },
      { id: 4, name: "React", iconUrl: "React" },
      { id: 10, name: "RESTful API", iconUrl: "API" }
    ]
  }
];

export const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 15 & Tailwind CSS v4",
    slug: "nextjs15-tailwind-v4",
    shortDescription: "A comprehensive developer guide on setting up a new Next.js 15 project utilizing the freshly updated Tailwind CSS v4 compiler.",
    content: "Next.js 15 brings powerful updates to the App Router and async requests, while Tailwind CSS v4 introduces a brand-new native CSS-first engine. Together, they create a blazing fast developer experience. In this post, we look at configuring custom themes directly within `@theme` syntax in `globals.css` and how to make the most of server-side data fetching.",
    featured: true,
    published: true,
    createdAt: "2026-06-05T08:00:00Z",
    updatedAt: "2026-06-10T14:30:00Z",
    createdBy: { id: 1, fullName: "Đào Thế Khang" }
  },
  {
    id: 2,
    title: "Building Resilient REST APIs with Spring Boot 3",
    slug: "spring-boot-3-resilience",
    shortDescription: "Deep dive into configuring global exception handlers, custom response envelopes, validation, and CORS policies in Java backends.",
    content: "Writing code that works under perfect conditions is easy. Writing code that handles database outages, validation failures, and unauthorized request attempts gracefully is what distinguishes senior engineers. In this blog post, we dissect how to build a unified response wrapper, handle bad input requests using `@Valid`, and set up secure CORS configurations for modern SPAs.",
    featured: false,
    published: true,
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-05-15T09:00:00Z",
    createdBy: { id: 1, fullName: "Đào Thế Khang" }
  }
];
