import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const barbers = await db.barber.findMany()
  return NextResponse.json(barbers)
}