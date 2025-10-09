'use client'

import React, { useState } from 'react';
import { Project } from '@/types';
import SimpleFileUpload from './SimpleFileUpload';

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
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
  const [imageInput, setImageInput] = useState(project?.image || '');
  const [videoInput, setVideoInput] = useState(project?.video || '');

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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageInput(url);
    setFormData({ ...formData, image: url });
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoInput(url);
    setFormData({ ...formData, video: url });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
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
              className="flex-1 border rounded px-3 py-2"
              placeholder="Add technology"
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

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Project Image</h3>
          
          {/* Option 1: Upload from computer */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Option 1: Upload from computer</label>
            <SimpleFileUpload 
              onUpload={(url) => {
                setFormData({ ...formData, image: url });
                setImageInput(url);
              }}
              accept="image/*"
              label="Click to upload image"
            />
          </div>

          {/* Option 2: External URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Option 2: External Image URL</label>
            <input
              type="url"
              value={imageInput}
              onChange={handleImageUrlChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use image URLs from Unsplash, Pexels, or your own hosting
            </p>
          </div>

          {/* Preview */}
          {formData.image && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <img src={formData.image} alt="Project" className="w-32 h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, image: '' });
                  setImageInput('');
                }}
                className="text-red-500 text-sm mt-1"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Project Video (Optional)</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input
              type="url"
              value={videoInput}
              onChange={handleVideoUrlChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube, Vimeo, or direct video URLs
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Live URL</label>
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