# Ezekiel Obanla - Full Stack Developer Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS, featuring a secure admin panel for content management.

## 🚀 Features

- **Modern Design**: Clean, responsive UI with smooth animations using Framer Motion
- **Admin Dashboard**: Secure admin panel for managing projects
- **Database Integration**: MySQL database for persistent data storage
- **Media Uploads**: Cloudinary integration for image and video uploads
- **Markdown Support**: Rich text editing for project descriptions
- **SEO Optimized**: Built with Next.js for optimal performance and SEO
- **Type Safe**: Full TypeScript implementation
- **Secure Authentication**: JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Icons**: Icon library
- **React Markdown**: Markdown rendering

### Backend
- **MySQL**: Relational database
- **Cloudinary**: Media storage and optimization
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm or yarn
- MySQL (v8.0 or higher)
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ezekielobanla/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/portfolio
   JWT_SECRET=your-secure-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Create a MySQL database and run the following SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS portfolio;
   USE portfolio;

   CREATE TABLE IF NOT EXISTS projects (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     short_description TEXT,
     long_description TEXT,
     readme_content TEXT,
     technologies JSON,
     github_url VARCHAR(255),
     live_url VARCHAR(255),
     video_url VARCHAR(255),
     thumbnail_url VARCHAR(255),
     category VARCHAR(100),
     is_featured BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Insert admin user (update with your credentials)
   INSERT INTO users (email, password) VALUES 
   ('your-email@example.com', 'your-hashed-password');
   ```

5. **Configure Cloudinary**
   - Create a free account at [Cloudinary](https://cloudinary.com)
   - Get your API credentials from the dashboard
   - Create an upload preset named "portfolio" (unsigned)

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── admin/           # Admin panel
│   │   ├── api/             # API routes
│   │   ├── projects/        # Projects pages
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── Admin/          # Admin components
│   │   ├── Home/           # Home page sections
│   │   ├── Layout/         # Layout components
│   │   ├── Projects/       # Project components
│   │   └── UI/             # Reusable UI components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔐 Admin Panel

Access the admin panel at `/admin` with your credentials to:
- Add new projects
- Edit existing projects
- Delete projects
- Upload project images and videos
- Manage project visibility

## 📝 Usage

### Adding Projects

1. Navigate to `/admin`
2. Login with your credentials
3. Click "Add New Project"
4. Fill in project details
5. Upload media files
6. Save the project

### Customization

- Update colors in `tailwind.config.js`
- Modify components in `src/components`
- Adjust layout in `src/app/layout.tsx`
- Update content in respective component files

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ezekiel Obanla**
- GitHub: [@ezekielobanla](https://github.com/ezekielobanla)
- LinkedIn: [Ezekiel Obanla](https://linkedin.com/in/ezekielobanla)
- Email: oba198175@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- All contributors and supporters

---

Made with ❤️ by Ezekiel Obanla