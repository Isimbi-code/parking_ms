import { useState, useEffect } from 'react'
import { getRequests, updateRequest } from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const Requests = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const limit = 10

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data } = await getRequests({ 
        page, 
        limit, 
        search,
        status: statusFilter
      })
      setRequests(data?.data.requests || [])
      setTotal(data?.total || 0)
    } catch (error) {
      toast.error('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [page, search, statusFilter])

  if (!user) return null

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateRequest(id, { status })
      toast.success(`Request ${status.toLowerCase()}`)
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update request')
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        {user.role === 'ADMIN' ? 'All Requests' : 'My Requests'}
      </h1>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border p-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border p-2"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : Array.isArray(requests) && requests.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No requests found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {request.vehicle.plateNumber} ({request.vehicle.type})
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {request.slot?.slotNumber || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        request.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.role === 'ADMIN' && request.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                          className="rounded-md bg-green-100 p-2 text-green-600 hover:bg-green-200"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                          className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : user.role === 'USER' && request.status === 'PENDING' ? (
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                        className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    ) : null}
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

export default Requests