import { 
  ApiResponse, 
  PagedResponse, 
  Profile, 
  Technology, 
  Project, 
  Blog, 
  ContactRequest, 
  ContactResponse 
} from '@/types';

const DEBUG = process.env.NODE_ENV !== 'production';

// Helper to check for client-side window object
const isClient = typeof window !== 'undefined';

// Helper to format and validate image URLs with fallback for relative paths and broken links
export const formatImageUrl = (
  url?: string | null, 
  fallback = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop'
): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
    return `/api/v1${cleanPath}`;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  return fallback;
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
    if (DEBUG) console.log('Fetching live profile...');
    const response = await fetchWithTimeout('/api/v1/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    const result: ApiResponse<Profile> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve profile data');
  },

  // 2. PUBLIC TECHNOLOGIES APIS
  async getTechnologies(): Promise<Technology[]> {
    if (DEBUG) console.log('Fetching live technologies...');
    const response = await fetchWithTimeout('/api/v1/technologies?size=100');
    if (!response.ok) throw new Error('Failed to fetch technologies');
    const result: ApiResponse<PagedResponse<Technology>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve technologies');
  },

  // 3. PUBLIC PROJECTS APIS
  async getProjects(featuredOnly = false): Promise<Project[]> {
    if (DEBUG) console.log(`Fetching live projects (featuredOnly: ${featuredOnly})...`);
    const url = featuredOnly ? '/api/v1/projects/featured?size=100' : '/api/v1/projects?size=100';
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const result: ApiResponse<PagedResponse<Project>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve projects');
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    if (DEBUG) console.log(`Fetching live project for slug: ${slug}...`);
    const response = await fetchWithTimeout(`/api/v1/projects/slug/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch project for ${slug}`);
    const result: ApiResponse<Project> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve project detail');
  },

  // 4. PUBLIC BLOGS APIS
  async getBlogs(): Promise<Blog[]> {
    if (DEBUG) console.log('Fetching live blogs...');
    const response = await fetchWithTimeout('/api/v1/blogs?size=100');
    if (!response.ok) throw new Error('Failed to fetch blogs');
    const result: ApiResponse<PagedResponse<Blog>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve blogs');
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    if (DEBUG) console.log(`Fetching live blog for slug: ${slug}...`);
    const response = await fetchWithTimeout(`/api/v1/blogs/slug/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch blog for ${slug}`);
    const result: ApiResponse<Blog> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to retrieve blog detail');
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
  }
};
