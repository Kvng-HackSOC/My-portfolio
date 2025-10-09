'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';

export default function StatusPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [localProjects, setLocalProjects] = useState<any[]>([]);

  useEffect(() => {
    checkStatus();
    checkLocalStorage();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      console.error('Error checking database:', error);
      setDbStatus({ status: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      try {
        const projects = JSON.parse(stored);
        setLocalProjects(projects);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
      }
    }
  };

  const migrateToDatabase = async () => {
    if (localProjects.length === 0) {
      alert('No projects in localStorage to migrate');
      return;
    }

    try {
      for (const project of localProjects) {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project)
        });
        
        if (!response.ok) {
          console.error('Failed to migrate project:', project.name);
        }
      }
      
      alert('Migration complete! Check database status again.');
      checkStatus();
    } catch (error) {
      console.error('Migration error:', error);
      alert('Error during migration');
    }
  };

  // Check environment variables on the client side
  const envStatus = {
    DATABASE_URL: process.env.DATABASE_URL ? '✓ Set' : '✗ Not Set (Server-side only)',
    CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Not Set',
    JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Not Set (Server-side only)',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? '✓ Set' : '✗ Not Set',
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Status Check</h1>
        
        {loading ? (
          <p>Checking status...</p>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Database Status</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(dbStatus, null, 2)}
              </pre>
              <div className="mt-4">
                <Button onClick={checkStatus} variant="outline">
                  Refresh Status
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">LocalStorage Projects</h2>
              <p className="mb-4">Found {localProjects.length} projects in localStorage</p>
              {localProjects.map((project, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                  {project.name} - {project.category}
                </div>
              ))}
              {localProjects.length > 0 && (
                <div className="mt-4">
                  <Button onClick={migrateToDatabase} variant="primary">
                    Migrate to Database
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
              <ul className="space-y-2">
                {Object.entries(envStatus).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Note: Server-side environment variables are not visible in the browser.
                The database connection is checked via the API route above.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Check if admin user exists:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`SELECT * FROM users WHERE email = 'oba198175@gmail.com';`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">If no admin user, insert one:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`INSERT INTO users (email, password) VALUES 
('oba198175@gmail.com', '$2b$10$y7YrfIKTscqp97So.s435uadzSIckLybPwDLnRvHLpPoaZQU1NVU6');`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Check projects:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`SELECT * FROM projects;`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}