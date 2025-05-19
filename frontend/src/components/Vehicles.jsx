import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVehicles, deleteVehicle } from '../services/api'
import { toast } from 'react-hot-toast'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const { data } = await getVehicles({ 
        page, 
        limit, 
        search 
      })
      setVehicles(data?.data.vehicles || [])
      setTotal(data?.data.total || 0)
    } catch (error) {
      toast.error('Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [page, limit, search])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id)
        toast.success('Vehicle deleted successfully')
        fetchVehicles()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete vehicle')
      }
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">My Vehicles</h1>
        <Link
          to="/vehicles/add"
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <PlusIcon className="h-4 w-4" />
          Add Vehicle
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border p-2 md:w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : Array.isArray(vehicles) && vehicles.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No vehicles found. Add your first vehicle!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Plate Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="whitespace-nowrap px-6 py-4">{vehicle.plateNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4">{vehicle.type}</td>
                  <td className="whitespace-nowrap px-6 py-4">{vehicle.size}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/vehicles/edit/${vehicle.id}`}
                        className="rounded-md bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
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

export default Vehicles