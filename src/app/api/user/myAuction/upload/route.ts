import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Ensure upload directory exists
async function ensureDir(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists, ignore error
    console.warn('Directory creation error:', error);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    await ensureDir(uploadDir);
    
    const filepath = join(uploadDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true,
      filepath: `/uploads/${filename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};