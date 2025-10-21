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
    // Check if user is already logged in (from session/localStorage)
    const isUserLoggedIn = localStorage.getItem('admin_logged_in');
    if (isUserLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Load projects from localStorage
      const storedProjects = localStorage.getItem('portfolio_projects');
      if (storedProjects) {
        try {
          setProjects(JSON.parse(storedProjects));
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      }
    }
  }, [isLoggedIn]);

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
      localStorage.setItem('admin_logged_in', 'true');
      setError('');
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setProjects([]);
    setShowAddForm(false);
    setEditingProject(null);
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
      name: project.name || '',
      short_description: project.short_description || '',
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

  const handleDeleteProject = (id: number | undefined) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
    }
  };

  const resetForm = () => {
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
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="mb-6 flex gap-4">
            <Button 
              variant="primary" 
              onClick={() => {
                if (showAddForm) {
                  resetForm();
                } else {
                  setShowAddForm(true);
                }
              }}
            >
              {showAddForm ? 'Cancel' : 'Add New Project'}
            </Button>
            {projects.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{projects.length}</span> 
                <span>project{projects.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {showAddForm && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={newProject.short_description}
                    onChange={(e) => setNewProject({...newProject, short_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for card display"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Detailed project description"
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
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Add detailed documentation in Markdown format
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate each technology with a comma
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Desktop App">Desktop App</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {newProject.thumbnail_url && (
                      <div className="mt-2">
                        <img 
                          src={newProject.thumbnail_url} 
                          alt="Thumbnail preview" 
                          className="h-32 w-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProject({...newProject, thumbnail_url: ''})}
                          className="text-red-600 text-xs mt-1 hover:underline"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Video (Optional)
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {newProject.video_url && (
                      <div className="mt-2">
                        <video 
                          src={newProject.video_url} 
                          controls 
                          className="h-32 w-full rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProject({...newProject, video_url: ''})}
                          className="text-red-600 text-xs mt-1 hover:underline"
                        >
                          Remove video
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.is_featured}
                    onChange={(e) => setNewProject({...newProject, is_featured: e.target.checked})}
                    className="mr-3 h-4 w-4 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Project (will appear on homepage)
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Uploading...' : editingProject ? 'Update Project' : 'Add Project'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {projects.length === 0 && !showAddForm ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first project</p>
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Add Your First Project
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                  {project.thumbnail_url && (
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{project.short_description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {project.category || 'Uncategorized'}
                    </p>
                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md px-4">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Login
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to manage your portfolio
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
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
                placeholder="admin@example.com"
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
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}