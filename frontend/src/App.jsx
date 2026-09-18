import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// Patient pages
import PatientDashboard from './pages/patient/Dashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import DoctorDetail from './pages/patient/DoctorDetail';
import MyAppointments from './pages/patient/MyAppointments';

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard';
import ManageSlots from './pages/doctor/ManageSlots';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorProfile from './pages/doctor/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/Doctors';
import AdminUsers from './pages/admin/Users';
import AdminAppointments from './pages/admin/Appointments';

import Navbar from './components/common/Navbar';
import Spinner from './components/common/Spinner';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardPath(user.role)} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboardPath(user.role)} />} />

          {/* Patient */}
          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/search" element={<ProtectedRoute allowedRoles={['patient']}><SearchDoctors /></ProtectedRoute>} />
          <Route path="/patient/doctor/:id" element={<ProtectedRoute allowedRoles={['patient']}><DoctorDetail /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />

          {/* Doctor */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/slots" element={<ProtectedRoute allowedRoles={['doctor']}><ManageSlots /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><AdminAppointments /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function getDashboardPath(role) {
  if (role === 'doctor') return '/doctor/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/patient/dashboard';
}
