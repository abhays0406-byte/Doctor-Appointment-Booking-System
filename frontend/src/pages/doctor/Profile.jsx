import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ specialty:'', experience:'', bio:'', consultationFee:'', clinicAddress:'', qualifications:'' });

  useEffect(() => {
    api.get('/doctors/profile/me').then(({ data }) => {
      const d = data.doctor;
      setDoctor(d);
      setForm({
        specialty: d.specialty||'', experience: d.experience||'', bio: d.bio||'',
        consultationFee: d.consultationFee||'', clinicAddress: d.clinicAddress||'',
        qualifications: (d.qualifications||[]).join(', '),
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/doctors/profile/me', {
        ...form,
        qualifications: form.qualifications.split(',').map((q) => q.trim()).filter(Boolean),
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Manage your professional information</p>
        </div>
      </div>

      {doctor && !doctor.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl mt-0.5">⏳</span>
          <div>
            <p className="font-semibold text-amber-800">Awaiting Admin Approval</p>
            <p className="text-sm text-amber-600 mt-0.5">Your profile is under review. You won't appear in search results until approved.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-5">
          <h2 className="font-bold text-slate-900 pb-2 border-b border-surface-100">Professional Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Specialty</label>
              <input type="text" value={form.specialty} onChange={(e) => setForm({...form, specialty:e.target.value})}
                className="input-field" placeholder="e.g. Cardiologist" required />
            </div>
            <div>
              <label className="input-label">Experience (years)</label>
              <input type="number" value={form.experience} onChange={(e) => setForm({...form, experience:e.target.value})}
                className="input-field" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Consultation Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                <input type="number" value={form.consultationFee} onChange={(e) => setForm({...form, consultationFee:e.target.value})}
                  className="input-field pl-7" min="0" required />
              </div>
            </div>
            <div>
              <label className="input-label">Clinic Address</label>
              <input type="text" value={form.clinicAddress} onChange={(e) => setForm({...form, clinicAddress:e.target.value})}
                className="input-field" placeholder="123 Main St, Mumbai" />
            </div>
          </div>

          <div>
            <label className="input-label">Qualifications <span className="text-slate-400 font-normal">(comma separated)</span></label>
            <input type="text" value={form.qualifications} onChange={(e) => setForm({...form, qualifications:e.target.value})}
              className="input-field" placeholder="MBBS, MD Cardiology, FRCS" />
          </div>

          <div>
            <label className="input-label">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({...form, bio:e.target.value})}
              className="input-field resize-none" rows={4}
              placeholder="Tell patients about your expertise, approach, and experience..." />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3.5 text-base">
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            : 'Save Changes'
          }
        </button>
      </form>
    </div>
  );
}
