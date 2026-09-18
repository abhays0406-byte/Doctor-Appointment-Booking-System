import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.stats)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,             icon: '👥', color: 'text-slate-800',    bg: 'bg-slate-50',    border: 'border-slate-200' },
    { label: 'Doctors',        value: stats.totalDoctors,           icon: '👨‍⚕️', color: 'text-accent-600',   bg: 'bg-accent-50',   border: 'border-accent-100' },
    { label: 'Patients',       value: stats.totalPatients,          icon: '🧑', color: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100' },
    { label: 'Total Appts',    value: stats.totalAppointments,      icon: '📋', color: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100' },
    { label: 'Confirmed',      value: stats.confirmedAppointments,  icon: '✅', color: 'text-emerald-700',  bg: 'bg-emerald-50',  border: 'border-emerald-100' },
    { label: 'Completed',      value: stats.completedAppointments,  icon: '☑️', color: 'text-slate-700',    bg: 'bg-slate-50',    border: 'border-slate-200' },
    { label: 'Cancelled',      value: stats.cancelledAppointments,  icon: '❌', color: 'text-red-600',      bg: 'bg-red-50',      border: 'border-red-100' },
    { label: 'Pending Approval', value: stats.pendingDoctors,       icon: '⏳', color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-100' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Platform overview and management</p>
        </div>
        {stats.pendingDoctors > 0 && (
          <Link to="/admin/doctors" className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            {stats.pendingDoctors} doctor{stats.pendingDoctors > 1 ? 's' : ''} awaiting approval
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border ${s.border}`}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-bold text-slate-900 mb-4">Manage Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { to: '/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️', desc: 'Approve, view, remove doctors', color: 'bg-accent-50 border-accent-100', btn: 'bg-accent-500 text-white' },
            { to: '/admin/users',   label: 'Manage Users',   icon: '👥', desc: 'View and control all accounts', color: 'bg-primary-50 border-primary-100', btn: 'bg-primary-600 text-white' },
            { to: '/admin/appointments', label: 'All Appointments', icon: '📅', desc: 'Platform-wide appointment data', color: 'bg-emerald-50 border-emerald-100', btn: 'bg-emerald-600 text-white' },
          ].map((link) => (
            <div key={link.to} className={`rounded-2xl border p-5 ${link.color} hover:shadow-md transition-shadow`}>
              <span className="text-4xl block mb-3">{link.icon}</span>
              <h3 className="font-bold text-slate-900 mb-1">{link.label}</h3>
              <p className="text-sm text-slate-500 mb-4">{link.desc}</p>
              <Link to={link.to} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold ${link.btn} hover:opacity-90 transition-opacity`}>
                Open →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
