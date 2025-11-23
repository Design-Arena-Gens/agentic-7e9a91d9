import { NextResponse } from 'next/server'
import { mockCashCollections } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const driverId = searchParams.get('driverId')

  let filteredCollections = [...mockCashCollections]

  if (status) {
    filteredCollections = filteredCollections.filter((collection) => collection.status === status)
  }

  if (driverId) {
    filteredCollections = filteredCollections.filter((collection) => collection.driverId === driverId)
  }

  return NextResponse.json(filteredCollections)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newCollection = {
    id: `CC${String(mockCashCollections.length + 1).padStart(3, '0')}`,
    status: 'pending' as const,
    date: new Date().toISOString(),
    ...body,
  }

  return NextResponse.json(newCollection, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { collectionId, status, approvedBy } = body

  return NextResponse.json({
    success: true,
    collectionId,
    status,
    approvedBy,
    approvedAt: new Date().toISOString(),
  })
}
