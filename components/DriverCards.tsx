'use client'

import { Driver } from '@/lib/types'
import { User, Truck, MapPin, Package, DollarSign } from 'lucide-react'

interface DriverCardsProps {
  drivers: Driver[]
}

export default function DriverCards({ drivers }: DriverCardsProps) {
  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'on-break':
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {drivers.map((driver) => (
        <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{driver.name}</h3>
                <p className="text-xs text-gray-500">{driver.id}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.status)}`}>
              {driver.status}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-4 h-4" />
              <span>{driver.vehicleNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span>{driver.completedToday} / {driver.totalDeliveries} deliveries</span>
            </div>
            {driver.status === 'active' && driver.currentLocation && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">
                  {driver.currentLocation.lat.toFixed(4)}, {driver.currentLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-green-600 font-semibold pt-2 border-t">
              <DollarSign className="w-4 h-4" />
              <span>₹{driver.pendingCash.toLocaleString()} pending</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
