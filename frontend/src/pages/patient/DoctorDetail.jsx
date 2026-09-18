import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import toast from 'react-hot-toast';

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map((s) => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {rating > 0 && <span className="text-sm text-slate-500">{rating.toFixed(1)} ({reviews} reviews)</span>}
    </div>
  );
}

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason]         = useState('');
  const [booking, setBooking]       = useState(false);
  const [activeDate, setActiveDate] = useState(null);

  useEffect(() => {
    api.get(`/doctors/${id}`)
      .then(({ data }) => {
        setDoctor(data.doctor);
        const first = data.doctor.availableSlots?.find((s) => !s.isBooked)?.date;
        if (first) setActiveDate(first);
      })
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const availableSlots    = doctor?.availableSlots?.filter((s) => !s.isBooked) || [];
  const dates             = [...new Set(availableSlots.map((s) => s.date))].sort();
  const slotsForDate      = availableSlots.filter((s) => s.date === activeDate);

  const handleBooking = async () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    setBooking(true);
    try {
      await api.post('/appointments', {
        doctorId: doctor._id,
        slotId:   selectedSlot._id,
        reason,
      });
      toast.success('Appointment confirmed! Check your email.');
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return (
    <div className="card text-center py-16">
      <p className="text-slate-400">Doctor not found.</p>
      <Link to="/patient/search" className="btn-primary mt-4 mx-auto">Back to Search</Link>
    </div>
  );

  const photo = doctor.user?.profileImage;
  const name  = doctor.user?.name || '';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/patient/search" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — profile */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile card */}
          <div className="card">
            {/* Banner */}
            <div className="h-28 rounded-xl gradient-hero mb-0 -mx-6 -mt-6 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
            <div className="flex items-end gap-5 -mt-14 mb-4 px-1">
              <div className="ring-4 ring-white rounded-2xl shadow-lg shrink-0">
                <Avatar src={photo} name={name} size="xl" />
              </div>
              <div className="pb-1">
                <span className="badge badge-green text-xs mb-1">✅ Available Today</span>
                <h1 className="text-xl font-extrabold text-slate-900">Dr. {name}</h1>
                <p className="text-primary-600 font-semibold text-sm">{doctor.specialty}</p>
              </div>
            </div>

            <StarRating rating={doctor.rating} reviews={doctor.totalReviews} />

            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
              <span>🎓 <strong className="text-slate-700">{doctor.experience}</strong> yrs experience</span>
              {doctor.clinicAddress && <span>📍 {doctor.clinicAddress}</span>}
              {doctor.user?.phone && <span>📞 {doctor.user.phone}</span>}
            </div>

            {doctor.qualifications?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.qualifications.map((q, i) => (
                  <span key={i} className="badge badge-blue text-xs">{q}</span>
                ))}
              </div>
            )}

            {doctor.bio && (
              <div className="mt-5 pt-4 border-t border-surface-100">
                <h3 className="font-semibold text-slate-800 mb-2">About</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>

          {/* Slot picker */}
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-5">Select Appointment Slot</h2>
            {dates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-slate-400 text-sm">No available slots at the moment.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Date tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dates.map((date) => {
                    const d = new Date(date + 'T00:00:00');
                    const isToday = new Date().toISOString().split('T')[0] === date;
                    const slotCount = availableSlots.filter((s) => s.date === date).length;
                    return (
                      <button key={date} onClick={() => { setActiveDate(date); setSelectedSlot(null); }}
                        className={`shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all duration-150 min-w-[64px] ${
                          activeDate === date
                            ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                            : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
                        }`}>
                        <span className="text-xs font-semibold uppercase">{d.toLocaleDateString('en',{weekday:'short'})}</span>
                        <span className="text-xl font-extrabold leading-none my-0.5">{d.getDate()}</span>
                        <span className="text-xs">{d.toLocaleDateString('en',{month:'short'})}</span>
                        {isToday && <span className="text-xs font-bold text-emerald-400 mt-0.5">Today</span>}
                        <span className={`text-xs mt-1 ${activeDate === date ? 'text-primary-200' : 'text-slate-400'}`}>{slotCount} free</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                {activeDate && (
                  <div>
                    <p className="text-sm text-slate-500 mb-3 font-medium">
                      {slotsForDate.length} slot{slotsForDate.length !== 1 ? 's' : ''} on {activeDate}
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {slotsForDate.map((slot) => (
                        <button key={slot._id} onClick={() => setSelectedSlot(selectedSlot?._id === slot._id ? null : slot)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                            selectedSlot?._id === slot._id
                              ? 'bg-primary-600 text-white border-primary-600 shadow-sm scale-105'
                              : 'bg-surface-50 text-slate-700 border-surface-200 hover:border-primary-400 hover:bg-primary-50'
                          }`}>
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — booking panel */}
        <div className="space-y-5">
          {/* Fee card */}
          <div className="card gradient-card border-primary-100">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={photo} name={name} size="md" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Dr. {name}</p>
                <p className="text-xs text-primary-600">{doctor.specialty}</p>
              </div>
            </div>
            <div className="text-center py-3 bg-white rounded-xl border border-primary-100 mb-4">
              <p className="text-3xl font-extrabold text-primary-700">₹{doctor.consultationFee}</p>
              <p className="text-xs text-slate-400 mt-1">Per consultation</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Instant confirmation</div>
              <div className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Email confirmation sent</div>
              <div className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Free cancellation (24h prior)</div>
            </div>
          </div>

          {/* Confirm booking */}
          {selectedSlot ? (
            <div className="card border-primary-200 space-y-4">
              <h3 className="font-bold text-slate-900">Confirm Booking</h3>
              <div className="bg-primary-50 rounded-xl p-4 space-y-2 text-sm">
                {[
                  { label: 'Doctor', value: `Dr. ${name}` },
                  { label: 'Date',   value: selectedSlot.date },
                  { label: 'Time',   value: `${selectedSlot.startTime} – ${selectedSlot.endTime}` },
                  { label: 'Fee',    value: `₹${doctor.consultationFee}` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-slate-500">{r.label}</span>
                    <span className="font-semibold text-slate-800">{r.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="input-label">Reason for visit (optional)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                  className="input-field resize-none" rows={3} placeholder="Describe your symptoms..." />
              </div>
              <button onClick={handleBooking} disabled={booking} className="btn-primary w-full py-3.5 text-base">
                {booking
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</>
                  : 'Confirm Appointment'}
              </button>
              <p className="text-xs text-slate-400 text-center">Your appointment will be confirmed instantly</p>
            </div>
          ) : dates.length > 0 && (
            <div className="card border-dashed border-primary-300 bg-primary-50 text-center py-6">
              <p className="text-4xl mb-2">👈</p>
              <p className="text-sm text-primary-700 font-medium">Select a date and time slot to book</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
