import { useState, useEffect } from 'react'
import { getSlots, getAvailableSlots, deleteSlot } from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'

const Slots = () => {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const limit = 10



  const fetchSlots = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const params = { 
        page, 
        limit, 
        search,
        type: typeFilter,
        size: sizeFilter,
        status: statusFilter
      }
      
      const { data } = user.role === 'ADMIN' 
        ? await getSlots(params) 
        : await getAvailableSlots(params)
      
       
      setSlots(data?.data.slots || [])
      setTotal(data?.total || 0)

    } catch (error) {
      toast.error('Failed to fetch slots')
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, sizeFilter, statusFilter, user])

  

  useEffect(() => {
    if (user) {
      fetchSlots()
    }
  }, [user, fetchSlots])

  if (!user) return null;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await deleteSlot(id)
        toast.success('Slot deleted successfully')
        fetchSlots()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete slot')
      }
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">
          {user.role === 'ADMIN' ? 'All Parking Slots' : 'Available Parking Slots'}
        </h1>
        {user.role === 'ADMIN' && (
          <Link
            to="/slots/add"
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <PlusIcon className="h-4 w-4" />
            Add Slot
          </Link>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Search slots..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border p-2"
        />
        {user.role === 'ADMIN' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border p-2"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        )}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border p-2"
        >
          <option value="">All Types</option>
          <option value="CAR">Car</option>
          <option value="MOTORCYCLE">Motorcycle</option>
          <option value="TRUCK">Truck</option>
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="rounded-md border p-2"
        >
          <option value="">All Sizes</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : Array.isArray(slots) && slots.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No parking slots found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slot Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                {user.role === 'ADMIN' && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td className="whitespace-nowrap px-6 py-4">{slot.slotNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4">{slot.type}</td>
                  <td className="whitespace-nowrap px-6 py-4">{slot.size}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        slot.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{slot.location}</td>
                  {user.role === 'ADMIN' && (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/slots/edit/${slot.id}`}
                          className="rounded-md bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page} of {Math.ceil(total / limit)}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className="rounded-md bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Slots