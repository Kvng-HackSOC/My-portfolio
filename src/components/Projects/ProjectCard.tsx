'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { Project } from '@/types';
import Button from '@/components/UI/Button';

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
      className="h-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        <div className="relative">
          {project.video_url ? (
            <video
              className="w-full h-60 object-cover"
              autoPlay
              muted
              loop
              poster={project.thumbnail_url || '/api/placeholder/400/300'}
            >
              <source src={project.video_url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={project.thumbnail_url || '/api/placeholder/400/300'}
              alt={project.name}
              className="w-full h-60 object-cover"
            />
          )}

          {project.video_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <FaPlay className="text-white text-6xl" />
            </div>
          )}

          {project.is_featured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {project.name}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
            {project.short_description}
          </p>

          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FaGithub className="text-lg" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FaExternalLinkAlt className="text-lg" />
                </a>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;