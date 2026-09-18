import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    patient: [
      { label: 'Home', to: '/patient/dashboard' },
      { label: 'Find Doctors', to: '/patient/search' },
      { label: 'My Appointments', to: '/patient/appointments' },
    ],
    doctor: [
      { label: 'Dashboard', to: '/doctor/dashboard' },
      { label: 'My Slots', to: '/doctor/slots' },
      { label: 'Appointments', to: '/doctor/appointments' },
      { label: 'Profile', to: '/doctor/profile' },
    ],
    admin: [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Doctors', to: '/admin/doctors' },
      { label: 'Users', to: '/admin/users' },
      { label: 'Appointments', to: '/admin/appointments' },
    ],
  };

  const links = user ? navLinks[user.role] || [] : [];
  const isActive = (to) => location.pathname === to;

  const roleColors = {
    patient: 'bg-primary-100 text-primary-700',
    doctor:  'bg-accent-100 text-accent-600',
    admin:   'bg-purple-100 text-purple-700',
  };

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Medi<span className="text-primary-600">Link</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                    <span className={`badge text-xs mt-0.5 capitalize ${roleColors[user.role]}`}>{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-surface-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-surface-100 mt-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-surface-100">
              {user ? (
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-medium">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-surface-100 rounded-xl">Sign in</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 rounded-xl font-semibold">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
