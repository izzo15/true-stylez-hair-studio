export interface ShopVideoClip {
  /** Slot number, 1-9, matching the grid position in ShopCam */
  id: number
  /** Path to the self-hosted video file, e.g. '/videos/fade-1.mp4' */
  src: string
  /** Optional poster/thumbnail image shown before play */
  poster?: string
  /** Optional short caption shown on the tile */
  caption?: string
}

/**
 * Real video clips for the "Live" shop-cam grid (see ShopCam.tsx).
 * Add an entry here once a clip has been downloaded and placed in
 * public/videos/ — see docs/PHOTO_SLOTS.md. Empty by default; any slot
 * (1-9) without a matching entry falls back to the placeholder scanning
 * animation, so partial rollout (e.g. only 3 clips) works fine.
 */
export const shopClips: ShopVideoClip[] = []
