import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Log environment variables (without exposing secrets)
console.log('Cloudinary Config Check:', {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log('Upload endpoint called');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('Attempting Cloudinary upload...');
    
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'portfolio',
        resource_type: 'auto',
        timeout: 60000, // 60 second timeout
      });

      console.log('Cloudinary upload successful:', result.public_id);

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (cloudinaryError: any) {
      console.error('Cloudinary specific error:', cloudinaryError);
      
      // Check for specific Cloudinary errors
      if (cloudinaryError.message?.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'Invalid Cloudinary API credentials' },
          { status: 401 }
        );
      }
      
      throw cloudinaryError;
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}