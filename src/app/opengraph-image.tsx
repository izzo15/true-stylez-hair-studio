import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'True Stylez Hair Studio — Fresh Fades. True Style.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f11 0%, #1a1c21 45%, #6f2b16 100%)',
          color: '#f5f5f6',
        }}
      >
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
          True Stylez
        </div>
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, color: '#c9a66b', marginTop: 12 }}>
          Fresh Fades. True Style.
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#d0d0d5', marginTop: 28 }}>
          Troy, NY — J The Barber
        </div>
      </div>
    ),
    { ...size },
  )
}
