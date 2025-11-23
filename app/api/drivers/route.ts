import { NextResponse } from 'next/server'
import { mockDrivers } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let filteredDrivers = [...mockDrivers]

  if (status) {
    filteredDrivers = filteredDrivers.filter((driver) => driver.status === status)
  }

  return NextResponse.json(filteredDrivers)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newDriver = {
    id: `DR${String(mockDrivers.length + 1).padStart(3, '0')}`,
    totalDeliveries: 0,
    completedToday: 0,
    pendingCash: 0,
    status: 'active' as const,
    ...body,
  }

  return NextResponse.json(newDriver, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { driverId, location } = body

  return NextResponse.json({
    success: true,
    driverId,
    location,
    timestamp: Date.now(),
  })
}
