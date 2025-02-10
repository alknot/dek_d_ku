'use client';

import { useState } from 'react';

const Page = () => {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMimeType, setPdfMimeType] = useState<string | null>(null);
  const [image, setImages] = useState<File | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPdf(event.target.files[0]);
      setPdfMimeType(event.target.files[0].type);
      console.log(event.target.files[0].type);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(event.target.files[0]);
      setImageMimeType(event.target.files[0].type);
      console.log(event.target.files[0].type);
    }
  };

  const handleUploadPdf = async () => {
    if (!pdf) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64File = await toBase64(pdf);

    const formData = new FormData();
    formData.append('pdf', base64File);
    formData.append('mimeType', pdfMimeType || '');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        setPdfUrl((await response.json()).url);
      } else {
        setPdfUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPdfUrl(null);
    }
  };

  const handleUploadImage = async () => {
    if (!image) return;

    const toBase64 = (image: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64Image = await toBase64(image);

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('mimeType', imageMimeType || '');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        setImageUrl((await response.json()).url);
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setImageUrl(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-black">Upload File</h1>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          className="mb-4 w-full rounded-md border px-3 py-2"
        />
        <button
          onClick={handleUploadPdf}
          className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600">
          Upload
        </button>
        {pdfUrl && (
          <a
            href={pdfUrl}
            className="mt-4 text-green-500"
            target="_blank"
            rel="noopener noreferrer">
            {pdfUrl}
          </a>
        )}
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-black">Upload Image</h1>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="mb-4 w-full rounded-md border px-3 py-2"
        />
        <button
          onClick={handleUploadImage}
          className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600">
          Upload image
        </button>
        {imageUrl && (
          <a
            href={imageUrl}
            className="mt-4 text-green-500"
            target="_blank"
            rel="noopener noreferrer">
            {imageUrl}
          </a>
        )}
      </div>
    </div>
  );
};

export default Page;
