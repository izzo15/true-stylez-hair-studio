/**
 * The Apprentice — API Route
 *
 * POST /api/chatbot
 *
 * Two-step OpenAI pipeline:
 *   Step 1 — non-streaming call with tools → collect tool_calls (if any)
 *   Step 2 — streaming SSE response after executing all tool calls
 *
 * Runs on Next.js Edge Runtime for < 50 ms cold-start latency.
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { systemPrompt } from '@/lib/chatbot/systemPrompt'
import { functions } from '@/lib/chatbot/functions'
import { db } from '@/lib/db'
import { fallbackResponse } from '@/lib/chatbot/fallback'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'
export const maxDuration = 30 // seconds — Edge Function limit

/* ── OpenAI tool definitions (mirrors lib/chatbot/functions.ts) ────────── */

function buildTools() {
  return [
    {
      type: 'function' as const,
      function: {
        name: 'getServices',
        description: 'Get all available services with names, prices, and durations.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'getBarbers',
        description: 'Get all barbers with names and specialties.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'getAvailability',
        description:
          'Get available time slots for a given date, service ID, and optional barber ID. Returns time strings like ["10:00 AM", "10:30 AM"].',
        parameters: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format',
            },
            serviceId: {
              type: 'string',
              description: 'ID of the service',
            },
            barberId: {
              type: 'string',
              description: 'Optional barber ID',
            },
          },
          required: ['date', 'serviceId'],
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'getHours',
        description: 'Get shop hours, address, and phone number.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'recommendStyle',
        description:
          'Recommend a service based on face shape, maintenance preference, and desired vibe.',
        parameters: {
          type: 'object',
          properties: {
            faceShape: {
              type: 'string',
              enum: ['OVAL', 'ROUND', 'SQUARE', 'HEART', 'OBLONG', 'DIAMOND', 'UNKNOWN'],
              description: 'Customer face shape',
            },
            maintenance: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'LOW=wash&go MEDIUM=some product HIGH=daily styling',
            },
            vibe: {
              type: 'string',
              enum: ['PROFESSIONAL', 'EDGY', 'CLASSIC', 'TRENDY'],
              description: 'Desired style vibe',
            },
          },
          required: ['faceShape', 'maintenance', 'vibe'],
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'createBookingIntent',
        description:
          'Create a booking prefill from collected service/barber/date/time info. Never writes to the DB — returns prefill data the chat UI uses to seed the booking widget.',
        parameters: {
          type: 'object',
          properties: {
            serviceId: { type: 'string', description: 'ID of the service (required)' },
            barberId: { type: 'string', description: 'Optional barber ID' },
            date: { type: 'string', description: 'YYYY-MM-DD (optional)' },
            time: { type: 'string', description: 'HH:MM 24-h (optional)' },
          },
          required: ['serviceId'],
        },
      },
    },
  ]
}

/* ── POST handler ──────────────────────────────────────────────────────── */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY

  // ── No API key → fallback immediately ──────────────────────────────────
  if (!apiKey) {
    console.warn('[chatbot] OPENAI_API_KEY not set — using fallback')
    try {
      const body = await request.json()
      const { messages } = body as { messages: ChatMessage[] }
      const lastUser =
        messages.filter((m) => m.role === 'user').pop()?.content ?? ''
      return NextResponse.json({
        content: fallbackResponse(lastUser),
        fallback: true,
      })
    } catch {
      return NextResponse.json({
        content: fallbackResponse(''),
        fallback: true,
      })
    }
  }

  const openai = new OpenAI({ apiKey })
  const tools = buildTools()

  try {
    const { messages }: { messages: ChatMessage[] } = await request.json()

    // ── Trim to last 20 exchanges to control prompt length ─────────────────
    const recentMessages = messages.slice(-20)

    const allMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages,
    ]

    /* ── Step 1: non-streaming call to detect tool calls ─────────────────── */
    let firstCompletion: OpenAI.Chat.Completions.ChatCompletion

    try {
      firstCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: allMessages,
        tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 300,
      })
    } catch (step1Err: any) {
      // If OpenAI is down, serve fallback
      console.error('[chatbot] Step 1 OpenAI error:', step1Err)
      const lastUser =
        recentMessages.filter((m) => m.role === 'user').pop()?.content ?? ''
      return NextResponse.json({
        content: fallbackResponse(lastUser),
        fallback: true,
      })
    }

    const aiMessage = firstCompletion.choices[0].message

    // Build conversation up to the first assistant response
    const step2Messages: ChatMessage[] = [...allMessages, aiMessage]

    // ── Execute any tool calls ────────────────────────────────────────────
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      for (const toolCall of aiMessage.tool_calls) {
        const fnName = toolCall.function?.name
        const fnArgs = toolCall.function?.arguments
          ? JSON.parse(toolCall.function.arguments)
          : {}

        let result: unknown
        try {
          const fn = functions[fnName as keyof typeof functions]
          if (!fn) {
            result = { error: `Unknown function: ${fnName}` }
          } else {
            result = await fn.execute(fnArgs)
          }
        } catch (err: any) {
          console.error(`[chatbot] Error executing ${fnName}:`, err)
          result = { error: err.message ?? `Failed to execute ${fnName}` }
        }

        step2Messages.push({
          role: 'tool',
          content: JSON.stringify(result),
        } as any)
      }
    }

    /* ── Step 2: streaming response ──────────────────────────────────────── */
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: step2Messages,
      tools: [],
      tool_choice: 'none',
      temperature: 0.7,
      max_tokens: 250,
      stream: true,
    })

    // Pipe the OpenAI stream directly to an SSE response
    return new Response(
      (stream as unknown) as ReadableStream<Uint8Array>,
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      },
    )
  } catch (error: any) {
    console.error('[chatbot] Fatal error:', error)
    return NextResponse.json(
      { error: 'Chatbot service unavailable', detail: error.message },
      { status: 500 }
    )
  }
}
