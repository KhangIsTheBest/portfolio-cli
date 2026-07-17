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
        window.location.href = '/login';
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
      const json = JSON.parse(text);
      if (json && json.message) {
        if (json.data && typeof json.data === 'object') {
          // If there are validation details in data, append them
          const details = Object.entries(json.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          if (details) {
            throw new Error(`${json.message} (${details})`);
          }
        }
        throw new Error(json.message);
      }
    }
  } catch (e: any) {
    if (e.message && !e.message.includes('Unexpected token') && !e.message.includes('JSON')) {
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
    if (!response.ok) throw new Error('Failed to fetch live profile');
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
    if (!response.ok) throw new Error('Failed to fetch live technologies');
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
    if (!response.ok) throw new Error('Failed to fetch live projects');
    const result: ApiResponse<PagedResponse<Project>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve projects');
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    if (DEBUG) console.log(`Fetching live project for slug: ${slug}...`);
    const response = await fetchWithTimeout(`/api/v1/projects/slug/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch project details for ${slug}`);
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
    if (!response.ok) throw new Error('Failed to fetch live blogs');
    const result: ApiResponse<PagedResponse<Blog>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve blogs');
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    if (DEBUG) console.log(`Fetching live blog for slug: ${slug}...`);
    const response = await fetchWithTimeout(`/api/v1/blogs/slug/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch blog details for ${slug}`);
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
  // 6. USER & ADMIN AUTHENTICATION APIS
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
    console.log('Login API raw result:', result);

    let token = '';
    let roles: string[] = [];
    let fullName = '';
    let email = '';

    if (result) {
      // 1. Check root level fields
      token = result.token || result.accessToken || result.jwt || result.jwtToken || '';
      roles = result.roles || [];
      fullName = result.fullName || '';
      email = result.email || '';

      // 2. Check inside data envelope if present
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
    throw new Error(result.message || 'Login failed');
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
    if (DEBUG) console.log('Google Login API result:', result);

    let token = '';
    let roles: string[] = [];
    let fullName = '';
    let email = '';
    let username = '';

    if (result) {
      token = result.token || result.accessToken || result.jwt || '';
      roles = result.roles || [];
      fullName = result.fullName || '';
      email = result.email || '';

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
      // Sync local storage profile cache
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
  // 7. ADMIN PROFILE EDIT API
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
    if (!response.ok) throw new Error('Failed to update profile');
    const result: ApiResponse<Profile> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Profile update failed');
  },

  // =============================================================
  // 8. ADMIN SKILLS (TECHNOLOGIES) CRUD APIS
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
      let details = '';
      try {
        details = await response.text();
      } catch (e) {
        details = 'Cannot read error body';
      }
      throw new Error(`Failed to create technology: Status ${response.status} (${response.statusText}). Details: ${details}`);
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
      let details = '';
      try {
        details = await response.text();
      } catch (e) {
        details = 'Cannot read error body';
      }
      throw new Error(`Failed to update technology: Status ${response.status} (${response.statusText}). Details: ${details}`);
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
    if (!response.ok) throw new Error('Failed to delete technology');
  },

  // =============================================================
  // 9. ADMIN PROJECTS CRUD APIS
  // =============================================================
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
    if (!response.ok) throw new Error('Failed to create project');
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
    if (!response.ok) throw new Error('Failed to update project');
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
    if (!response.ok) throw new Error('Failed to delete project');
  },

  // =============================================================
  // 10. ADMIN BLOGS CRUD APIS
  // =============================================================
  async getBlogsAdmin(): Promise<Blog[]> {
    if (DEBUG) console.log('Fetching admin blogs (including drafts)...');
    const response = await fetchWithTimeout('/api/v1/admin/blogs?size=100', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      let details = '';
      try {
        details = await response.text();
      } catch (e) {
        details = 'Cannot read error body';
      }
      throw new Error(`Failed to fetch admin blogs: Status ${response.status} (${response.statusText}). Details: ${details}`);
    }
    const result: ApiResponse<PagedResponse<Blog>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to fetch admin blogs');
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
    if (!response.ok) throw new Error('Failed to create blog');
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
    if (!response.ok) throw new Error('Failed to update blog');
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
    if (!response.ok) throw new Error('Failed to delete blog');
  },

  // =============================================================
  // 11. ADMIN CONTACT MESSAGES INBOX APIS
  // =============================================================
  async getContactsAdmin(): Promise<ContactResponse[]> {
    if (DEBUG) console.log('Fetching admin contacts list...');
    const response = await fetchWithTimeout('/api/v1/admin/contacts?size=100', {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch contact messages');
    const result: ApiResponse<PagedResponse<ContactResponse>> = await response.json();
    if (result.success && result.data && result.data.content) {
      return result.data.content;
    }
    throw new Error(result.message || 'Failed to retrieve messages');
  },

  async deleteContact(id: number): Promise<void> {
    if (DEBUG) console.log(`Deleting contact message ${id}...`);
    const response = await fetchWithTimeout(`/api/v1/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete message');
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
      let details = '';
      try {
        details = await response.text();
      } catch (e) {
        details = 'Cannot read error body';
      }
      throw new Error(`Upload failed: Status ${response.status} (${response.statusText}). Details: ${details}`);
    }

    const result = await response.json();
    if (result.success && result.data && result.data.fileUrl) {
      return result.data.fileUrl;
    }
    throw new Error(result.message || 'File upload failed');
  }
};
