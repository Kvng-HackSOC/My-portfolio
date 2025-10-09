'use client'

import React, { useState } from 'react';

export default function TestUpload() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Uploading...');
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setStatus('Upload successful!');
      setResult(data);
    } catch (err) {
      setStatus('Upload failed');
      setError(err);
      console.error('Upload error:', err);
    }
  };

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/test-upload');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Test Page</h1>
      
      <div className="mb-6">
        <button
          onClick={checkConfig}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Check Cloudinary Config
        </button>
      </div>

      <div className="mb-6">
        <input
          type="file"
          onChange={testUpload}
          accept="image/*,video/*"
          className="mb-4"
        />
      </div>

      <div className="space-y-4">
        {status && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="font-semibold">Status:</p>
            <p>{status}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-100 rounded">
            <p className="font-semibold">Result:</p>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 rounded">
            <p className="font-semibold">Error:</p>
            <pre className="text-sm overflow-auto">
              {error.toString()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}