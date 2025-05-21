import { Link } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

const Sidebar = () => {
  const user = getUserFromToken();



  const userLinks = [
    { to: '/dashboard/parkings', label: 'My Parkings' },
    { to: '/dashboard/spaces', label: ' Available Spaces' },
  ];

  const attendantLinks = [
    { to: '/dashboard/parkings', label: 'Parkings' },
    { to: '/dashboard/entry', label: 'Car Entry' },
    { to: '/dashboard/exit', label: 'Car Exit' },
  ];

  const roleLinks = user?.role === 'PARKING_ATTENDANT' ? attendantLinks : userLinks;

  return (
    <div className="w-64 h-screen bg-black text-white p-6">
      <h2 className="text-xl font-bold mb-6">Smart Parking</h2>
      <nav className="space-y-4">
        {[...roleLinks].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block py-2 px-3 rounded hover:bg-gray-800 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
