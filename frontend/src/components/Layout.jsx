 import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Layout = () => {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!user) return null

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/', admin: false },
    { name: 'My Vehicles', path: '/vehicles', admin: false },
    { name: 'Parking Slots', path: '/slots', admin: false },
    { name: 'My Requests', path: '/requests', admin: false },
    { name: 'User Management', path: '/users', admin: true },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex w-72 flex-col bg-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Parking System</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems
              .filter((item) => !item.admin || user.role === 'ADMIN')
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-72 flex-col border-r bg-white md:flex">
        <div className="p-4">
          <h1 className="text-xl font-bold">Parking System</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navItems
            .filter((item) => !item.admin || user.role === 'ADMIN')
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white p-4 shadow-sm md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout