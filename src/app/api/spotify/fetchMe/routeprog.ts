import { NextResponse } from 'next/server';

export async function GET() {
  const token = 'abcd';

  try {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error during Spotify authentication:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' });
  }
}
