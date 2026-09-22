import { 
  ApiResponse, 
  PagedResponse, 
  Profile, 
  Technology, 
  Project, 
  Blog, 
  ContactRequest, 
  ContactResponse,
  LeetCodeStats,
  LeetCodeSubmission,
  YouTubeVideo
} from '@/types';

import { mockProfile, mockTechnologies, mockProjects, mockBlogs } from '@/data/mockData';

const DEBUG = process.env.NODE_ENV !== 'production';

// Helper to check for client-side window object
const isClient = typeof window !== 'undefined';

// Helper to format and validate image URLs with fallback for relative paths and broken links
export const formatImageUrl = (
  url?: string | null, 
  fallback = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop'
): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  let trimmed = url.trim();

  // Data URLs or Blob URLs (local file upload previews)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Rewrite localhost:8080 backend uploads path to Next.js API proxy
  if (trimmed.includes('localhost:8080/uploads/')) {
    const relativePath = trimmed.split('localhost:8080')[1];
    return `/api/v1${relativePath}`;
  }

  // External HTTP/HTTPS URLs (Cloudinary, Unsplash, Imgur, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative uploads path
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
    return `/api/v1${cleanPath}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};

// Helper to get Auth token from localStorage
const getAuthHeaders = (): HeadersInit => {
  if (isClient) {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('user-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

// Generic fetch with timeout helper
async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    // Global 401 Unauthorized interceptor
    if (response.status === 401) {
      if (isClient) {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-profile');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }

    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Helper to handle and format errors from ApiResponse
async function handleErrorResponse(response: Response, defaultMessage: string): Promise<never> {
  try {
    const text = await response.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        if (json && json.message) {
          if (json.data && typeof json.data === 'object') {
            const details = Object.entries(json.data)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ');
            if (details) {
              throw new Error(`${json.message} (${details})`);
            }
          }
          throw new Error(json.message);
        }
      } catch (jsonErr: any) {
        if (jsonErr.message && !jsonErr.message.includes('token') && !jsonErr.message.includes('JSON')) {
          throw jsonErr;
        }
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        if (cleanText && cleanText.length < 150) {
          throw new Error(cleanText);
        }
      }
    }
  } catch (e: any) {
    if (e.message && !e.message.includes('token') && !e.message.includes('JSON')) {
      throw e;
    }
  }
  throw new Error(`${defaultMessage} (Status ${response.status})`);
}

export const apiService = {
  // 1. PUBLIC PROFILE APIS
  async getProfile(): Promise<Profile> {
    try {
      if (DEBUG) console.log('Fetching live profile...');
      const response = await fetchWithTimeout('/api/v1/profile');
      if (response.ok) {
        const result: ApiResponse<Profile> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn('Using fallback profile data:', e);
    }
    return mockProfile;
  },

  // 2. PUBLIC TECHNOLOGIES APIS
  async getTechnologies(): Promise<Technology[]> {
    try {
      if (DEBUG) console.log('Fetching live technologies...');
      const response = await fetchWithTimeout('/api/v1/technologies?size=100');
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Technology>> = await response.json();
        if (result.success && result.data && result.data.content && result.data.content.length > 0) {
          return result.data.content;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn('Using fallback technologies data:', e);
    }
    return mockTechnologies;
  },

  // 3. PUBLIC PROJECTS APIS
  async getProjects(featuredOnly = false): Promise<Project[]> {
    try {
      if (DEBUG) console.log(`Fetching live projects (featuredOnly: ${featuredOnly})...`);
      const url = featuredOnly ? '/api/v1/projects/featured?size=100' : '/api/v1/projects?size=100';
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Project>> = await response.json();
        if (result.success && result.data && result.data.content && result.data.content.length > 0) {
          return result.data.content;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn('Using fallback projects catalog:', e);
    }
    return featuredOnly ? mockProjects.filter(p => p.featured) : mockProjects;
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    try {
      if (DEBUG) console.log(`Fetching live project for slug: ${slug}...`);
      const response = await fetchWithTimeout(`/api/v1/projects/slug/${slug}`);
      if (response.ok) {
        const result: ApiResponse<Project> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn(`Error fetching live project for slug ${slug}:`, e);
    }
    const foundMock = mockProjects.find(p => p.slug === slug);
    if (foundMock) return foundMock;
    throw new Error(`Failed to fetch project for ${slug}`);
  },

  // 4. PUBLIC BLOGS APIS
  async getBlogs(): Promise<Blog[]> {
    try {
      if (DEBUG) console.log('Fetching live blogs...');
      const response = await fetchWithTimeout('/api/v1/blogs?size=100');
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Blog>> = await response.json();
        if (result.success && result.data && result.data.content && result.data.content.length > 0) {
          return result.data.content;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn('Using fallback blogs list:', e);
    }
    return mockBlogs;
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      if (DEBUG) console.log(`Fetching live blog for slug: ${slug}...`);
      const response = await fetchWithTimeout(`/api/v1/blogs/slug/${slug}`);
      if (response.ok) {
        const result: ApiResponse<Blog> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      if (DEBUG) console.warn(`Error fetching live blog for slug ${slug}:`, e);
    }
    const foundBlog = mockBlogs.find(b => b.slug === slug);
    if (foundBlog) return foundBlog;
    throw new Error(`Failed to fetch blog for ${slug}`);
  },

  // 5. PUBLIC VISITORS CONTACT API
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    if (DEBUG) console.log('Submitting contact message to backend...', data);
    const response = await fetchWithTimeout('/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to submit contact message');
    }
    const result: ApiResponse<ContactResponse> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to submit contact');
  },

  // =============================================================
  // 6. USER & ADMIN AUTHENTICATION APIS (Strict)
  // =============================================================
  async login(username: string, password: string): Promise<any> {
    if (DEBUG) console.log('Logging in user...', username);
    const response = await fetchWithTimeout('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Login failed');
    }
    const result = await response.json();

    let token = result.token || result.accessToken || result.jwt || '';
    let roles: string[] = result.roles || [];
    let fullName = result.fullName || '';
    let email = result.email || '';

    if (!token && result.data) {
      if (typeof result.data === 'string') {
        token = result.data;
      } else if (typeof result.data === 'object') {
        token = result.data.token || result.data.accessToken || result.data.jwt || '';
        roles = result.data.roles || (result.data.user?.role ? ["ROLE_" + result.data.user.role] : roles);
        fullName = result.data.fullName || result.data.user?.fullName || result.data.user?.username || fullName;
        email = result.data.email || result.data.user?.email || email;
      }
    }

    if (token) {
      const isAdmin = roles.includes('ROLE_ADMIN');
      if (isAdmin) {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-profile');
        localStorage.setItem('admin-token', token);
      } else {
        localStorage.removeItem('admin-token');
        localStorage.setItem('user-token', token);
        localStorage.setItem('user-profile', JSON.stringify({
          fullName: fullName || username,
          email: email || '',
          username: username
        }));
      }
      return { token, roles, fullName, email };
    }

    throw new Error(result.message || 'Tài khoản hoặc mật khẩu không chính xác.');
  },

  async loginWithGoogle(idToken: string): Promise<any> {
    if (DEBUG) console.log('Logging in user via Google...');
    const response = await fetchWithTimeout('/api/v1/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Google login failed');
    }
    const result = await response.json();

    let token = result.token || result.accessToken || result.jwt || '';
    let roles: string[] = result.roles || [];
    let fullName = result.fullName || '';
    let email = result.email || '';
    let username = result.username || '';

    if (!token && result.data) {
      if (typeof result.data === 'string') {
        token = result.data;
      } else if (typeof result.data === 'object') {
        token = result.data.token || result.data.accessToken || result.data.jwt || '';
        roles = result.data.roles || (result.data.user?.role ? ["ROLE_" + result.data.user.role] : roles);
        fullName = result.data.fullName || result.data.user?.fullName || result.data.user?.username || fullName;
        email = result.data.email || result.data.user?.email || email;
        username = result.data.user?.username || username;
      }
    }

    if (token) {
      const isAdmin = roles.includes('ROLE_ADMIN');
      if (isAdmin) {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-profile');
        localStorage.setItem('admin-token', token);
      } else {
        localStorage.removeItem('admin-token');
        localStorage.setItem('user-token', token);
        localStorage.setItem('user-profile', JSON.stringify({
          fullName: fullName || username || email.split('@')[0],
          email: email || '',
          username: username || email
        }));
      }
      return { token, roles, fullName, email };
    }
    throw new Error(result.message || 'Google login failed');
  },

  async register(data: any): Promise<any> {
    if (DEBUG) console.log('Registering user...', data.username);
    const response = await fetchWithTimeout('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Registration failed');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Registration failed');
  },

  // =============================================================
  // 6.5. GUEST USER PROFILE APIS
  // =============================================================
  async getUserProfile(): Promise<any> {
    if (DEBUG) console.log('Fetching user profile...');
    const response = await fetchWithTimeout('/api/v1/users/profile', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch user profile');
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve profile');
  },

  async updateUserProfile(data: any): Promise<any> {
    if (DEBUG) console.log('Updating user profile...');
    const response = await fetchWithTimeout('/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update user profile');
    }
    const result = await response.json();
    if (result.success && result.data) {
      localStorage.setItem('user-profile', JSON.stringify({
        fullName: result.data.fullName || result.data.username,
        email: result.data.email || '',
        username: result.data.username
      }));
      return result.data;
    }
    throw new Error(result.message || 'Failed to update profile');
  },

  // =============================================================
  // 7. STRICT ADMIN PROFILE EDIT API
  // =============================================================
  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    if (DEBUG) console.log('Updating profile info...');
    const response = await fetchWithTimeout('/api/v1/admin/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update admin profile');
    }
    const result: ApiResponse<Profile> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Profile update failed');
  },

  // =============================================================
  // 8. STRICT ADMIN SKILLS (TECHNOLOGIES) CRUD APIS
  // =============================================================
  async createTechnology(data: { name: string; iconUrl: string }): Promise<Technology> {
    if (DEBUG) console.log('Creating skill technology...');
    const response = await fetchWithTimeout('/api/v1/admin/technologies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to create technology');
    }
    const result: ApiResponse<Technology> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create skill');
  },

  async updateTechnology(id: number, data: { name: string; iconUrl: string }): Promise<Technology> {
    if (DEBUG) console.log(`Updating skill technology ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/technologies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update technology');
    }
    const result: ApiResponse<Technology> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update skill');
  },

  async deleteTechnology(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting skill technology ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/technologies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to delete technology');
    }
  },

  // =============================================================
  // 9. STRICT ADMIN PROJECTS CRUD APIS
  // =============================================================
  async getProjectsAdmin(status?: string): Promise<Project[]> {
    if (DEBUG) console.log('Fetching admin projects (Strict Admin Auth Required)...');
    const url = status ? `/api/v1/admin/projects?size=100&status=${status}` : '/api/v1/admin/projects?size=100';
    const response = await fetchWithTimeout(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch admin projects');
    }
    const result: ApiResponse<PagedResponse<Project>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve admin projects');
  },

  async createProject(data: any): Promise<Project> {
    if (DEBUG) console.log('Creating project card...');
    const response = await fetchWithTimeout('/api/v1/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to create project');
    }
    const result: ApiResponse<Project> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create project');
  },

  async updateProject(id: number, data: any): Promise<Project> {
    if (DEBUG) console.log(`Updating project card ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update project');
    }
    const result: ApiResponse<Project> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update project');
  },

  async deleteProject(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting project ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to delete project');
    }
  },

  // =============================================================
  // 10. STRICT ADMIN BLOGS CRUD APIS
  // =============================================================
  async getBlogsAdmin(): Promise<Blog[]> {
    if (DEBUG) console.log('Fetching admin blogs (Strict Admin Auth Required)...');
    const response = await fetchWithTimeout('/api/v1/admin/blogs?size=100', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch admin blogs');
    }
    const result: ApiResponse<PagedResponse<Blog>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve admin blogs');
  },

  async createBlog(data: any): Promise<Blog> {
    if (DEBUG) console.log('Creating blog post...');
    const response = await fetchWithTimeout('/api/v1/admin/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to create blog');
    }
    const result: ApiResponse<Blog> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create blog');
  },

  async updateBlog(id: number, data: any): Promise<Blog> {
    if (DEBUG) console.log(`Updating blog post ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update blog');
    }
    const result: ApiResponse<Blog> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update blog');
  },

  async deleteBlog(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting blog post ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to delete blog');
    }
  },

  // =============================================================
  // 11. STRICT ADMIN CONTACT MESSAGES INBOX APIS
  // =============================================================
  async getContactsAdmin(): Promise<ContactResponse[]> {
    if (DEBUG) console.log('Fetching admin contacts list (Strict Admin Auth Required)...');
    const response = await fetchWithTimeout('/api/v1/admin/contacts?size=100', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch contact messages');
    }
    const result: ApiResponse<PagedResponse<ContactResponse>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve contacts');
  },

  async deleteContact(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting contact message ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to delete message');
    }
  },

  // =============================================================
  // 12. FILE UPLOAD APIS
  // =============================================================
  async uploadFile(file: File): Promise<string> {
    if (DEBUG) console.log('Uploading file...', file.name);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchWithTimeout('/api/v1/admin/files/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      await handleErrorResponse(response, 'Upload failed');
    }

    const result = await response.json();
    if (result.success && result.data && result.data.fileUrl) {
      return result.data.fileUrl;
    }
    throw new Error(result.message || 'File upload failed');
  },

  // =============================================================
  // 13. LEETCODE APIS
  // =============================================================
  async getLeetCodeStats(): Promise<LeetCodeStats> {
    if (DEBUG) console.log('Fetching LeetCode stats...');
    const response = await fetchWithTimeout('/api/v1/leetcode/stats');
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch LeetCode statistics');
    }
    const result: ApiResponse<LeetCodeStats> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve LeetCode statistics');
  },

  async getLeetCodeSubmissions(limit = 20): Promise<LeetCodeSubmission[]> {
    if (DEBUG) console.log(`Fetching LeetCode submissions (limit=${limit})...`);
    const response = await fetchWithTimeout(`/api/v1/leetcode/submissions?limit=${limit}`);
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch LeetCode submissions');
    }
    const result: ApiResponse<LeetCodeSubmission[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve LeetCode submissions');
  },

  async getLeetCodeSubmissionCode(submissionId: string): Promise<string> {
    if (DEBUG) console.log(`Fetching LeetCode submission code (${submissionId})...`);
    const response = await fetchWithTimeout(`/api/v1/leetcode/submissions/${submissionId}/code`);
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch solution code');
    }
    const result: ApiResponse<string> = await response.json();
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve code');
  },

  async syncLeetCode(): Promise<LeetCodeStats> {
    if (DEBUG) console.log('Triggering LeetCode manual sync...');
    const response = await fetchWithTimeout('/api/v1/admin/leetcode/sync', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to sync LeetCode data');
    }
    const result: ApiResponse<LeetCodeStats> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to sync LeetCode stats');
  },

  // =============================================================
  // 14. YOUTUBE VIDEO APIS
  // =============================================================
  async getYouTubeVideos(category?: string): Promise<YouTubeVideo[]> {
    if (DEBUG) console.log(`Fetching YouTube videos (category: ${category || 'all'})...`);
    const url = category && category !== 'ALL' 
      ? `/api/v1/youtube/videos?category=${encodeURIComponent(category)}` 
      : '/api/v1/youtube/videos';
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch YouTube videos');
    }
    const result: ApiResponse<YouTubeVideo[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve YouTube videos');
  },

  async getYouTubeVideosAdmin(): Promise<YouTubeVideo[]> {
    if (DEBUG) console.log('Fetching YouTube videos for Admin...');
    const response = await fetchWithTimeout('/api/v1/admin/youtube/videos', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to fetch YouTube videos for admin');
    }
    const result: ApiResponse<YouTubeVideo[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve YouTube videos');
  },

  async createYouTubeVideo(data: {
    title: string;
    youtubeUrl: string;
    description?: string;
    category?: string;
    duration?: string;
    displayOrder?: number;
    featured?: boolean;
    active?: boolean;
  }): Promise<YouTubeVideo> {
    if (DEBUG) console.log('Creating YouTube video...');
    const response = await fetchWithTimeout('/api/v1/admin/youtube/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to create YouTube video');
    }
    const result: ApiResponse<YouTubeVideo> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create YouTube video');
  },

  async updateYouTubeVideo(id: number, data: Partial<YouTubeVideo>): Promise<YouTubeVideo> {
    if (DEBUG) console.log(`Updating YouTube video ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/youtube/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to update YouTube video');
    }
    const result: ApiResponse<YouTubeVideo> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update YouTube video');
  },

  async deleteYouTubeVideo(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting YouTube video ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/youtube/videos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      await handleErrorResponse(response, 'Failed to delete YouTube video');
    }
  }
};

export const api = apiService;


