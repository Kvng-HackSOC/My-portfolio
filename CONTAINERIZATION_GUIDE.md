# Containerization Guide for Portfolio

## 🚀 Quick Start

### Build and Run with Docker
```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run

# Or do both at once
npm run docker:up
```

### Build and Run with Docker Compose (Recommended)
```bash
# Build and start all services
npm run docker:up

# Run in background (production)
npm run docker:prod

# Stop all services
npm run docker:down
```

## 📁 Project Structure

```
portfolio-ezekiel/
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Multi-service setup
├── .dockerignore          # Files to exclude from build
├── package.json           # Updated with Docker scripts
└── src/                   # Your application code
```

## 🐳 Dockerfile Explained

```dockerfile
# Use Node.js 18 Alpine (small, secure)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Start the app
CMD ["npm", "start"]
```

## 🔧 Docker Commands

### Development
```bash
# Start development with hot reload
npm run dev

# Start with Docker (for testing containerization)
npm run docker:up
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy with Docker
npm run docker:prod
```

## 🌐 Environment Variables

Create a `.env` file in your project root:

```env
# Database
DATABASE_URL=mysql://root:password@localhost:3306/portfolio

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚢 Deployment Options

### 1. Docker Only
```bash
docker build -t portfolio-ezekiel .
docker run -p 3000:3000 -e DATABASE_URL=$DATABASE_URL portfolio-ezekiel
```

### 2. Docker Compose (with Database)
```yaml
# docker-compose.yml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      # ... other env vars

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: portfolio
    ports:
      - "3306:3306"
```

### 3. Cloud Deployment

#### Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel --prod
```

#### Railway
1. Connect your GitHub repo
2. Add environment variables
3. Deploy automatically

#### Render
1. Create a new Web Service
2. Connect your repo
3. Set build command: `npm run build`
4. Set start command: `npm start`

## 🔒 Security Best Practices

### Docker Security
- ✅ Use non-root user (`nextjs`)
- ✅ Minimal base image (`node:18-alpine`)
- ✅ No unnecessary files (`.dockerignore`)
- ✅ Environment variables for secrets

### Application Security
- ✅ Input validation with Zod
- ✅ SQL injection protection
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Error handling without data leaks

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```javascript
// Add to src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

### Docker Health Check
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🚀 Performance Optimization

### Multi-stage Builds
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### Caching
- ✅ Layer caching with `package*.json` first
- ✅ Dependency separation (dev vs prod)
- ✅ `.dockerignore` for smaller images

## 🔍 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Container won't start:**
```bash
# Check container logs
docker logs <container-name>

# Check if port is exposed
docker ps
```

**Environment variables not working:**
```bash
# Check if .env file exists
ls -la .env

# Verify variable values
docker exec -it <container-name> env
```

### Development vs Production

**Development:**
- Hot reload enabled
- Source maps included
- Debug logging

**Production:**
- Optimized build
- Minified code
- Error logging only

## 📚 Next Steps

1. **Test locally:** `npm run docker:up`
2. **Deploy to cloud:** Choose Vercel/Railway/Render
3. **Add CI/CD:** GitHub Actions for automated deployment
4. **Monitoring:** Add logging and error tracking
5. **Scaling:** Consider load balancing for high traffic

## 🎯 Benefits of Containerization

- ✅ **Consistent environments** across dev/staging/prod
- ✅ **Easy deployment** to any platform
- ✅ **Scalability** with container orchestration
- ✅ **Isolation** and security
- ✅ **Version control** for infrastructure
- ✅ **Fast startup** and resource efficiency

Your portfolio is now containerized and ready for modern deployment! 🚀