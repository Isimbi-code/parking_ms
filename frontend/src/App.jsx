import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AuthForm from './components/AuthForm'
import OTPForm from './components/OTPForm'
import Dashboard from './components/Dashboard'
import Vehicles from './components/Vehicles'
import Slots from './components/Slots'
import Requests from './components/Requests'
import Users from './components/Users'
import SlotForm from './components/SlotForm'
import VehicleForm from './components/VehicleForm'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/verify" element={<OTPForm />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="slots" element={<Slots />} />
          <Route path="slots/add" element={<SlotForm />} />
          <Route path="slots/edit/:id" element={<SlotForm />} />
          <Route path="vehicles/add" element={<VehicleForm />} />
          <Route path="vehicles/edit/:id" element={<VehicleForm />} />
          <Route path="requests" element={<Requests />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App