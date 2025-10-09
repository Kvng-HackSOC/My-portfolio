'use client'

import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface SimpleCloudinaryUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function SimpleCloudinaryUploader({ 
  onUpload, 
  accept = "image/*,video/*",
  label = "Click to upload"
}: SimpleCloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Using default preset
      
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dpolc6i0m/auto/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      onUpload(data.secure_url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
        id={`upload-${Date.now()}`}
        disabled={uploading}
      />
      <label
        htmlFor={`upload-${Date.now()}`}
        className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
      >
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {uploading ? 'Uploading...' : label}
        </p>
      </label>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}