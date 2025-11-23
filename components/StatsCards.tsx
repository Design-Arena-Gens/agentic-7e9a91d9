'use client'

import { Package, Truck, DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  totalOrders: number
  activeDrivers: number
  pendingCash: number
  deliveredToday: number
}

export default function StatsCards({ totalOrders, activeDrivers, pendingCash, deliveredToday }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Active Drivers',
      value: activeDrivers,
      icon: Truck,
      color: 'bg-green-500',
      change: '+3',
    },
    {
      title: 'Pending Cash',
      value: `₹${pendingCash.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '-8%',
    },
    {
      title: 'Delivered Today',
      value: deliveredToday,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+24%',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
