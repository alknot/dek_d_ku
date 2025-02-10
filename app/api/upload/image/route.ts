import { uploadImage } from '@/app/libs/upload';
import { handleError } from '@/app/libs/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    if (!body) {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const image = body.get('image');
    if (!image) {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const mimeType = body.get('mimeType');
    if (!mimeType) {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    try {
      const url = await uploadImage(image.toString(), mimeType.toString(), 'test');
      return NextResponse.json({ url }, { status: 200 });
    } catch (e) {
      handleError(e);
      return NextResponse.json({ message: 'Failed to upload PDF' }, { status: 500 });
    }
  } catch (e) {
    handleError(e);
    return NextResponse.json({ message: 'Failed to upload PDF', errorMessage: e }, { status: 500 });
  }
}
