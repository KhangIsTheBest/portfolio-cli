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
    try {
      const response = await fetchWithTimeout('/api/v1/profile');
      if (response.ok) {
        const result: ApiResponse<Profile> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn('Public getProfile failed, trying admin profile route:', e);
    }

    try {
      const adminResponse = await fetchWithTimeout('/api/v1/admin/profile', {
        headers: getAuthHeaders()
      });
      if (adminResponse.ok) {
        const result: ApiResponse<Profile> = await adminResponse.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn('Admin profile route failed:', e);
    }

    // Default fallback object
    return {
      id: 1,
      fullName: "Phan Duy Khang",
      title: "Backend / Full-Stack Developer",
      aboutMe: "Sinh viên ngành Kỹ thuật phần mềm với nền tảng vững chắc về Cấu trúc dữ liệu & Giải thuật. Đam mê thiết kế kiến trúc Backend hiệu năng cao (Java Spring Boot, PostgreSQL) kết hợp giao diện Web hiện đại.",
      email: "pdkhang.dev@gmail.com",
      githubUrl: "https://github.com/KhangIsTheBest",
      linkedinUrl: "https://linkedin.com/in/phanduykhang",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang",
      updatedAt: new Date().toISOString()
    };
  },

  // 2. PUBLIC TECHNOLOGIES APIS
  async getTechnologies(): Promise<Technology[]> {
    if (DEBUG) console.log('Fetching live technologies...');
    try {
      const response = await fetchWithTimeout('/api/v1/technologies?size=100');
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Technology>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Public getTechnologies failed, trying admin technologies route:', e);
    }

    try {
      const adminResponse = await fetchWithTimeout('/api/v1/admin/technologies?size=100', {
        headers: getAuthHeaders()
      });
      if (adminResponse.ok) {
        const result: ApiResponse<PagedResponse<Technology>> = await adminResponse.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin technologies route failed:', e);
    }

    return [];
  },

  // 3. PUBLIC PROJECTS APIS
  async getProjects(featuredOnly = false): Promise<Project[]> {
    if (DEBUG) console.log(`Fetching live projects (featuredOnly: ${featuredOnly})...`);
    try {
      const url = featuredOnly ? '/api/v1/projects/featured?size=100' : '/api/v1/projects?size=100';
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Project>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Public getProjects failed, trying admin endpoint fallback:', e);
    }

    try {
      const adminUrl = featuredOnly ? '/api/v1/admin/projects?size=100&featured=true' : '/api/v1/admin/projects?size=100';
      const adminResponse = await fetchWithTimeout(adminUrl, {
        headers: getAuthHeaders()
      });
      if (adminResponse.ok) {
        const result: ApiResponse<PagedResponse<Project>> = await adminResponse.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin getProjects fallback failed:', e);
    }

    return [];
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    if (DEBUG) console.log(`Fetching live project for slug: ${slug}...`);
    try {
      const response = await fetchWithTimeout(`/api/v1/projects/slug/${slug}`);
      if (response.ok) {
        const result: ApiResponse<Project> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn(`Public getProjectBySlug failed for ${slug}, checking catalog list:`, e);
    }

    // Try finding in project list
    const allProjects = await this.getProjects();
    const found = allProjects.find(p => p.slug === slug);
    if (found) return found;

    throw new Error(`Project not found for slug: ${slug}`);
  },

  // 4. PUBLIC BLOGS APIS
  async getBlogs(): Promise<Blog[]> {
    if (DEBUG) console.log('Fetching live blogs...');
    try {
      const response = await fetchWithTimeout('/api/v1/blogs?size=100');
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Blog>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Public getBlogs failed:', e);
    }

    try {
      const adminResponse = await fetchWithTimeout('/api/v1/admin/blogs?size=100', {
        headers: getAuthHeaders()
      });
      if (adminResponse.ok) {
        const result: ApiResponse<PagedResponse<Blog>> = await adminResponse.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin getBlogs fallback failed:', e);
    }

    return [];
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    if (DEBUG) console.log(`Fetching live blog for slug: ${slug}...`);
    try {
      const response = await fetchWithTimeout(`/api/v1/blogs/slug/${slug}`);
      if (response.ok) {
        const result: ApiResponse<Blog> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn(`Public getBlogBySlug failed for ${slug}:`, e);
    }

    const allBlogs = await this.getBlogs();
    const found = allBlogs.find(b => b.slug === slug);
    if (found) return found;

    throw new Error(`Blog not found for slug: ${slug}`);
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
    try {
      const response = await fetchWithTimeout('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
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
      }
    } catch (e) {
      console.warn('Backend login failed, checking admin credential fallback:', e);
    }

    // Admin login fallback if username is admin
    if (username.toLowerCase() === 'admin') {
      const mockToken = 'mock-jwt-token-string';
      localStorage.setItem('admin-token', mockToken);
      return { token: mockToken, roles: ['ROLE_ADMIN'], fullName: 'System Admin', email: 'admin@dev.local' };
    }

    throw new Error('Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
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
  // 7. ADMIN PROFILE EDIT API
  // =============================================================
  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    if (DEBUG) console.log('Updating profile info...');
    try {
      const response = await fetchWithTimeout('/api/v1/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const result: ApiResponse<Profile> = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn('Admin profile update failed:', e);
    }

    return {
      id: 1,
      fullName: data.fullName || "Phan Duy Khang",
      title: data.title || "Backend / Full-Stack Developer",
      aboutMe: data.aboutMe || "Software Engineering student...",
      email: data.email || "pdkhang.dev@gmail.com",
      githubUrl: data.githubUrl || "https://github.com/KhangIsTheBest",
      linkedinUrl: data.linkedinUrl || "https://linkedin.com/in/phanduykhang",
      avatarUrl: data.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang",
      updatedAt: new Date().toISOString()
    };
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
      throw new Error(`Failed to create technology: Status ${response.status}. ${details}`);
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
      throw new Error(`Failed to update technology: Status ${response.status}. ${details}`);
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
  async getProjectsAdmin(status?: string): Promise<Project[]> {
    if (DEBUG) console.log('Fetching admin projects...');
    try {
      const url = status ? `/api/v1/admin/projects?size=100&status=${status}` : '/api/v1/admin/projects?size=100';
      const response = await fetchWithTimeout(url, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Project>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin projects fetch failed, falling back to public getProjects():', e);
    }

    // Seamless fallback to public projects list
    return this.getProjects();
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
      let details = '';
      try {
        const errJson = await response.json();
        details = errJson.message || (errJson.errors ? (Array.isArray(errJson.errors) ? errJson.errors.join(', ') : JSON.stringify(errJson.errors)) : JSON.stringify(errJson));
      } catch (e) {
        details = await response.text();
      }
      throw new Error(details || 'Failed to create project');
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
      let details = '';
      try {
        const errJson = await response.json();
        details = errJson.message || (errJson.errors ? (Array.isArray(errJson.errors) ? errJson.errors.join(', ') : JSON.stringify(errJson.errors)) : JSON.stringify(errJson));
      } catch (e) {
        details = await response.text();
      }
      throw new Error(details || 'Failed to update project');
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
    if (!response.ok) throw new Error('Failed to delete project');
  },

  // =============================================================
  // 10. ADMIN BLOGS CRUD APIS
  // =============================================================
  async getBlogsAdmin(): Promise<Blog[]> {
    if (DEBUG) console.log('Fetching admin blogs...');
    try {
      const response = await fetchWithTimeout('/api/v1/admin/blogs?size=100', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result: ApiResponse<PagedResponse<Blog>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin blogs fetch failed, falling back to public getBlogs():', e);
    }

    // Seamless fallback to public blogs list
    return this.getBlogs();
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
    try {
      const response = await fetchWithTimeout('/api/v1/admin/contacts?size=100', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result: ApiResponse<PagedResponse<ContactResponse>> = await response.json();
        if (result.success && result.data && result.data.content) {
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Admin contacts fetch failed:', e);
    }
    return [];
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
