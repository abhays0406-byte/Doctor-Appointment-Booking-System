import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = role select, 2 = form
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '', phone: '',
    specialty: '', consultationFee: '', experience: '', bio: '', clinicAddress: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone };
      if (form.role === 'doctor') {
        Object.assign(payload, {
          specialty: form.specialty,
          consultationFee: Number(form.consultationFee),
          experience: Number(form.experience),
          bio: form.bio,
          clinicAddress: form.clinicAddress,
        });
      }
      const user = await register(payload);
      toast.success('Account created! Welcome to MediLink 🎉');
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 — role selection
  if (step === 1) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Join MediLink</h1>
            <p className="text-slate-500 mt-2">How will you be using MediLink?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                role: 'patient',
                title: 'I\'m a Patient',
                desc: 'Book appointments, track health records, and connect with doctors.',
                icon: '🧑‍⚕️',
                color: 'border-primary-300 bg-primary-50',
                active: 'border-primary-600 bg-primary-50 ring-2 ring-primary-600',
              },
              {
                role: 'doctor',
                title: 'I\'m a Doctor',
                desc: 'Manage your schedule, connect with patients, and grow your practice.',
                icon: '👨‍⚕️',
                color: 'border-accent-300 bg-accent-50',
                active: 'border-accent-600 bg-accent-50 ring-2 ring-accent-500',
              },
            ].map((opt) => (
              <button
                key={opt.role}
                onClick={() => { setForm({ ...form, role: opt.role }); setStep(2); }}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-card-hover ${
                  form.role === opt.role ? opt.active : opt.color + ' hover:border-opacity-70'
                }`}
              >
                <span className="text-4xl block mb-3">{opt.icon}</span>
                <h3 className="font-bold text-slate-900 text-lg">{opt.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-primary-600 gap-1">
                  Get started <span>→</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2 — registration form
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setStep(1)} className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500">Registering as a <span className="font-semibold text-primary-600 capitalize">{form.role}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
          <div className="card space-y-4">
            <h2 className="font-bold text-slate-800">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="input-field" placeholder="Dr. Sarah Mitchell" required />
              </div>
              <div>
                <label className="input-label">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="+91 9876543210" />
              </div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  className="input-field" placeholder="Min. 6 characters" required />
              </div>
              <div>
                <label className="input-label">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  className="input-field" placeholder="Repeat password" required />
              </div>
            </div>
          </div>

          {/* Doctor extra fields */}
          {form.role === 'doctor' && (
            <div className="card space-y-4 border-accent-200">
              <h2 className="font-bold text-slate-800">Professional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Specialty</label>
                  <input type="text" name="specialty" value={form.specialty} onChange={handleChange}
                    className="input-field" placeholder="e.g. Cardiologist" required />
                </div>
                <div>
                  <label className="input-label">Consultation Fee (₹)</label>
                  <input type="number" name="consultationFee" value={form.consultationFee} onChange={handleChange}
                    className="input-field" placeholder="500" min="0" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Experience (years)</label>
                  <input type="number" name="experience" value={form.experience} onChange={handleChange}
                    className="input-field" placeholder="5" min="0" />
                </div>
                <div>
                  <label className="input-label">Clinic Address</label>
                  <input type="text" name="clinicAddress" value={form.clinicAddress} onChange={handleChange}
                    className="input-field" placeholder="123 Main St, Mumbai" />
                </div>
              </div>
              <div>
                <label className="input-label">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  className="input-field resize-none" rows={3}
                  placeholder="Brief introduction about your practice and expertise..." />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              : 'Create Account'
            }
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
