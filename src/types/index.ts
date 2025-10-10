export interface Project {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    readme_content: string;
    technologies: string[];
    github_url: string;
    live_url: string;
    video_url: string;
    thumbnail_url: string;
    category: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface ProjectImage {
    id: number;
    project_id: number;
    image_url: string;
    caption: string;
  }
  
  export interface User {
    id: number;
    email: string;
    password?: string;
    created_at: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface FilterOptions {
    category?: string;
    technology?: string;
    search?: string;
  }

  export interface MediaItem {
    id?: number;
    url: string;
    publicId: string;
    format: string;
    resourceType: 'image' | 'video' | 'raw';
    bytes: number;
    width?: number;
    height?: number;
    createdAt?: Date;
  }