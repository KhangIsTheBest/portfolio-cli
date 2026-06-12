import { ApiResponse, PagedResponse, Profile, Technology, Project, Blog, ContactRequest, ContactResponse } from '@/types';
import { mockProfile, mockTechnologies, mockProjects, mockBlogs } from '@/data/mockData';

// Helper to determine if we should output debug logs
const DEBUG = process.env.NODE_ENV !== 'production';

async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const apiService = {
  async getProfile(): Promise<Profile> {
    try {
      if (DEBUG) console.log('Fetching live profile...');
      const response = await fetchWithTimeout('/api/v1/profile');
      if (!response.ok) throw new Error('Failed to fetch live profile');
      const result: ApiResponse<Profile> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to retrieve profile data');
    } catch (error) {
      console.warn('Profile API failed, using fallback data.', error);
      return mockProfile;
    }
  },

  async getTechnologies(): Promise<Technology[]> {
    try {
      if (DEBUG) console.log('Fetching live technologies...');
      const response = await fetchWithTimeout('/api/v1/technologies');
      if (!response.ok) throw new Error('Failed to fetch live technologies');
      const result: ApiResponse<PagedResponse<Technology>> = await response.json();
      if (result.success && result.data && result.data.content) {
        return result.data.content;
      }
      throw new Error(result.message || 'Failed to retrieve technologies');
    } catch (error) {
      console.warn('Technologies API failed, using fallback data.', error);
      return mockTechnologies;
    }
  },

  async getProjects(featuredOnly = false): Promise<Project[]> {
    try {
      if (DEBUG) console.log(`Fetching live projects (featuredOnly: ${featuredOnly})...`);
      const url = featuredOnly ? '/api/v1/projects/featured' : '/api/v1/projects';
      const response = await fetchWithTimeout(url);
      if (!response.ok) throw new Error('Failed to fetch live projects');
      const result: ApiResponse<PagedResponse<Project>> = await response.json();
      if (result.success && result.data && result.data.content) {
        return result.data.content;
      }
      throw new Error(result.message || 'Failed to retrieve projects');
    } catch (error) {
      console.warn('Projects API failed, using fallback data.', error);
      return featuredOnly ? mockProjects.filter(p => p.featured) : mockProjects;
    }
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    try {
      if (DEBUG) console.log(`Fetching live project for slug: ${slug}...`);
      const response = await fetchWithTimeout(`/api/v1/projects/slug/${slug}`);
      if (!response.ok) throw new Error(`Failed to fetch project details for ${slug}`);
      const result: ApiResponse<Project> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to retrieve project detail');
    } catch (error) {
      console.warn(`Project Details API failed for ${slug}, using fallback data.`, error);
      const found = mockProjects.find(p => p.slug === slug);
      if (found) return found;
      throw new Error(`Project with slug '${slug}' not found`);
    }
  },

  async getBlogs(): Promise<Blog[]> {
    try {
      if (DEBUG) console.log('Fetching live blogs...');
      const response = await fetchWithTimeout('/api/v1/blogs');
      if (!response.ok) throw new Error('Failed to fetch live blogs');
      const result: ApiResponse<PagedResponse<Blog>> = await response.json();
      if (result.success && result.data && result.data.content) {
        return result.data.content;
      }
      throw new Error(result.message || 'Failed to retrieve blogs');
    } catch (error) {
      console.warn('Blogs API failed, using fallback data.', error);
      return mockBlogs;
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      if (DEBUG) console.log(`Fetching live blog for slug: ${slug}...`);
      const response = await fetchWithTimeout(`/api/v1/blogs/slug/${slug}`);
      if (!response.ok) throw new Error(`Failed to fetch blog details for ${slug}`);
      const result: ApiResponse<Blog> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to retrieve blog detail');
    } catch (error) {
      console.warn(`Blog Details API failed for ${slug}, using fallback data.`, error);
      const found = mockBlogs.find(b => b.slug === slug);
      if (found) return found;
      throw new Error(`Blog with slug '${slug}' not found`);
    }
  },

  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    try {
      if (DEBUG) console.log('Submitting contact message to backend...', data);
      const response = await fetchWithTimeout('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit contact message');
      const result: ApiResponse<ContactResponse> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to submit contact');
    } catch (error) {
      console.warn('Contact API failed, using mock local submission.', error);
      // Mock successful response locally
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: new Date().toISOString()
      };
    }
  }
};
