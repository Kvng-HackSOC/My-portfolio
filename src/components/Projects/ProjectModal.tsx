'use client';

import React from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { Project } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoLogoGithub, IoGlobeOutline } from 'react-icons/io5';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.name} size="full">
      <div className="space-y-8">
        {/* Video Section */}
        {project.video_url && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <video
              src={project.video_url}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Project Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-700">{project.short_description}</p>
          </div>
          
          <div className="md:w-64">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Links</h3>
            <div className="space-y-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <IoLogoGithub className="w-5 h-5" />
                  View on GitHub
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <IoGlobeOutline className="w-5 h-5" />
                  View Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* README Content */}
        {project.readme_content && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Details</h3>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.readme_content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">
                View Code
              </Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProjectModal;