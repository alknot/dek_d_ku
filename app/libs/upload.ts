import { bucket } from './firebase/config';

export const uploadPDF = async (base64PDF: string, mimeType: string, extraPath?: string) => {
  const base64Data = base64PDF.replace(/^data:application\/pdf;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const fileName = `dek-d-ku/pdfs/${extraPath ? `${extraPath}/` : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
  const file = bucket.file(fileName);

  await file.save(buffer, {
    metadata: { contentType: mimeType },
    public: true,
    validation: 'md5',
  });

  return file.publicUrl();
};

export const uploadImage = async (base64Image: string, mimeType: string, extraPath?: string) => {
  // Remove the data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Extract the file extension from the MIME type
  const extension = mimeType.split('/')[1];
  console.log(extension);
  const fileName = `dek-d-ku/images/${extraPath ? `${extraPath}/` : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
  const file = bucket.file(fileName);

  await file.save(buffer, {
    metadata: { contentType: mimeType },
    public: true,
    validation: 'md5',
  });

  return file.publicUrl();
};
