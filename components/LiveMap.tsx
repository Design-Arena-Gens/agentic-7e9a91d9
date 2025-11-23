'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Driver } from '@/lib/types'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface LiveMapProps {
  drivers: Driver[]
}

export default function LiveMap({ drivers }: LiveMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  const center: [number, number] = [28.6139, 77.2090] // Delhi center

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {drivers
        .filter((driver) => driver.currentLocation && driver.status === 'active')
        .map((driver) => {
          if (!driver.currentLocation) return null

          const L = require('leaflet')
          const icon = L.divIcon({
            html: `<div class="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
              ${driver.name.split(' ').map(n => n[0]).join('')}
            </div>`,
            className: 'custom-marker',
            iconSize: [40, 40],
          })

          return (
            <Marker
              key={driver.id}
              position={[driver.currentLocation.lat, driver.currentLocation.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{driver.name}</h3>
                  <p className="text-sm text-gray-600">{driver.vehicleNumber}</p>
                  <p className="text-sm">Status: <span className="text-green-600 font-semibold">{driver.status}</span></p>
                  <p className="text-sm">Completed: {driver.completedToday} orders</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
    </MapContainer>
  )
}
