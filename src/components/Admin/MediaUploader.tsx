import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

interface MediaUploaderProps {
  onUpload: (mediaItem: MediaItem) => void;
}

export default function MediaUploader({ onUpload }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image or video.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

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
      
      const mediaItem: MediaItem = {
        id: Date.now().toString(),
        url: data.url,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      };

      onUpload(mediaItem);
      setProgress(100);
      
      // Reset after successful upload
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
        id="media-upload"
        disabled={uploading}
      />
      <label
        htmlFor="media-upload"
        className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}
      >
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {uploading ? 'Uploading...' : 'Click to upload images or videos'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Support for JPG, PNG, GIF, WEBP, MP4, MOV (Max 100MB)
        </p>
      </label>
      
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}