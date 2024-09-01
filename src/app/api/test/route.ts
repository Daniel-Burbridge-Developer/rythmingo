import { NextRequest, NextResponse } from 'next/server';

// Named export for GET requests
export async function GET(request: NextRequest) {
  // Handle GET request logic here
  return NextResponse.json({ message: 'This is a GET request' });
}

// Named export for POST requests
export async function POST(request: NextRequest) {
  // Handle POST request logic here
  const data = await request.json();
  return NextResponse.json({ message: 'This is a POST request', data });
}
