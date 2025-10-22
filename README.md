# Ezekiel Obanla - Full Stack Developer Portfolio

A modern, responsive portfolio website showcasing my expertise in full-stack development and cybersecurity. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, responsive UI with smooth animations
- **Project Showcase**: Display of real-world projects and technical skills
- **Contact Integration**: Professional contact form with email functionality
- **SEO Optimized**: Built with Next.js for optimal performance and SEO
- **Type Safe**: Full TypeScript implementation
- **Mobile Responsive**: Perfect experience across all devices

## 🛠️ Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Icons**: Icon library
- **Zod**: Schema validation
- **MySQL**: Database (for admin features)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kvng-HackSOC/My-portfolio.git
   cd My-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your actual configuration values. See [Environment Variables](#environment-variables) section below.

4. **Database Setup**
   - Create a MySQL database named `portfolio`
   - Update the `DATABASE_URL` in your `.env` file with your database credentials

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Environment Variables

The application requires several environment variables to function properly. Copy `.env.example` to `.env` and fill in your values:

- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `CLOUDINARY_*`: Cloudinary credentials for image uploads
- `NEXT_PUBLIC_API_URL`: API URL for client-side requests
- `EMAIL_USER` & `EMAIL_PASS`: Email service credentials (see [EMAIL_SETUP.md](EMAIL_SETUP.md))

### Docker Setup (Alternative)

For containerized deployment:

```bash
# Build and run with Docker Compose
npm run docker:up

# Or build manually
docker build -t portfolio-ezekiel .
docker run -p 3000:3000 --env-file .env portfolio-ezekiel
```

### Database Schema

The application uses MySQL. Run the following SQL to create the required tables:

```sql
-- Projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  technologies JSON,
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin users table (for authentication)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Production Deployment

This portfolio can be deployed to any modern hosting platform:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

### Docker Production Deployment

For production deployment with Docker:

```bash
# Build optimized multi-stage image
npm run docker:build:multi

# Run production container
npm run docker:prod

# Or deploy to Kubernetes
npm run k8s:deploy
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Set `NODE_ENV=production`
- Configure database URL for production database
- Set secure JWT secret
- Configure email service credentials
- Set up Cloudinary for image storage

### Database Migration

Before deploying, ensure your production database has the required schema. You can run the SQL scripts provided in the [Database Setup](#database-setup) section.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

- **Database connection errors**: Verify your `DATABASE_URL` in `.env`
- **Email not sending**: Check `EMAIL_SETUP.md` for proper email configuration
- **Build errors**: Ensure all dependencies are installed with `npm install`
- **Environment variables**: Make sure `.env` file exists and is properly configured

### Development Tips

- Use `npm run lint` to check code quality
- Run `npm test` for unit tests (when available)
- Check logs in the console for debugging information

## 👤 Author

**Ezekiel Obanla**
- GitHub: [@Kvng-HackSOC](https://github.com/Kvng-HackSOC)
- LinkedIn: [Temilade Obanla](https://linkedin.com/in/obanlaopeyemitemilade)
- Portfolio: [My Portfolio](https://github.com/Kvng-HackSOC/My-portfolio)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- React community for the ecosystem
- All contributors and supporters

---

Made with ❤️ by Ezekiel Obanla