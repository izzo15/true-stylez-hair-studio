/**
 * GET /api/instagram
 *
 * Returns the latest 6 media posts for @j_thebarberny from the Instagram
 * Basic Display API.
 *
 * Results are cached in-memory for 1 hour.
 * If the environment variable is missing or the request fails, an empty array
 * is returned so the feed component can hide itself silently.
 */

import { NextResponse } from 'next/server'

let _cache: { data: unknown; expires: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface InstagramMedia {
  id: string
  media_url: string
  permalink: string
  caption: string
}

interface InstagramUser {
  id: string
  username: string
}

interface InstagramMeResponse {
  data: InstagramUser
}

interface InstagramMediaResponse {
  data: InstagramMedia[]
  paging?: { next?: string }
}

async function fetchInstagramMedia(
  accessToken: string,
  userId: string,
  limit = 6,
): Promise<InstagramMedia[]> {
  const url = new URL(`https://graph.instagram.com/${userId}/media`)
  url.searchParams.set('fields', 'id,media_url,permalink,caption')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Instagram API ${res.status}`)

  const body: InstagramMediaResponse = await res.json()
  return body.data ?? []
}

export async function GET() {
  if (_cache && Date.now() < _cache.expires) {
    return NextResponse.json(_cache.data)
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!accessToken) {
    console.warn('[api/instagram] INSTAGRAM_ACCESS_TOKEN not set — returning empty array')
    _cache = { data: [], expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json([])
  }

  try {
    // Step 1 — resolve the user id from the access token
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`,
      { cache: 'no-store' },
    )
    if (!meRes.ok) throw new Error(`Instagram /me HTTP ${meRes.status}`)

    const meBody: InstagramMeResponse = await meRes.json()
    const userId = meBody.data.id

    // Step 2 — fetch the media
    const media = await fetchInstagramMedia(accessToken, userId, 6)
    _cache = { data: media, expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json(media)
  } catch (err) {
    console.error('[api/instagram] fetch failed:', err)
    _cache = { data: [], expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json([])
  }
}
