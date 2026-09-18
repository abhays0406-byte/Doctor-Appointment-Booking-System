import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ManageSlots() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [adding, setAdding] = useState(false);
  const [bulk, setBulk] = useState({ date: '', startHour: '09', duration: '30', count: '8' });

  const fetchProfile = () => {
    setLoading(true);
    api.get('/doctors/profile/me').then(({ data }) => setDoctor(data.doctor)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime) return toast.error('Fill all slot fields');
    setAdding(true);
    try {
      await api.post('/doctors/slots', { slots: [form] });
      toast.success('Slot added');
      setForm({ date: '', startTime: '', endTime: '' });
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setAdding(false); }
  };

  const handleBulk = async () => {
    if (!bulk.date) return toast.error('Select a date');
    const slots = [];
    let h = parseInt(bulk.startHour), m = 0;
    const dur = parseInt(bulk.duration), cnt = parseInt(bulk.count);
    for (let i = 0; i < cnt; i++) {
      const start = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const tot = h * 60 + m + dur;
      const end = `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`;
      slots.push({ date: bulk.date, startTime: start, endTime: end });
      h = Math.floor(tot/60); m = tot%60;
    }
    try {
      await api.post('/doctors/slots', { slots });
      toast.success(`${slots.length} slots generated`);
      fetchProfile();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (slotId) => {
    try {
      await api.delete(`/doctors/slots/${slotId}`);
      toast.success('Slot removed');
      fetchProfile();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot delete booked slot'); }
  };

  if (loading) return <Spinner />;

  const slots = doctor?.availableSlots || [];
  const grouped = slots.reduce((acc, s) => { (acc[s.date] = acc[s.date] || []).push(s); return acc; }, {});
  const freeCount = slots.filter((s) => !s.isBooked).length;
  const bookedCount = slots.filter((s) => s.isBooked).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Manage Availability</h1>
          <p className="section-subtitle">Set your consultation slots for patients to book</p>
        </div>
      </div>

      {/* Slot summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: slots.length, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Available', value: freeCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Booked', value: bookedCount, color: 'text-primary-700', bg: 'bg-primary-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-surface-200`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.label} Slots</p>
          </div>
        ))}
      </div>

      {/* Add single slot */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-4">Add Single Slot</h2>
        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="input-label">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex-1 min-w-[110px]">
            <label className="input-label">Start Time</label>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" />
          </div>
          <div className="flex-1 min-w-[110px]">
            <label className="input-label">End Time</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" />
          </div>
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? 'Adding...' : '+ Add'}
          </button>
        </form>
      </div>

      {/* Bulk generation */}
      <div className="card border-accent-200 bg-gradient-blue">
        <h2 className="font-bold text-slate-900 mb-1">⚡ Bulk Generate Slots</h2>
        <p className="text-sm text-slate-500 mb-4">Auto-generate consecutive slots for a day</p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="input-label">Date</label>
            <input type="date" value={bulk.date} onChange={(e) => setBulk({ ...bulk, date: e.target.value })}
              className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="input-label">Start at</label>
            <select value={bulk.startHour} onChange={(e) => setBulk({ ...bulk, startHour: e.target.value })} className="input-field">
              {Array.from({ length: 14 }, (_, i) => i + 7).map((h) => (
                <option key={h} value={String(h).padStart(2,'0')}>{String(h).padStart(2,'0')}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Duration</label>
            <select value={bulk.duration} onChange={(e) => setBulk({ ...bulk, duration: e.target.value })} className="input-field">
              {['15','20','30','45','60'].map((d) => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
          <div className="w-20">
            <label className="input-label">Count</label>
            <input type="number" value={bulk.count} onChange={(e) => setBulk({ ...bulk, count: e.target.value })}
              className="input-field" min="1" max="20" />
          </div>
          <button onClick={handleBulk} disabled={!bulk.date} className="btn-primary">Generate</button>
        </div>
      </div>

      {/* Slots display */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-4">Your Slots</h2>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-slate-400 text-sm">No slots yet. Add some above!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([date, daySlots]) => {
              const d = new Date(date);
              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary-600 text-white rounded-xl px-3 py-1.5 text-center shrink-0">
                      <p className="text-xs font-medium uppercase">{d.toLocaleDateString('en',{weekday:'short'})}</p>
                      <p className="text-lg font-extrabold leading-none">{d.getDate()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{d.toLocaleDateString('en',{month:'long',year:'numeric'})}</p>
                      <p className="text-xs text-slate-400">{daySlots.length} slot{daySlots.length!==1?'s':''}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-2">
                    {daySlots.map((slot) => (
                      <div key={slot._id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                          slot.isBooked
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-surface-200 text-slate-700 hover:border-red-200 group'
                        }`}
                      >
                        <span>{slot.startTime}–{slot.endTime}</span>
                        {slot.isBooked
                          ? <span className="text-xs text-emerald-500">●</span>
                          : (
                            <button onClick={() => handleDelete(slot._id)}
                              className="text-slate-300 hover:text-red-500 transition-colors ml-1" aria-label="Delete slot">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )
                        }
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
