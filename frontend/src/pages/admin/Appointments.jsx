import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const statusConfig = {
  confirmed:   { cls: 'badge-green',  label: 'Confirmed',   dot: 'bg-emerald-400' },
  pending:     { cls: 'badge-yellow', label: 'Pending',     dot: 'bg-amber-400' },
  cancelled:   { cls: 'badge-red',    label: 'Cancelled',   dot: 'bg-red-400' },
  completed:   { cls: 'badge-gray',   label: 'Completed',   dot: 'bg-slate-300' },
  rescheduled: { cls: 'badge-blue',   label: 'Rescheduled', dot: 'bg-blue-400' },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    api.get('/admin/appointments', { params })
      .then(({ data }) => { setAppointments(data.appointments); setTotal(data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const counts = ['all','confirmed','pending','rescheduled','completed','cancelled'];

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">All Appointments</h1>
          <p className="section-subtitle">{total} appointment{total !== 1 ? 's' : ''} across the platform</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {counts.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border capitalize transition-all ${
              filter === f ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-slate-400">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {['Patient', 'Doctor', 'Date & Time', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {appointments.map((appt) => {
                  const cfg = statusConfig[appt.status] || statusConfig.pending;
                  return (
                    <tr key={appt._id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                            {appt.patient?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{appt.patient?.name}</p>
                            <p className="text-xs text-slate-400">{appt.patient?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">Dr. {appt.doctor?.user?.name}</p>
                        <p className="text-xs text-primary-600">{appt.doctor?.specialty}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{appt.date}</p>
                        <p className="text-xs text-slate-400">{appt.startTime} – {appt.endTime}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                          <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
