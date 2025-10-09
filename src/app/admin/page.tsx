'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';
import { Project } from '@/types';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newProject, setNewProject] = useState({
    name: '',
    short_description: '',
    long_description: '',
    readme_content: '',
    technologies: '',
    github_url: '',
    live_url: '',
    video_url: '',
    thumbnail_url: '',
    category: '',
    is_featured: false
  });

  // Simple auth credentials
  const ADMIN_EMAIL = 'oba198175@gmail.com';
  const ADMIN_PASSWORD = 'Obanla198175%';

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('portfolio_projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever they change
    if (projects.length > 0) {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'portfolio'); // You may need to create this in Cloudinary

      // Upload to Cloudinary directly (client-side upload)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dpolc6i0m/${type}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (type === 'image') {
          setNewProject({ ...newProject, thumbnail_url: data.secure_url });
        } else {
          setNewProject({ ...newProject, video_url: data.secure_url });
        }
      } else {
        console.error('Upload failed:', await response.text());
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    if (editingProject) {
      // Update existing project
      const updatedProject: Project = {
        ...editingProject,
        name: newProject.name,
        short_description: newProject.short_description,
        long_description: newProject.long_description,
        readme_content: newProject.readme_content || `# ${newProject.name}\n\n${newProject.long_description}`,
        technologies: techArray,
        github_url: newProject.github_url,
        live_url: newProject.live_url,
        video_url: newProject.video_url,
        thumbnail_url: newProject.thumbnail_url,
        category: newProject.category,
        is_featured: newProject.is_featured,
        updated_at: new Date().toISOString(),
      };
      
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      );
      setProjects(updatedProjects);
      setEditingProject(null);
    } else {
      // Add new project
      const project: Project = {
        id: Date.now(),
        name: newProject.name,
        short_description: newProject.short_description,
        long_description: newProject.long_description,
        readme_content: newProject.readme_content || `# ${newProject.name}\n\n${newProject.long_description}`,
        technologies: techArray,
        github_url: newProject.github_url,
        live_url: newProject.live_url,
        video_url: newProject.video_url,
        thumbnail_url: newProject.thumbnail_url || '/api/placeholder/400/300',
        category: newProject.category,
        is_featured: newProject.is_featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProjects([...projects, project]);
    }
    
    // Reset form
    setNewProject({
      name: '',
      short_description: '',
      long_description: '',
      readme_content: '',
      technologies: '',
      github_url: '',
      live_url: '',
      video_url: '',
      thumbnail_url: '',
      category: '',
      is_featured: false
    });
    setShowAddForm(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      short_description: project.short_description,
      long_description: project.long_description || '',
      readme_content: project.readme_content || '',
      technologies: project.technologies.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      video_url: project.video_url || '',
      thumbnail_url: project.thumbnail_url || '',
      category: project.category || '',
      is_featured: project.is_featured || false
    });
    setShowAddForm(true);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              Logout
            </Button>
          </div>

          <div className="mb-6 flex gap-4">
            <Button 
              variant="primary" 
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false);
                  setEditingProject(null);
                  setNewProject({
                    name: '',
                    short_description: '',
                    long_description: '',
                    readme_content: '',
                    technologies: '',
                    github_url: '',
                    live_url: '',
                    video_url: '',
                    thumbnail_url: '',
                    category: '',
                    is_featured: false
                  });
                } else {
                  setShowAddForm(true);
                }
              }}
            >
              {showAddForm ? 'Cancel' : 'Add New Project'}
            </Button>
          </div>

          {showAddForm && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newProject.short_description}
                    onChange={(e) => setNewProject({...newProject, short_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea
                    value={newProject.long_description}
                    onChange={(e) => setNewProject({...newProject, long_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    README Content (Markdown)
                  </label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={newProject.readme_content}
                      onChange={(value) => setNewProject({...newProject, readme_content: value || ''})}
                      height={300}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Desktop App">Desktop App</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {newProject.thumbnail_url && (
                      <img 
                        src={newProject.thumbnail_url} 
                        alt="Thumbnail preview" 
                        className="mt-2 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Project Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {newProject.video_url && (
                      <video 
                        src={newProject.video_url} 
                        controls 
                        className="mt-2 h-32 rounded"
                      />
                    )}
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={newProject.github_url}
                      onChange={(e) => setNewProject({...newProject, github_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={newProject.live_url}
                      onChange={(e) => setNewProject({...newProject, live_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.is_featured}
                    onChange={(e) => setNewProject({...newProject, is_featured: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Project
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Uploading...' : editingProject ? 'Update Project' : 'Add Project'}
                  </Button>
                  {editingProject && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProject(null);
                        setNewProject({
                          name: '',
                          short_description: '',
                          long_description: '',
                          readme_content: '',
                          technologies: '',
                          github_url: '',
                          live_url: '',
                          video_url: '',
                          thumbnail_url: '',
                          category: '',
                          is_featured: false
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6">
                {project.thumbnail_url && (
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.short_description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {project.category || 'Uncategorized'}
                  </p>
                  {project.is_featured && (
                    <p className="text-sm text-green-600 font-medium mt-1">Featured</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProject(project)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}