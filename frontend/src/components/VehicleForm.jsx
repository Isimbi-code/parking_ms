import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addVehicle, updateVehicle, getVehicles } from '../services/api'
import { toast } from 'react-hot-toast'

const VehicleForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: 'CAR',
    size: 'SMALL',
    attributes: {}
  })

  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        try {
          const { data } = await getVehicles(id)
          setFormData({
            plateNumber: data.plateNumber,
            type: data.type,
            size: data.size,
            attributes: data.attributes || {}
          })
        } catch (error) {
          toast.error('Failed to fetch vehicle details')
          navigate('/vehicles')
        }
      }
      fetchVehicle()
    }
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAttributeChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await updateVehicle(id, formData)
        toast.success('Vehicle updated successfully')
      } else {
        await addVehicle(formData)
        toast.success('Vehicle added successfully')
      }
      navigate('/vehicles')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save vehicle')
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold">
        {id ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Plate Number</label>
          <input
            type="text"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            className="w-full rounded-md border p-2"
            required
            pattern="[A-Z0-9]{3,}"
            title="Enter a valid plate number (letters and numbers only)"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Vehicle Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              required
            >
              <option value="CAR">Car</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Vehicle Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              required
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Additional Attributes</label>
          <div className="space-y-2 rounded-md border p-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Color</label>
              <input
                type="text"
                name="color"
                value={formData.attributes?.color || ''}
                onChange={handleAttributeChange}
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.attributes?.brand || ''}
                onChange={handleAttributeChange}
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={formData.attributes?.model || ''}
                onChange={handleAttributeChange}
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {id ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehicleForm