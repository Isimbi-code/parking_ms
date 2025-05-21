import { Routes, Route, Navigate,BrowserRouter } from 'react-router-dom';
import { getUserFromToken } from './utils/auth';
import UserDashboard from './components/AdminDashboard';
import AttendantDashboard from './components/AttendantDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthForm from './components/AuthForm';
import { Toaster } from 'react-hot-toast';
import CarEntry from './components/CarEntry';
import CarExit from './components/CarExit';
import Parkings from './components/Parkings';
import Spaces from './components/Spaces';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const user = getUserFromToken();

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/login" element={<AuthForm />} />

      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'PARKING_ATTENDANT' ? <AttendantDashboard /> : <UserDashboard />}
        </ProtectedRoute>
      } />


      <Route path="/dashboard/parkings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Parkings />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard/spaces" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Spaces />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard/entry" element={
        <ProtectedRoute>
          <DashboardLayout>
            <CarEntry />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard/exit" element={
        <ProtectedRoute>
          <DashboardLayout>
            <CarExit />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
    </BrowserRouter>
  );
};

export default App;
