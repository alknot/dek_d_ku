import { NextResponse } from 'next/server';

// Middleware to handle CORS headers
export const setCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins, or replace '*' with specific domains
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUSH, DELETE, PATCH'); // Allowed HTTP methods
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  return response;
};
