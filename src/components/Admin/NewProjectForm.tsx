'use client'

import React, { useState } from 'react';
import { Project } from '@/types';

interface NewProjectFormProps {
  project?: Project | null;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

export default function NewProjectForm({ project, onSave, onCancel }: NewProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    technologies: project?.technologies || [],
    image: project?.image || '',
    video: project?.video || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false,
  });

  const [techInput, setTechInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">
        {project ? 'Edit Project' : 'Add New Project'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Mobile">Mobile</option>
            <option value="UI/UX">UI/UX</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={handleTechKeyPress}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Add technology and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Project Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use image URLs from Unsplash, Pexels, Imgur, or any direct image link
          </p>
          {formData.image && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <img 
                src={formData.image} 
                alt="Project preview" 
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Invalid+URL';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={formData.video}
            onChange={(e) => setFormData({ ...formData, video: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            YouTube, Vimeo, or direct video URLs
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Live Demo URL</label>
          <input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://your-project.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Featured Project</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {project ? 'Update' : 'Create'} Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}