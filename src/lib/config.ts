import { z } from 'zod';

// Environment variable validation schema
const envSchema = z.object({
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),

  // Email (optional for development)
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Next.js
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

// Parse and validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Environment variable validation failed:', (error as any).errors);
  throw new Error('Invalid environment configuration. Please check your .env file.');
}

// Export validated environment variables
export const config = {
  auth: {
    jwtSecret: env.JWT_SECRET,
  },
  email: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  app: {
    env: env.NODE_ENV,
    url: env.NEXT_PUBLIC_APP_URL,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
  },
} as const;

// Type exports
export type Config = typeof config;
export type AppConfig = typeof config.app;
export type AuthConfig = typeof config.auth;
export type EmailConfig = typeof config.email;