'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/context/ProjectContext';
import Link from 'next/link';
import Button from '@/components/UI/Button';
import { FaArrowRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function Projects() {
  const { projects, loading } = useProjects();

  // Show only featured projects (first 3) on home page
  const featuredProjects = projects.filter(project => project.is_featured).slice(0, 3);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A glimpse of my recent work and technical expertise
            </p>
          </motion.div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A showcase of my recent work spanning healthcare, media, DevOps, and backend development
          </p>
        </motion.div>

        {featuredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-slate-600 text-lg">
              Featured projects will be displayed here soon.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-100">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.thumbnail_url || '/api/placeholder/400/300'}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/300';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.short_description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <FaGithub className="text-lg" />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <FaExternalLinkAlt className="text-lg" />
                            </a>
                          )}
                        </div>
                        <Link href="/projects" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Projects Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Link href="/projects">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  View All Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-slate-600 text-sm mt-4">
                Explore {projects.length - featuredProjects.length} more projects in my portfolio
              </p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}