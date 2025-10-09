import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [projects] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = {
      ...projects[0],
      technologies: JSON.parse(projects[0].technologies || '[]')
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    authenticateRequest(request);

    const { id } = await params;
    const data = await request.json();
    const {
      name,
      short_description,
      long_description,
      readme_content,
      technologies,
      github_url,
      live_url,
      video_url,
      thumbnail_url,
      category,
      is_featured
    } = data;

    await db.execute(
      `UPDATE projects SET
        name = ?, short_description = ?, long_description = ?, readme_content = ?,
        technologies = ?, github_url = ?, live_url = ?, video_url = ?, thumbnail_url = ?,
        category = ?, is_featured = ?
      WHERE id = ?`,
      [
        name,
        short_description,
        long_description,
        readme_content,
        JSON.stringify(technologies || []),
        github_url,
        live_url,
        video_url,
        thumbnail_url,
        category,
        is_featured ? 1 : 0,
        id
      ]
    );

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    authenticateRequest(request);

    const { id } = await params;
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'No token provided' ? 401 : 500 }
    );
  }
}