'use client'

import { useState, useEffect } from 'react'
import { Menu, Bell, LogOut, Users, Package, MapPin, DollarSign } from 'lucide-react'
import dynamic from 'next/dynamic'
import StatsCards from '@/components/StatsCards'
import DriverCards from '@/components/DriverCards'
import OrdersTable from '@/components/OrdersTable'
import CashCollectionPanel from '@/components/CashCollectionPanel'
import { mockDrivers, mockOrders, mockCashCollections } from '@/lib/mock-data'
import { Driver, Order, CashCollection } from '@/lib/types'

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false })

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'drivers' | 'cash' | 'map'>('overview')
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [cashCollections, setCashCollections] = useState<CashCollection[]>(mockCashCollections)

  const handleAssignDriver = (orderId: string, driverId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const driver = drivers.find((d) => d.id === driverId)
          return {
            ...order,
            status: 'assigned' as const,
            assignedDriver: driverId,
            assignedDriverName: driver?.name,
            updatedAt: new Date().toISOString(),
          }
        }
        return order
      })
    )
  }

  const handleApproveCash = (id: string) => {
    setCashCollections((prev) =>
      prev.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              status: 'approved' as const,
              approvedBy: 'Logistics Manager',
              approvedAt: new Date().toISOString(),
            }
          : collection
      )
    )
  }

  const handleRejectCash = (id: string) => {
    setCashCollections((prev) =>
      prev.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              status: 'rejected' as const,
            }
          : collection
      )
    )
  }

  const activeDriversCount = drivers.filter((d) => d.status === 'active').length
  const deliveredToday = orders.filter(
    (o) => o.status === 'delivered' && new Date(o.updatedAt).toDateString() === new Date().toDateString()
  ).length
  const pendingCashTotal = drivers.reduce((sum, d) => sum + d.pendingCash, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">Lekya Logistics</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                Logistics Manager
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 flex gap-1 border-t border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'drivers', label: 'Drivers', icon: Users },
            { id: 'map', label: 'Live Map', icon: MapPin },
            { id: 'cash', label: 'Cash Collection', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
              <StatsCards
                totalOrders={orders.length}
                activeDrivers={activeDriversCount}
                pendingCash={pendingCashTotal}
                deliveredToday={deliveredToday}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Drivers</h2>
              <DriverCards drivers={drivers.filter((d) => d.status === 'active')} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <OrdersTable
                  orders={orders.slice(0, 5)}
                  drivers={drivers}
                  onAssignDriver={handleAssignDriver}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
              <div className="flex gap-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  + New Order
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <OrdersTable orders={orders} drivers={drivers} onAssignDriver={handleAssignDriver} />
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Drivers</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                + Add Driver
              </button>
            </div>
            <DriverCards drivers={drivers} />
          </div>
        )}

        {activeTab === 'map' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Live Driver Tracking</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" style={{ height: '600px' }}>
              <LiveMap drivers={drivers} />
            </div>
          </div>
        )}

        {activeTab === 'cash' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Cash Collection Approval</h2>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                  {cashCollections.filter((c) => c.status === 'pending').length} Pending
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                  {cashCollections.filter((c) => c.status === 'approved').length} Approved
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Pending Approvals</h3>
                <CashCollectionPanel
                  collections={cashCollections.filter((c) => c.status === 'pending')}
                  onApprove={handleApproveCash}
                  onReject={handleRejectCash}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recent History</h3>
                <CashCollectionPanel
                  collections={cashCollections.filter((c) => c.status !== 'pending')}
                  onApprove={handleApproveCash}
                  onReject={handleRejectCash}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
