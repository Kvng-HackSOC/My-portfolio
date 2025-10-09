import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(request: NextRequest) {
  const config = {
    env: {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      // Don't expose the actual keys
      apiKeyLength: process.env.CLOUDINARY_API_KEY?.length || 0,
      secretLength: process.env.CLOUDINARY_API_SECRET?.length || 0,
    },
    cloudinaryConfig: cloudinary.config(),
  };

  // Test Cloudinary connection
  let testResult = null;
  try {
    // Try to get account details
    const result = await cloudinary.api.ping();
    testResult = { status: 'connected', result };
  } catch (error: any) {
    testResult = { 
      status: 'error', 
      message: error.message,
      error: error.toString() 
    };
  }

  return NextResponse.json({
    configuration: config,
    testResult,
    timestamp: new Date().toISOString(),
  });
}