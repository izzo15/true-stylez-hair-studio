import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const services = await db.service.findMany({
    orderBy: { price: 'asc' }
  })
  return NextResponse.json(services)
}