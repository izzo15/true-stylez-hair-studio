/**
 * Inline recommend endpoint — used by the style-advice multi-turn flow.
 *
 * POST /api/chatbot/recommend
 * Body: { faceShape: string, maintenance: string, vibe: string }
 *
 * Runs the recommendStyle function server-side and returns the result
 * plus a short follow-up text for the bot to say before the card renders.
 * Zero OpenAI calls — pure function call, ~10 ms response.
 */

import { NextRequest, NextResponse } from 'next/server'
import { recommendStyle } from '@/lib/chatbot/functions'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { faceShape, maintenance, vibe } = await request.json()

    if (!faceShape || !maintenance || !vibe) {
      return NextResponse.json(
        { error: 'faceShape, maintenance, and vibe are all required' },
        { status: 400 },
      )
    }

    const result = await recommendStyle.execute({
      faceShape: faceShape.toUpperCase(),
      maintenance: maintenance.toUpperCase(),
      vibe: vibe.toUpperCase(),
    })

    const followUp =
      `Based on what you've told me, I'd recommend the **${result.name}** — $${result.price}, ${result.duration} minutes. ` +
      (result.stylingTips?.length
        ? result.stylingTips[0] + (result.stylingTips.length > 1 ? ' And ' + result.stylingTips[1] + '.' : '')
        : '') +
      `. Would you like to book it?`

    return NextResponse.json({
      type: 'serviceRecommendation',
      data: result,
      message: followUp,
    })
  } catch (error: any) {
    console.error('[chatbot/recommend] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
