'use client';

import { NextRequest, NextResponse } from 'next/server';
import useSpotifyAuthStore from '@/store/useSpotifyAuthStore';

export async function GET(request: NextRequest) {
    const { token } = useSpotifyAuthStore()

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