import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusConfig = {
  confirmed:   { cls: 'badge-green',  label: 'Confirmed',   dot: 'bg-emerald-400' },
  pending:     { cls: 'badge-yellow', label: 'Pending',     dot: 'bg-amber-400' },
  cancelled:   { cls: 'badge-red',    label: 'Cancelled',   dot: 'bg-red-400' },
  completed:   { cls: 'badge-gray',   label: 'Completed',   dot: 'bg-slate-300' },
  rescheduled: { cls: 'badge-blue',   label: 'Rescheduled', dot: 'bg-blue-400' },
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [notes, setNotes] = useState({});
  const [actionId, setActionId] = useState(null);

  const fetchAppointments = () => {
    setLoading(true);
    api.get('/appointments/doctor').then(({ data }) => setAppointments(data.appointments)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleComplete = async (id) => {
    setActionId(id);
    try {
      await api.put(`/appointments/${id}/complete`, { notes: notes[id] || '' });
      toast.success('Marked as completed');
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setActionId(null); }
  };

  const handleCancel = async (id) => {
    setActionId(id);
    try {
      await api.put(`/appointments/${id}/cancel`, {});
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setActionId(null); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
  const counts = ['all','confirmed','rescheduled','completed','cancelled'].reduce((acc,f) => {
    acc[f] = f === 'all' ? appointments.length : appointments.filter((a) => a.status === f).length;
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Patient Appointments</h1>
          <p className="section-subtitle">{appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','confirmed','rescheduled','completed','cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === f ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
            }`}>
            <span className="capitalize">{f}</span>
            {counts[f] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${filter===f?'bg-white/20 text-white':'bg-surface-100 text-slate-500'}`}>{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-400">No appointments in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const cfg = statusConfig[appt.status] || statusConfig.pending;
            const isConfirmed = appt.status === 'confirmed';
            return (
              <div key={appt._id} className="card space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-lg shrink-0">
                      {appt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{appt.patient?.name}</p>
                      <p className="text-sm text-slate-400">{appt.patient?.email}</p>
                      {appt.patient?.phone && <p className="text-xs text-slate-400">{appt.patient?.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Date', value: appt.date },
                    { label: 'Time', value: `${appt.startTime} – ${appt.endTime}` },
                    { label: 'Fee Paid', value: `₹${appt.payment?.amount || 0}`, cls: 'text-emerald-600 font-bold' },
                  ].map((d) => (
                    <div key={d.label} className="bg-surface-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-medium mb-1">{d.label}</p>
                      <p className={`text-sm font-semibold text-slate-700 ${d.cls||''}`}>{d.value}</p>
                    </div>
                  ))}
                </div>

                {appt.reason && (
                  <div className="bg-surface-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-medium mb-1">Patient's Reason</p>
                    <p className="text-sm text-slate-700">{appt.reason}</p>
                  </div>
                )}
                {appt.notes && (
                  <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
                    <p className="text-xs text-primary-600 font-semibold mb-1">Consultation Notes</p>
                    <p className="text-sm text-slate-700 italic">{appt.notes}</p>
                  </div>
                )}

                {isConfirmed && (
                  <div className="space-y-3 pt-2 border-t border-surface-100">
                    <label className="input-label">Consultation Notes (optional)</label>
                    <textarea
                      value={notes[appt._id] || ''}
                      onChange={(e) => setNotes({ ...notes, [appt._id]: e.target.value })}
                      className="input-field resize-none text-sm" rows={2}
                      placeholder="Add post-consultation notes, prescriptions, or follow-up instructions..."
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleComplete(appt._id)} disabled={actionId === appt._id} className="btn-primary text-sm">
                        ✅ Mark Completed
                      </button>
                      <button onClick={() => handleCancel(appt._id)} disabled={actionId === appt._id} className="btn-danger text-sm">
                        Cancel
                      </button>
                    </div>
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
