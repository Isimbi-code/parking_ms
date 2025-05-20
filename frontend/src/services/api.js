import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// Add auth token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Handle response errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (expired token)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    },
)

export default API

// Auth functions
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')


// Parking functions
export const getParkings = (params) => API.get('/parkings', { params })
export const getAvailableSpaces = (params) => API.get('/parkings/spaces', { params })
export const createParking = (data) => API.post('/parkings', data)
export const createSpace = (data) => API.post('/parkings/spaces', data)


// Car functions

export const enterCar = (data) => API.post('/cars/enter', data)
export const exitCar = (data) => API.post('/cars/exit', data)


// User functions (admin only)
export const getUsers = (params) => API.get('/users', { params })
export const updateProfile = (data) => API.patch('/users/update-profile', data)



