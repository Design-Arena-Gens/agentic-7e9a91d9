'use client'

import { CashCollection } from '@/lib/types'
import { DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface CashCollectionPanelProps {
  collections: CashCollection[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function CashCollectionPanel({ collections, onApprove, onReject }: CashCollectionPanelProps) {
  const getStatusIcon = (status: CashCollection['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <div key={collection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              {getStatusIcon(collection.status)}
              <div>
                <h3 className="font-semibold text-lg">{collection.driverName}</h3>
                <p className="text-sm text-gray-500">{collection.driverId}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-bold text-xl text-green-600">₹{collection.amount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">{format(new Date(collection.date), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Orders</p>
              <p className="font-semibold">{collection.orders.length} orders</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  collection.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : collection.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {collection.status}
              </span>
            </div>
          </div>

          {collection.notes && (
            <div className="mb-3 p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-sm">{collection.notes}</p>
            </div>
          )}

          {collection.status === 'approved' && collection.approvedBy && (
            <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-700">
                Approved by {collection.approvedBy} on {format(new Date(collection.approvedAt!), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          )}

          {collection.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(collection.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => onReject(collection.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
