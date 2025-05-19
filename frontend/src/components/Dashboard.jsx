import { useEffect, useState } from 'react'
import { getRequests, getVehicles, getSlots, getAvailableSlots } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { ChartBarIcon, TruckIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    vehicles: 0,
    slots: 0,
    requests: 0,
    pendingRequests: 0,
  })

  useEffect(() => {
    if(!user) return
    const fetchStats = async () => {
      try {
        const [vehiclesRes, slotsRes, requestsRes] = await Promise.all([
          getVehicles(),
          user?.role === 'ADMIN' ? getSlots() : getAvailableSlots(),
          getRequests({ limit: 1000 }),
        ])

        setStats({
          vehicles: vehiclesRes.data?.data.vehicles?.length || 0,
          slots: slotsRes.data?.data.slots?.length || 0,
          requests: requestsRes.data?.data.requests?.length || 0,
          pendingRequests: requestsRes.data?.data.requests?.filter(r => r.status === 'PENDING').length || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [user])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<TruckIcon className="h-6 w-6" />}
          title="My Vehicles"
          value={stats.vehicles}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          icon={<MapPinIcon className="h-6 w-6" />}
          title="Available Slots"
          value={stats.slots}
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          icon={<ChartBarIcon className="h-6 w-6" />}
          title="Total Requests"
          value={stats.requests}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          icon={<ClockIcon className="h-6 w-6" />}
          title="Pending Requests"
          value={stats.pendingRequests}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-gray-500">Recent requests and activities will appear here.</p>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color }) => (
  <div className={`rounded-lg ${color} p-6 shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="rounded-full bg-white p-3">{icon}</div>
    </div>
  </div>
)

export default Dashboard