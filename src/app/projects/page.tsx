'use client';

import { useEffect, useState } from 'react';
import ProjectGrid from '@/components/Projects/ProjectGrid';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // User's actual GitHub projects
    const userProjects: Project[] = [
      {
        id: 1,
        name: 'WellnessConnect',
        short_description: 'A comprehensive wellness platform connecting users with healthcare providers and wellness services.',
        long_description: 'WellnessConnect is a full-stack web application that bridges the gap between patients and healthcare providers. Features include appointment scheduling, telemedicine integration, health tracking, and personalized wellness recommendations.',
        readme_content: '# WellnessConnect\n\nA comprehensive wellness platform...',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Stripe'],
        github_url: 'https://github.com/Kvng-HackSOC/WellnessConnect',
        live_url: '',
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGljYWx8ZW58MHx8MHx8fDA%3D', // Healthcare/medical themed image
        category: 'Healthcare',
        is_featured: true,
        created_at: '2024-01-15',
        updated_at: '2024-01-15'
      },
      {
        id: 2,
        name: 'MediaFinder',
        short_description: 'A powerful media discovery and management platform for content creators and consumers.',
        long_description: 'MediaFinder is an intelligent media platform that helps users discover, organize, and manage digital content. Features include advanced search algorithms, content categorization, media analytics, and social sharing capabilities.',
        readme_content: '# MediaFinder\n\nA powerful media discovery platform...',
        technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Docker', 'AWS'],
        github_url: 'https://github.com/Kvng-HackSOC/MediaFinder',
        live_url: '',
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGlhfGVufDB8fDB8fHww', // Technology/media themed image
        category: 'Media & Entertainment',
        is_featured: true,
        created_at: '2024-02-01',
        updated_at: '2024-02-01'
      },
      {
        id: 3,
        name: 'Distributed Log File Analyzer',
        short_description: 'A high-performance distributed system for analyzing large-scale log files across multiple servers.',
        long_description: 'This distributed log analyzer processes massive log files across multiple servers using MapReduce patterns. Features real-time analysis, anomaly detection, performance monitoring, and automated alerting systems.',
        readme_content: '# Distributed Log File Analyzer\n\nA high-performance distributed log analysis system...',
        technologies: ['Go', 'Kafka', 'Elasticsearch', 'Kubernetes', 'Prometheus', 'Grafana', 'Docker'],
        github_url: 'https://github.com/Kvng-HackSOC/Distributed-Log-File-Analyzer',
        live_url: '',
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=center', // Data/analytics themed image
        category: 'DevOps & Infrastructure',
        is_featured: true,
        created_at: '2024-02-15',
        updated_at: '2024-02-15'
      },
      {
        id: 4,
        name: 'Sakila DVD Rental API',
        short_description: 'A RESTful API for the classic Sakila DVD rental database with modern features and security.',
        long_description: 'A comprehensive REST API built on the MySQL Sakila sample database. Includes advanced querying, authentication, rate limiting, caching, and comprehensive documentation. Perfect for learning API development and database design.',
        readme_content: '# Sakila DVD Rental API\n\nA RESTful API for DVD rental management...',
        technologies: ['Node.js', 'Express', 'MySQL', 'JWT', 'Redis', 'Swagger', 'Jest'],
        github_url: 'https://github.com/Kvng-HackSOC/Sakila-DVD-Rental-API',
        live_url: '',
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center', // Database/API themed image
        category: 'Backend Development',
        is_featured: false,
        created_at: '2024-03-01',
        updated_at: '2024-03-01'
      }
    ];

    // Try to fetch from API first, fallback to local data
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setProjects(data.data);
            return;
          }
        }
      } catch (error) {
        console.log('API not available, using local project data');
      }

      // Fallback to local project data
      setProjects(userProjects);
    };

    loadProjects().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore my portfolio of web applications, security tools, and innovative solutions. Each project showcases my expertise in full-stack development and cybersecurity.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <ProjectGrid projects={projects} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Projects will be displayed here once added.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}