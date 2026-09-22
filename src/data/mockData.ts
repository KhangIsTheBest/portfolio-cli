import { Profile, Technology, Project, Blog } from '@/types';

export const mockProfile: Profile = {
  id: 1,
  fullName: "Phan Duy Khang",
  title: "Backend / Software Engineer",
  aboutMe: "Software Engineering student with strong foundation in Data Structures & Algorithms, Java Spring Boot, Microservices, and Distributed Systems. Passionate about building high-performance, resilient, and scalable backend platforms.",
  githubUrl: "https://github.com/KhangIsTheBest",
  linkedinUrl: "https://linkedin.com/in/phanduykhang",
  email: "pdkhang1304@gmail.com",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang",
  cvViUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  cvEnUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  leetcodeUsername: "psmNQXkg5O",
  youtubeChannelId: "https://www.youtube.com/@dkp.13",
  youtubeHandle: "@dkp.13",
  updatedAt: new Date().toISOString()
};

export const mockTechnologies: Technology[] = [
  { id: 1, name: "Java 21", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" },
  { id: 2, name: "Spring Boot 3", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" },
  { id: 3, name: "PostgreSQL", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
  { id: 4, name: "Redis", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg" },
  { id: 5, name: "Docker", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" },
  { id: 6, name: "Next.js", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" },
  { id: 7, name: "TypeScript", iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
  { id: 8, name: "MinIO / S3", iconUrl: "https://min.io/resources/img/logo/MINIO_wordmark.svg" }
];

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Enterprise Portfolio Platform",
    slug: "portfolio-platform",
    shortDescription: "A production-grade, decoupled software engineer portfolio platform engineered with Java 21, Spring Boot 3, Redis Cache, PostgreSQL, and Next.js 16 App Router.",
    content: `## System Architecture Overview\n\nThis project represents a decoupled, production-ready developer portfolio and CMS engine built with modern backend engineering principles.\n\n### Core Engineering Highlights\n- **Micro-Layered Architecture**: Decoupled Next.js 16 SSR frontend communicating via RESTful APIs with Spring Boot 3 backend.\n- **Flyway Database Versioning**: Automated schema migration and reliable version control for PostgreSQL.\n- **Redis In-Memory Caching & Distributed Rate Limiting**: Low-latency read-through caching and token-bucket protection against DDoS.\n- **Testcontainers Testing**: Automated integration test pipeline testing against real containerized PostgreSQL and Redis instances.\n- **Dual-Auth Security**: Google OAuth2 ID Token Verification and stateless JWT RBAC security.\n\n### Tech Stack\n- Backend: Java 21, Spring Boot 3, Spring Security 6, JPA / Hibernate, Flyway, Redis, MinIO S3\n- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4\n- DevOps: Docker Compose, GitHub Actions CI/CD`,
    githubUrl: "https://github.com/KhangIsTheBest/Portfolio",
    demoUrl: "https://khang.kamy.space",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop",
    featured: true,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    technologies: mockTechnologies.slice(0, 7),
    images: []
  },
  {
    id: 2,
    title: "Distributed Booking & Reservation System",
    slug: "distributed-booking-system",
    shortDescription: "High-concurrency booking engine handling distributed locking, race conditions, and real-time seat reservation with Redis Redlock & PostgreSQL.",
    content: `## Engineering Challenges & Solutions\n\n### High Concurrency & Distributed Locking\nSolved race conditions in ticket/seat reservation by implementing **Redis Redlock distributed locking mechanism**, ensuring zero double-booking even under massive concurrent surges.\n\n### Key Features\n- Event-driven asynchronous notifications via RabbitMQ message broker.\n- Optimistic locking with version fields in PostgreSQL.\n- Comprehensive Prometheus metrics & Grafana dashboard monitoring.\n\n### Tech Stack\n- Java 21, Spring Boot 3, PostgreSQL, Redis Redlock, RabbitMQ, Docker`,
    githubUrl: "https://github.com/KhangIsTheBest",
    demoUrl: "https://khang.kamy.space",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop",
    featured: true,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    technologies: mockTechnologies.slice(0, 5),
    images: []
  },
  {
    id: 3,
    title: "Microservices Cloud E-Commerce API",
    slug: "microservices-ecommerce-api",
    shortDescription: "Scalable cloud-native e-commerce backend built with Spring Cloud, Eureka Service Discovery, Spring Cloud Gateway, and Resilience4j Circuit Breaker.",
    content: `## System Design & Microservices Architecture\n\n### Architectural Highlights\n- **API Gateway & Routing**: Spring Cloud Gateway handling centralized JWT authentication, CORS, and request rate-limiting.\n- **Fault Tolerance**: Resilience4j Circuit Breakers, Bulkhead, and Retry patterns for high availability.\n- **Data Management**: Database-per-service pattern with Saga pattern for distributed transactions.\n\n### Tech Stack\n- Spring Boot 3, Spring Cloud Gateway, Eureka, Resilience4j, Kafka, PostgreSQL`,
    githubUrl: "https://github.com/KhangIsTheBest",
    demoUrl: "https://khang.kamy.space",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop",
    featured: false,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    technologies: [mockTechnologies[0], mockTechnologies[1], mockTechnologies[2], mockTechnologies[4]],
    images: []
  }
];

export const mockBlogs: Blog[] = [];
