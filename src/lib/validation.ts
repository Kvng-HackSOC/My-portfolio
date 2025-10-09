import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters').max(300, 'Short description must be less than 300 characters'),
  long_description: z.string().min(50, 'Long description must be at least 50 characters').max(5000, 'Long description must be less than 5000 characters'),
  readme_content: z.string().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  live_url: z.string().url('Invalid live URL').optional().or(z.literal('')),
  video_url: z.string().url('Invalid video URL').optional().or(z.literal('')),
  thumbnail_url: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  is_featured: z.boolean().default(false),
});

// Filter validation
export const filterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  search: z.string().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type FilterInput = z.infer<typeof filterSchema>;