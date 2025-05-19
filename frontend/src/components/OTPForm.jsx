import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyAccount, resendOTP } from '../services/api'
import { toast } from 'react-hot-toast'

const OTPForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState(location.state?.email || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await verifyAccount({ email, otp })
      toast.success('Account verified successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed')
    }
  }

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email })
      toast.success('New OTP sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold">Verify Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Verify
          </button>
        </form>
        <p className="mt-4 text-center">
          Didn't receive OTP?{' '}
          <button onClick={handleResendOTP} className="text-blue-500 hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  )
}

export default OTPForm