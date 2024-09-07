import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' });
  }

  try {
    // Constructing the request body
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI || '');
    body.append('client_id', process.env.SPOTIFY_CLIENT_ID || '');
    body.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET || '');

    // Exchange authorization code for an access token using fetch
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(
        `Failed to fetch access token: ${tokenResponse.statusText}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    return NextResponse.json(accessToken);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' });
  }
}
