'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ProjectFilters from './ProjectFilters';
import { Project, FilterOptions } from '@/types';

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const filteredProjects = projects.filter((project) => {
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    
    if (filters.technology && !project.technologies.includes(filters.technology)) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.short_description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <ProjectFilters 
        projects={projects} 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={() => setSelectedProject(project)}
          />
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No projects found matching your criteria.</p>
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default ProjectGrid;