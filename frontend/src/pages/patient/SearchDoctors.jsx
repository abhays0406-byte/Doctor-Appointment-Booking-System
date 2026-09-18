import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';

const specialtyIcons = {
  Cardiologist: '❤️', Dermatologist: '🧴', Neurologist: '🧠',
  Orthopedist: '🦴', Pediatrician: '👶', Psychiatrist: '🧘',
  'General Physician': '🩺', Ophthalmologist: '👁️',
  Gynecologist: '🌸', 'ENT Specialist': '👂',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      {rating > 0 && <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}

function DoctorCard({ doctor }) {
  const name      = doctor.user?.name || 'Doctor';
  const photo     = doctor.user?.profileImage;
  const icon      = specialtyIcons[doctor.specialty] || '🩺';
  const freeSlots = doctor.availableSlots?.filter((s) => !s.isBooked).length || 0;

  return (
    <div className="card-hover flex flex-col h-full group">
      {/* Photo header */}
      <div className="relative mb-4">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar src={photo} name={name} size="lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-sm" title="Available" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-slate-900 truncate text-base">Dr. {name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm">{icon}</span>
              <span className="text-sm text-primary-600 font-semibold">{doctor.specialty}</span>
            </div>
            <StarRating rating={doctor.rating} />
            {doctor.totalReviews > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">{doctor.totalReviews} reviews</p>
            )}
          </div>
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="badge badge-teal text-xs">🎓 {doctor.experience} yrs</span>
        {doctor.clinicAddress && (
          <span className="badge badge-gray text-xs">📍 {doctor.clinicAddress.split(',')[0]}</span>
        )}
        {freeSlots > 0 && (
          <span className="badge badge-green text-xs">✅ {freeSlots} slots free</span>
        )}
      </div>

      {/* Qualifications */}
      {doctor.qualifications?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {doctor.qualifications.slice(0, 3).map((q, i) => (
            <span key={i} className="text-xs bg-surface-100 text-slate-500 px-2 py-0.5 rounded-lg font-medium">{q}</span>
          ))}
        </div>
      )}

      {/* Bio */}
      {doctor.bio && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">{doctor.bio}</p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-100">
        <div>
          <p className="text-xs text-slate-400">Consultation fee</p>
          <p className="text-lg font-extrabold text-slate-900">₹{doctor.consultationFee}</p>
        </div>
        <Link to={`/patient/doctor/${doctor._id}`} className="btn-primary text-sm">
          Book Now →
        </Link>
      </div>
    </div>
  );
}

export default function SearchDoctors() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors]         = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [filters, setFilters]         = useState({ name: '', specialty: searchParams.get('specialty') || '' });
  const [activeSpecialty, setActiveSpecialty] = useState(searchParams.get('specialty') || '');

  useEffect(() => {
    api.get('/doctors/specialties').then(({ data }) => setSpecialties(data.specialties));
    fetchDoctors({ specialty: searchParams.get('specialty') || '' });
  }, []);

  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors', { params });
      setDoctors(data.doctors);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors({ name: filters.name, specialty: filters.specialty });
    setActiveSpecialty(filters.specialty);
  };

  const handleSpecialtyClick = (s) => {
    const spec = activeSpecialty === s ? '' : s;
    setActiveSpecialty(spec);
    setFilters({ ...filters, specialty: spec });
    fetchDoctors({ name: filters.name, specialty: spec });
  };

  const handleReset = () => {
    setFilters({ name: '', specialty: '' });
    setActiveSpecialty('');
    fetchDoctors();
  };

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="section-title">Find a Doctor</h1>
          <p className="section-subtitle">
            {loading ? 'Searching...' : `${doctors.length} verified specialist${doctors.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="card flex flex-wrap gap-3 items-end p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="input-label">Doctor Name</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="input-field pl-9" placeholder="Search doctor name..." />
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="input-label">Specialty</label>
          <select value={filters.specialty} onChange={(e) => setFilters({ ...filters, specialty: e.target.value })} className="input-field">
            <option value="">All Specialties</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" onClick={handleReset} className="btn-secondary">Reset</button>
        </div>
      </form>

      {/* Specialty chips */}
      <div className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <button key={s} onClick={() => handleSpecialtyClick(s)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
              activeSpecialty === s
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
            }`}>
            <span>{specialtyIcons[s] || '🩺'}</span>{s}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : doctors.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-slate-900 mb-2">No doctors found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search filters</p>
          <button onClick={handleReset} className="btn-outline mt-4 mx-auto">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
        </div>
      )}
    </div>
  );
}
