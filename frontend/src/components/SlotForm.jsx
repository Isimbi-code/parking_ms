import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createSlot, updateSlot, getSlots } from '../services/api'
import { toast } from 'react-hot-toast'

const SlotForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    slotNumber: '',
    type: 'CAR',
    size: 'SMALL',
    location: 'NORTH',
    status: 'AVAILABLE'
  })

  useEffect(() => {
    if (id) {
      const fetchSlot = async () => {
        try {
          const { data } = await getSlots(id)
          setFormData(data.slot)
        } catch (error) {
          toast.error('Failed to fetch slot details')
          navigate('/slots')
        }
      }
      fetchSlot()
    }
  }, [id, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await updateSlot(id, formData)
        toast.success('Slot updated successfully')
      } else {
        await createSlot(formData)
        toast.success('Slot created successfully')
      }
      navigate('/slots')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save slot')
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold">{id ? 'Edit Parking Slot' : 'Add New Parking Slot'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Slot Number</label>
          <input
            type="text"
            name="slotNumber"
            value={formData.slotNumber}
            onChange={handleChange}
            className="w-full rounded-md border p-2"
            required
          />
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium">Type</label>
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
          <label className="mb-2 block text-sm font-medium">Size</label>
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
        
        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-md border p-2"
            required
          >
            <option value="NORTH">North</option>
            <option value="SOUTH">South</option>
            <option value="EAST">East</option>
            <option value="WEST">West</option>
          </select>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border p-2"
            required
          >
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {id ? 'Update Slot' : 'Create Slot'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SlotForm