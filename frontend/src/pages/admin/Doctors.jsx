import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchDoctors = () => {
    setLoading(true);
    const params = filter === 'all' ? {} : { approved: filter === 'approved' };
    api.get('/admin/doctors', { params }).then(({ data }) => setDoctors(data.doctors)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, [filter]);

  const handleApprove = async (id, isApproved) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`, { isApproved });
      toast.success(`Doctor ${isApproved ? 'approved' : 'approval revoked'}`);
      fetchDoctors();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor and their account? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success('Doctor deleted');
      fetchDoctors();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const counts = {
    all: doctors.length,
    approved: doctors.filter((d) => d.isApproved).length,
    pending: doctors.filter((d) => !d.isApproved).length,
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Manage Doctors</h1>
          <p className="section-subtitle">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','approved','pending'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border capitalize transition-all ${
              filter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
            }`}>
            {f}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${filter===f?'bg-white/20 text-white':'bg-surface-100 text-slate-500'}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {doctors.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <p className="text-slate-400">No doctors found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="card">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center text-accent-700 font-extrabold text-xl shrink-0">
                    {doc.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. {doc.user?.name}</p>
                    <p className="text-sm text-primary-600 font-medium">{doc.specialty}</p>
                    <p className="text-xs text-slate-400">{doc.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${doc.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                    {doc.isApproved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                  <span className={`badge ${doc.user?.isActive ? 'badge-teal' : 'badge-red'}`}>
                    {doc.user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="badge badge-gray">🎓 {doc.experience} yrs</span>
                <span className="badge badge-gray">💰 ₹{doc.consultationFee}</span>
                {doc.clinicAddress && <span className="badge badge-gray">📍 {doc.clinicAddress}</span>}
              </div>

              {doc.bio && <p className="text-sm text-slate-500 mt-3 line-clamp-2">{doc.bio}</p>}

              <div className="mt-4 pt-4 border-t border-surface-100 flex flex-wrap gap-2">
                {!doc.isApproved ? (
                  <button onClick={() => handleApprove(doc._id, true)} className="btn-primary text-sm">
                    ✅ Approve Doctor
                  </button>
                ) : (
                  <button onClick={() => handleApprove(doc._id, false)} className="btn-secondary text-sm">
                    Revoke Approval
                  </button>
                )}
                <button onClick={() => handleDelete(doc._id)} className="btn-danger text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
