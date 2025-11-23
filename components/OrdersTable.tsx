'use client'

import { Order, Driver } from '@/lib/types'
import { useState } from 'react'
import { Package, MapPin, User, Phone, DollarSign, Clock } from 'lucide-react'

interface OrdersTableProps {
  orders: Order[]
  drivers: Driver[]
  onAssignDriver: (orderId: string, driverId: string) => void
}

export default function OrdersTable({ orders, drivers, onAssignDriver }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'picked-up': 'bg-purple-100 text-purple-800',
      'in-transit': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Address</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.trackingNumber}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </p>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-600 flex items-start gap-1 max-w-xs">
                  <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                  <span className="line-clamp-2">{order.deliveryAddress}</span>
                </p>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm">₹{order.amount}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
              </td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-4">
                {order.assignedDriverName ? (
                  <div className="text-sm">
                    <p className="font-medium">{order.assignedDriverName}</p>
                    <p className="text-xs text-gray-500">{order.assignedDriver}</p>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Not assigned</span>
                )}
              </td>
              <td className="px-4 py-4">
                {order.status === 'pending' && (
                  <select
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssignDriver(order.id, e.target.value)
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="">Assign Driver</option>
                    {drivers
                      .filter((d) => d.status === 'active')
                      .map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
