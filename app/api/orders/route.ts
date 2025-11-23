import { NextResponse } from 'next/server'
import { mockOrders } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const driverId = searchParams.get('driverId')
  const status = searchParams.get('status')

  let filteredOrders = [...mockOrders]

  if (driverId) {
    filteredOrders = filteredOrders.filter((order) => order.assignedDriver === driverId)
  }

  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status)
  }

  return NextResponse.json(filteredOrders)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newOrder = {
    id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
    orderNumber: `LKY-2024-${String(mockOrders.length + 1).padStart(4, '0')}`,
    trackingNumber: `TRK${Date.now()}`,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  }

  return NextResponse.json(newOrder, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { orderId, ...updates } = body

  return NextResponse.json({
    success: true,
    orderId,
    updates,
    updatedAt: new Date().toISOString(),
  })
}
