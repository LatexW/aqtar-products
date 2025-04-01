import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
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
    
    // Create unique file name
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(publicDir, fileName);
    const relativePath = `/uploads/${fileName}`;
    
    try {
      await writeFile(filePath, buffer);
      
      return NextResponse.json({ 
        success: true,
        url: relativePath
      });
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 