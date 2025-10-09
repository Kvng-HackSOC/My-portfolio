import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch projects from database with prepared statement
    const [projects] = await pool.execute(
      'SELECT id, name, short_description, long_description, readme_content, technologies, github_url, live_url, video_url, thumbnail_url, category, is_featured, created_at, updated_at FROM projects ORDER BY created_at DESC'
    );

    return NextResponse.json({
      success: true,
      data: projects,
      count: Array.isArray(projects) ? projects.length : 0
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}