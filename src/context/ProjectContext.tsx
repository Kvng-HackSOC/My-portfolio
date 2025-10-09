'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/types';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  // Default project data as fallback
  const getDefaultProjects = (): Project[] => [
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
      thumbnail_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGljYWx8ZW58MHx8MHx8fDA%3D',
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
      thumbnail_url: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGlhfGVufDB8fDB8fHww',
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
      thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=center',
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
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
      category: 'Backend Development',
      is_featured: false,
      created_at: '2024-03-01',
      updated_at: '2024-03-01'
    }
  ];

  const loadProjects = async () => {
    try {
      // First try to load from localStorage
      const savedProjects = localStorage.getItem('portfolio_projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (parsed.length > 0) {
          setProjects(parsed);
          setLoading(false);
          return;
        }
      }

      // Then try to fetch from API
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setProjects(data.data);
          localStorage.setItem('portfolio_projects', JSON.stringify(data.data));
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }

    // Fallback to default project data
    const defaultProjects = getDefaultProjects();
    setProjects(defaultProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
    setLoading(false);
  };

  const addProject = async (project: Project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const newProject = await response.json();
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error('Error adding project:', error);
      // Fallback to localStorage
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
    }
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedProjects = projects.map(p =>
          p.id === Number(id) ? { ...p, ...updatedData } : p
        );
        setProjects(updatedProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      // Fallback to localStorage
      const updatedProjects = projects.map(p =>
        p.id === Number(id) ? { ...p, ...updatedData } : p
      );
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProjects = projects.filter(p => p.id !== Number(id));
        setProjects(updatedProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      // Fallback to localStorage
      const updatedProjects = projects.filter(p => p.id !== Number(id));
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
    }
  };

  const refreshProjects = () => {
    loadProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}