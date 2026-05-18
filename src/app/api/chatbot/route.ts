import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { getAvailableSlots, formatSlotTime } from '@/lib/availability'

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'getServices',
      description: 'Get the full list of barber services with names, prices, and durations.',
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getAvailability',
      description: 'Get available time slots for a given date, service ID, and optional barber ID.',
      parameters: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string',
            description: 'The ID of the service',
          },
          date: {
            type: 'string',
            description: 'The date in YYYY-MM-DD format',
          },
          barberId: {
            type: 'string',
            description: 'Optional barber ID to check specific barber availability',
          },
        },
        required: ['serviceId', 'date'],
      },
    },
  },
]

async function handleGetServices() {
  const services = await db.service.findMany({ orderBy: { price: 'asc' } })
  return services.map(s => ({ name: s.name, price: `$${s.price}`, duration: `${s.duration} min`, id: s.id }))
}

async function handleGetAvailability(serviceId: string, date: string, barberId?: string) {
  const service = await db.service.findUnique({ where: { id: serviceId } })
  if (!service) return []

  const selectedDate = new Date(date)
  let existingBookings: { startTime: Date; endTime: Date }[] = []

  if (barberId) {
    existingBookings = await db.booking.findMany({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: {
          gte: new Date(new Date(selectedDate).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(selectedDate).setHours(23, 59, 59, 999)),
        },
      },
      select: { startTime: true, endTime: true },
    })
  }

  const slots = getAvailableSlots(selectedDate, service.duration, existingBookings)
  return slots.map(slot => formatSlotTime(slot.startTime))
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI key not configured' }, { status: 500 })
  }
  const openai = new OpenAI({ apiKey })

  try {
    const { messages } = await request.json()

    const systemMessage = {
      role: 'system' as const,
      content: `You are The Apprentice, a knowledgeable barber assistant for True Stylez Hair Studio. You're cool, confident, and skilled with the clippers. You:
- Recommend services based on what customers need
- Answer questions about haircuts, beard trims, and shaves
- Can check availability using the shop's schedule (call getAvailability)
- Help customers book appointments
- Keep responses sharp, brief, and stylish
- Use barber terminology naturally

Hours: Tue-Fri 10AM-6PM, Sat 10AM-4:30PM (closed Sun-Mon).`,
    }

    let allMessages = [systemMessage, ...messages]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: allMessages,
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 150,
    })

    const responseMessage = completion.choices[0].message

    // Handle function calls
    if (responseMessage.tool_calls) {
      const toolMessages: any[] = []

      for (const toolCall of responseMessage.tool_calls) {
        const fn = (toolCall as any)
        const functionName = fn.function?.name

        if (functionName === 'getServices') {
          const services = await handleGetServices()
          toolMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(services),
          })
        } else if (functionName === 'getAvailability') {
          const args = JSON.parse(fn.function?.arguments || '{}')
          const slots = await handleGetAvailability(args.serviceId, args.date, args.barberId)
          toolMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ date: args.date, slots }),
          })
        }
      }

      allMessages = [...allMessages, responseMessage, ...toolMessages]

      const followUp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 200,
      })

      return NextResponse.json({
        message: followUp.choices[0].message.content,
      })
    }

    return NextResponse.json({
      message: responseMessage.content || 'I didn\'t catch that. Try again?',
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
