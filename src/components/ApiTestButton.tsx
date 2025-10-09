'use client'; // Add this directive at the top of the file

import { useState } from 'react';

export default function ApiTestButton() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/test`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API test error:', err);
      setError(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <button 
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-bold text-green-600">Connection Successful!</h3>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}