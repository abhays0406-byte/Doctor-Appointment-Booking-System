import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';

const statusConfig = {
  confirmed:   { label: 'Confirmed',   cls: 'badge-green',  icon: '✅' },
  pending:     { label: 'Pending',     cls: 'badge-yellow', icon: '⏳' },
  cancelled:   { label: 'Cancelled',   cls: 'badge-red',    icon: '❌' },
  completed:   { label: 'Completed',   cls: 'badge-gray',   icon: '☑️' },
  rescheduled: { label: 'Rescheduled', cls: 'badge-blue',   icon: '🔄' },
};

function AppointmentRow({ appt }) {
  const doctorName = appt.doctor?.user?.name || 'Doctor';
  const cfg = statusConfig[appt.status] || statusConfig.pending;
  return (
    <div className="flex items-center gap-4 py-4 border-b border-surface-100 last:border-0 group">
      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
        {doctorName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate">Dr. {doctorName}</p>
        <p className="text-xs text-slate-400">{appt.doctor?.specialty}</p>
      </div>
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-slate-700">{appt.date}</p>
        <p className="text-xs text-slate-400">{appt.startTime}</p>
      </div>
      <span className={`badge ${cfg.cls} shrink-0`}>{cfg.icon} {cfg.label}</span>
    </div>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments/my')
      .then(({ data }) => setAppointments(data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => ['confirmed', 'pending', 'rescheduled'].includes(a.status));
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');
  const nextAppt = upcoming[0];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Good {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your health dashboard</p>
        </div>
        <Link to="/patient/search" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book Appointment
        </Link>
      </div>

      {/* Next appointment banner */}
      {nextAppt && (
        <div className="gradient-hero rounded-2xl p-6 text-white">
          <p className="text-primary-200 text-sm font-medium mb-1">Next Appointment</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl">
                {nextAppt.doctor?.user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg">Dr. {nextAppt.doctor?.user?.name}</p>
                <p className="text-primary-200 text-sm">{nextAppt.doctor?.specialty}</p>
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-primary-200">Date & Time</p>
              <p className="font-bold text-white">{nextAppt.date}</p>
              <p className="text-primary-200 text-sm">{nextAppt.startTime} – {nextAppt.endTime}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: appointments.length, icon: '📋', color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Upcoming', value: upcoming.length, icon: '📅', color: 'text-primary-700', bg: 'bg-primary-50' },
          { label: 'Completed', value: completed.length, icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Cancelled', value: cancelled.length, icon: '❌', color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-surface-200`}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Recent Appointments</h2>
            <Link to="/patient/appointments" className="text-sm text-primary-600 font-semibold hover:underline">View all →</Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-400 text-sm">No appointments yet.</p>
              <Link to="/patient/search" className="btn-outline mt-4 inline-block mx-auto text-sm">Find a Doctor</Link>
            </div>
          ) : (
            <div>
              {appointments.slice(0, 5).map((appt) => <AppointmentRow key={appt._id} appt={appt} />)}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { to: '/patient/search', label: 'Find a Doctor', icon: '🔍', desc: 'Browse by specialty' },
                { to: '/patient/appointments', label: 'My Appointments', icon: '📅', desc: 'View & manage' },
              ].map((action) => (
                <Link key={action.to} to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                  <span className="text-2xl w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    {action.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{action.label}</p>
                    <p className="text-xs text-slate-400">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Health tip */}
          <div className="card gradient-card border-primary-100">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">💡 Health Tip</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Regular check-ups can help detect health issues early when they're most treatable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
