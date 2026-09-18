import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusConfig = {
  confirmed:   { label: 'Confirmed',   cls: 'badge-green',  dot: 'bg-emerald-400' },
  pending:     { label: 'Pending',     cls: 'badge-yellow', dot: 'bg-amber-400' },
  cancelled:   { label: 'Cancelled',   cls: 'badge-red',    dot: 'bg-red-400' },
  completed:   { label: 'Completed',   cls: 'badge-gray',   dot: 'bg-slate-300' },
  rescheduled: { label: 'Rescheduled', cls: 'badge-blue',   dot: 'bg-blue-400' },
};

const filters = ['all', 'confirmed', 'rescheduled', 'completed', 'cancelled'];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    api.get('/appointments/my')
      .then(({ data }) => setAppointments(data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    setCancelling(true);
    try {
      await api.put(`/appointments/${id}/cancel`, { cancellationReason: cancelReason });
      toast.success('Appointment cancelled');
      setCancelId(null);
      setCancelReason('');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  const filtered = activeFilter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === activeFilter);

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? appointments.length : appointments.filter((a) => a.status === f).length;
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">My Appointments</h1>
          <p className="section-subtitle">{appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              activeFilter === f
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
            }`}
          >
            <span className="capitalize">{f}</span>
            {counts[f] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                activeFilter === f ? 'bg-white/20 text-white' : 'bg-surface-100 text-slate-500'
              }`}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-slate-900">No appointments here</h3>
          <p className="text-slate-400 text-sm mt-1">Appointments in this category will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const doctorName = appt.doctor?.user?.name || 'Doctor';
            const cfg = statusConfig[appt.status] || statusConfig.pending;
            const canCancel = ['confirmed', 'pending', 'rescheduled'].includes(appt.status);

            return (
              <div key={appt._id} className="card space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg shrink-0">
                      {doctorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Dr. {doctorName}</p>
                      <p className="text-sm text-primary-600 font-medium">{appt.doctor?.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Date', value: appt.date },
                    { label: 'Time', value: `${appt.startTime} – ${appt.endTime}` },
                  ].map((d) => (
                    <div key={d.label} className="bg-surface-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-medium mb-1">{d.label}</p>
                      <p className={`text-sm font-semibold text-slate-700 ${d.cls || ''}`}>{d.value}</p>
                    </div>
                  ))}
                </div>

                {appt.reason && (
                  <div className="bg-surface-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-medium mb-1">Reason for visit</p>
                    <p className="text-sm text-slate-700">{appt.reason}</p>
                  </div>
                )}
                {appt.notes && (
                  <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
                    <p className="text-xs text-primary-600 font-semibold mb-1">Doctor's Notes</p>
                    <p className="text-sm text-slate-700">{appt.notes}</p>
                  </div>
                )}
                {appt.cancellationReason && (
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs text-red-500 font-semibold mb-1">Cancellation Reason</p>
                    <p className="text-sm text-slate-700">{appt.cancellationReason}</p>
                  </div>
                )}

                {/* Cancel flow */}
                {canCancel && (
                  <div>
                    {cancelId === appt._id ? (
                      <div className="space-y-3 bg-red-50 rounded-xl p-4 border border-red-100">
                        <p className="text-sm font-semibold text-red-700">Cancel this appointment?</p>
                        <textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="input-field resize-none text-sm" rows={2}
                          placeholder="Reason for cancellation (optional)..."
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleCancel(appt._id)} disabled={cancelling} className="btn-danger text-sm">
                            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                          </button>
                          <button onClick={() => setCancelId(null)} className="btn-secondary text-sm">Keep it</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelId(appt._id)}
                        className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        Cancel appointment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
