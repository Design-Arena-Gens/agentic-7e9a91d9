'use client'

import { useState, useEffect } from 'react'
import { Package, CheckCircle, XCircle, Camera, Barcode, Navigation, Phone, MapPin, DollarSign } from 'lucide-react'
import { Order } from '@/lib/types'
import { mockOrders } from '@/lib/mock-data'
import { QRCodeSVG } from 'qrcode.react'

export default function DriverApp() {
  const [selectedDriver] = useState('DR001')
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)

  useEffect(() => {
    const driverOrders = mockOrders.filter((order) => order.assignedDriver === selectedDriver)
    setMyOrders(driverOrders)
  }, [selectedDriver])

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setMyOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    )
  }

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-gray-500',
      assigned: 'bg-blue-500',
      'picked-up': 'bg-purple-500',
      'in-transit': 'bg-indigo-500',
      delivered: 'bg-green-500',
      returned: 'bg-red-500',
    }
    return colors[status]
  }

  const getNextAction = (status: Order['status']) => {
    const actions = {
      assigned: { label: 'Accept Order', nextStatus: 'picked-up' as const },
      'picked-up': { label: 'Start Transit', nextStatus: 'in-transit' as const },
      'in-transit': { label: 'Mark Delivered', nextStatus: 'delivered' as const },
      delivered: null,
      returned: null,
      pending: null,
    }
    return actions[status]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Lekya Driver</h1>
            <p className="text-sm opacity-90">Rajesh Kumar - DR001</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{myOrders.filter((o) => o.status === 'delivered').length}</p>
            <p className="text-xs opacity-90">Completed Today</p>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setScannerOpen(!scannerOpen)}
            className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Barcode className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-semibold text-blue-900">Scan Barcode</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Navigation className="w-6 h-6 text-green-600" />
            <span className="text-xs font-semibold text-green-900">Navigate</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Phone className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-semibold text-purple-900">Call Support</span>
          </button>
        </div>
      </div>

      {/* Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Scan Barcode</h3>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">Position barcode within frame</p>
            <button
              onClick={() => setScannerOpen(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <main className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          My Tasks ({myOrders.filter((o) => !['delivered', 'returned'].includes(o.status)).length} active)
        </h2>

        <div className="space-y-4">
          {myOrders.map((order) => {
            const nextAction = getNextAction(order.status)
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className={`${getStatusColor(order.status)} h-2`}></div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{order.trackingNumber}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )} text-white`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-semibold text-sm">{order.customerName}</p>
                        <p className="text-xs text-gray-600">{order.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-lg text-green-600">₹{order.amount}</span>
                      <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* QR Code for order */}
                  <div className="flex justify-center mb-4 p-2 bg-gray-50 rounded">
                    <QRCodeSVG value={order.trackingNumber} size={80} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {nextAction && (
                      <button
                        onClick={() => updateOrderStatus(order.id, nextAction.nextStatus)}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {nextAction.label}
                      </button>
                    )}
                    {order.status === 'in-transit' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'returned')}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Return
                      </button>
                    )}
                    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {myOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders assigned yet</p>
          </div>
        )}
      </main>

      {/* Bottom Stats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{myOrders.length}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {myOrders.filter((o) => o.status === 'delivered').length}
            </p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              ₹{myOrders.filter((o) => o.status === 'delivered' && o.paymentMethod === 'cod').reduce((sum, o) => sum + o.amount, 0)}
            </p>
            <p className="text-xs text-gray-600">Cash Collected</p>
          </div>
        </div>
      </div>
    </div>
  )
}
