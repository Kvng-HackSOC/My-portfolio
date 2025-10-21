'use client'

import React, { useState } from 'react';
import { Project } from '@/types';
import ProjectForm from '@/components/Admin/ProjectForm';
import MediaUploader from '@/components/Admin/MediaUploader';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';

// Match the MediaItem interface from MediaUploader
interface UploadedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export default function Dashboard() {
  const { projects, addProject, updateProject, deleteProject, refreshProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<UploadedMedia[]>([]);

  const saveProject = async (project: Partial<Project>) => {
    try {
      if (selectedProject && selectedProject.id) {
        // Update existing project - convert number to string
        updateProject(selectedProject.id.toString(), project);
      } else {
        // Create new project
        const newProject = {
          ...project,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Project;
        addProject(newProject);
      }

      setShowProjectForm(false);
      setSelectedProject(null);
      refreshProjects();
    } catch (error) {
      console.error('Error saving project:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleDeleteProject = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this project?')) return;
    deleteProject(id.toString());
  };

  const handleMediaUpload = (media: UploadedMedia) => {
    setMediaLibrary([...mediaLibrary, media]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Media Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Media Library</h2>
        <MediaUploader onUpload={handleMediaUpload} />
        
        {mediaLibrary.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {mediaLibrary.map((media) => (
              <div key={media.id} className="relative group">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Media"
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigator.clipboard.writeText(media.url)}
                    className="bg-white p-1 rounded shadow hover:bg-gray-100 text-sm"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button
            onClick={() => {
              setSelectedProject(null);
              setShowProjectForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No projects yet</p>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEye />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowProjectForm(true);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm
              project={selectedProject}
              onSave={saveProject}
              onCancel={() => {
                setShowProjectForm(false);
                setSelectedProject(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}