import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const [result] = await db.execute('SELECT 1 as test, NOW() as timestamp');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}