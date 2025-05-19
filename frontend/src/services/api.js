import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Request interceptor to add auth token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor to handle errors
// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token')
//             window.location.href = '/login'
//         }
//         return Promise.reject(error)
//     }
// )

export default API

// Auth functions
export const register = (data) => API.post('/auth/register', data)
export const verifyAccount = (data) => API.post('/auth/verify', data)
export const login = (data) => API.post('/auth/login', data)
export const resendOTP = (data) => API.post('/auth/resend-otp', data)
export const getMe = () => API.get('/auth/me')




// Vehicle functions
export const getVehicles = (params) => API.get('/vehicles', { params })
export const addVehicle = (data) => API.post('/vehicles', data)
export const updateVehicle = (id, data) => API.patch(`/vehicles/${id}`, data)
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`)

// Slot functions
export const getSlots = (params) => API.get('/slots', { params })
export const getAvailableSlots = (params) => API.get('/slots/available', { params })
export const createSlot = (data) => API.post('/slots', data)
export const createSlotsBulk = (data) => API.post('/slots/bulk', data)
export const updateSlot = (id, data) => API.patch(`/slots/${id}`, data)
export const deleteSlot = (id) => API.delete(`/slots/${id}`)

// Request functions
export const getRequests = (params) => API.get('/requests', { params })
export const createRequest = (data) => API.post('/requests', data)
export const updateRequest = (id, data) => API.patch(`/requests/${id}`, data)

// User functions (admin only)
export const getUsers = (params) => API.get('/users', { params })
export const updateProfile = (data) => API.patch('/users/update-profile', data)