import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const statusConfig = {
  confirmed:   { cls: 'badge-green',  label: 'Confirmed' },
  pending:     { cls: 'badge-yellow', label: 'Pending' },
  cancelled:   { cls: 'badge-red',    label: 'Cancelled' },
  completed:   { cls: 'badge-gray',   label: 'Completed' },
  rescheduled: { cls: 'badge-blue',   label: 'Rescheduled' },
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/appointments/doctor'),
      api.get('/doctors/profile/me'),
    ])
      .then(([apptRes, profileRes]) => {
        setAppointments(apptRes.data.appointments);
        setProfile(profileRes.data.doctor);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === today && a.status !== 'cancelled');
  const upcoming = appointments.filter((a) => a.date >= today && ['confirmed', 'rescheduled'].includes(a.status));
  const totalSlots = profile?.availableSlots?.length || 0;
  const bookedSlots = profile?.availableSlots?.filter((s) => s.isBooked).length || 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Good {getGreeting()}, Dr. {user.name.split(' ')[0]} 👨‍⚕️
          </h1>
          <p className="text-slate-500 mt-1">Here's your practice overview</p>
        </div>
        <Link to="/doctor/slots" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Manage Slots
        </Link>
      </div>

      {/* Approval banner */}
      {profile && !profile.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-amber-800">Account Pending Approval</p>
            <p className="text-sm text-amber-600">Your profile is under review by the admin. You'll be visible to patients once approved.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: todayAppts.length, icon: '📅', color: 'text-primary-700', bg: 'bg-primary-50' },
          { label: 'Upcoming',             value: upcoming.length,   icon: '🗓️', color: 'text-blue-700',    bg: 'bg-blue-50' },
          { label: 'Total Slots',          value: totalSlots,        icon: '🕐', color: 'text-slate-700',   bg: 'bg-slate-50' },
          { label: 'Booked Slots',         value: bookedSlots,       icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-surface-200`}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-sm text-primary-600 font-semibold hover:underline">View all →</Link>
          </div>
          {todayAppts.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🗓️</div>
              <p className="font-semibold text-slate-700">No appointments today</p>
              <p className="text-sm text-slate-400 mt-1">Add slots to let patients book with you</p>
              <Link to="/doctor/slots" className="btn-outline mt-4 inline-flex mx-auto text-sm">Add Slots</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppts.map((appt) => {
                const cfg = statusConfig[appt.status] || statusConfig.pending;
                return (
                  <div key={appt._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                    <div className="text-center bg-primary-50 rounded-xl px-3 py-2 shrink-0 min-w-[56px]">
                      <p className="text-xs text-primary-500 font-medium">TIME</p>
                      <p className="text-sm font-bold text-primary-700">{appt.startTime}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                      {appt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{appt.patient?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{appt.reason || 'No reason provided'}</p>
                    </div>
                    <span className={`badge ${cfg.cls} shrink-0`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile summary + quick links */}
        <div className="space-y-4">
          {profile && (
            <div className="card gradient-card border-primary-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-200 flex items-center justify-center font-bold text-primary-800 text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">Dr. {user.name}</p>
                  <p className="text-sm text-primary-600">{profile.specialty}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p>🎓 {profile.experience} years experience</p>
                <p>💰 ₹{profile.consultationFee} per consultation</p>
                {profile.clinicAddress && <p>📍 {profile.clinicAddress}</p>}
              </div>
              <Link to="/doctor/profile" className="btn-outline w-full mt-4 text-sm">Edit Profile</Link>
            </div>
          )}

          <div className="card">
            <h3 className="font-bold text-slate-900 mb-3">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: '/doctor/slots', label: 'Manage Availability', icon: '🕐' },
                { to: '/doctor/appointments', label: 'All Appointments', icon: '📋' },
                { to: '/doctor/profile', label: 'My Profile', icon: '👤' },
              ].map((l) => (
                <Link key={l.to} to={l.to}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors text-sm font-medium text-slate-700 hover:text-primary-700">
                  <span className="text-xl">{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>
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
