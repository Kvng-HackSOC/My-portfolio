'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: number;
  title?: string;
  name?: string;
}

export default function ProjectsApiTest() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/projects`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(`Failed to fetch projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Projects API Test</h2>
      
      {loading && <p>Loading projects...</p>}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {projects.length > 0 ? (
        <div>
          <h3 className="font-bold text-green-600">Successfully fetched {projects.length} projects:</h3>
          <ul className="mt-2 space-y-2">
            {projects.map((project) => (
              <li key={project.id} className="p-2 bg-gray-50 rounded">
                {project.title || project.name}
              </li>
            ))}
          </ul>
        </div>
      ) : !loading && !error ? (
        <p>No projects found. Database connection works but table may be empty.</p>
      ) : null}
    </div>
  );
}