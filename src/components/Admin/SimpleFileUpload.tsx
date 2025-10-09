'use client'

import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface SimpleFileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function SimpleFileUpload({ 
  onUpload, 
  accept = "image/*",
  label = "Click to upload"
}: SimpleFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Convert to base64 and use as URL
      const base64String = reader.result as string;
      onUpload(base64String);
      setUploading(false);
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setUploading(false);
    };

    reader.readAsDataURL(file);
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
          {uploading ? 'Processing...' : label}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Max file size: 5MB
        </p>
      </label>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}