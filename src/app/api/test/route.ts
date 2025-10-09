import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const [connectionTest] = await pool.query('SELECT 1 as connection_test');
    
    // Check if projects table exists
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects'
    `);
    
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      tablesExist: Array.isArray(tables) && tables.length > 0
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: (error as Error).message,
      database: process.env.DATABASE_URL ? 'configured' : 'not configured'
    }, { status: 500 });
  }
}