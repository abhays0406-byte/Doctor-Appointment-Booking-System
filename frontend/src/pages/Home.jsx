import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const specialties = [
  { name: 'Cardiologist',      icon: '❤️',  color: 'bg-red-50    text-red-600    border-red-100' },
  { name: 'Dermatologist',     icon: '🧴',  color: 'bg-pink-50   text-pink-600   border-pink-100' },
  { name: 'Neurologist',       icon: '🧠',  color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { name: 'Orthopedist',       icon: '🦴',  color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Pediatrician',      icon: '👶',  color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { name: 'Psychiatrist',      icon: '🧘',  color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { name: 'General Physician', icon: '🩺',  color: 'bg-teal-50   text-teal-600   border-teal-100' },
  { name: 'Ophthalmologist',   icon: '👁️',  color: 'bg-cyan-50   text-cyan-600   border-cyan-100' },
];

const stats = [
  { value: '500+', label: 'Verified Doctors' },
  { value: '50K+', label: 'Happy Patients' },
  { value: '20+',  label: 'Specialties' },
  { value: '4.9★', label: 'Average Rating' },
];

// Featured doctors — using seeded Unsplash photos
const featuredDoctors = [
  {
    name: 'Sarah Mitchell',
    specialty: 'Cardiologist',
    experience: 12,
    rating: 4.9,
    reviews: 312,
    fee: 800,
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Rajesh Sharma',
    specialty: 'Neurologist',
    experience: 15,
    rating: 4.8,
    reviews: 289,
    fee: 1000,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Priya Patel',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.7,
    reviews: 198,
    fee: 600,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Deepa Krishnamurthy',
    specialty: 'Gynecologist',
    experience: 16,
    rating: 4.9,
    reviews: 498,
    fee: 750,
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Patient',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    text: 'MediLink made it incredibly easy to find a cardiologist and book an appointment within minutes. The confirmation email was instant!',
    rating: 5,
  },
  {
    name: 'Sneha Reddy',
    role: 'Patient',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    text: 'I love how I can see the doctor\'s availability in real time and pick a slot that works for me. No more waiting on hold.',
    rating: 5,
  },
  {
    name: 'Karthik Rao',
    role: 'Patient',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    text: 'Booked an appointment with Dr. Sharma for my mother. The whole process was smooth and the reminders were very helpful.',
    rating: 5,
  },
];

const steps = [
  { num: '01', title: 'Search a Doctor',    desc: 'Find doctors by specialty, name, or location.',           icon: '🔍' },
  { num: '02', title: 'Pick a Slot',        desc: 'Choose from real-time available time slots.',             icon: '📅' },
  { num: '03', title: 'Pay & Confirm',      desc: 'Complete payment securely via Razorpay.',                 icon: '💳' },
  { num: '04', title: 'Attend & Review',    desc: 'Visit the doctor and share your experience.',             icon: '⭐' },
];

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero -mt-8 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          {/* Text side */}
          <div className="px-8 sm:px-12 py-16 lg:py-20">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              500+ Verified Doctors Online
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Your Health,<br />
              <span className="text-primary-200">Our Priority</span>
            </h1>
            <p className="mt-5 text-lg text-primary-100 leading-relaxed max-w-md">
              Book appointments with top-rated doctors instantly. Secure payments, real-time slots, and email confirmations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link to={user.role === 'patient' ? '/patient/search' : user.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'}
                  className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                    Book Appointment
                  </Link>
                  <Link to="/login" className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Inline stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center">
                  <p className="text-xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-primary-200 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor photo collage */}
          <div className="hidden lg:flex items-center justify-center p-8 py-12 gap-4">
            <div className="flex flex-col gap-4">
              {featuredDoctors.slice(0,2).map((d) => (
                <div key={d.name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex items-center gap-3 w-56">
                  <img src={d.photo} alt={d.name}
                    className="w-12 h-12 rounded-xl object-cover object-top shrink-0"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${d.name}&background=0d9488&color=fff&size=96`; }} />
                  <div>
                    <p className="font-bold text-white text-sm">Dr. {d.name.split(' ')[1]}</p>
                    <p className="text-primary-200 text-xs">{d.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRow rating={5} />
                      <span className="text-xs text-primary-200">{d.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-8">
              {featuredDoctors.slice(2,4).map((d) => (
                <div key={d.name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex items-center gap-3 w-56">
                  <img src={d.photo} alt={d.name}
                    className="w-12 h-12 rounded-xl object-cover object-top shrink-0"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${d.name}&background=0d9488&color=fff&size=96`; }} />
                  <div>
                    <p className="font-bold text-white text-sm">Dr. {d.name.split(' ')[1]}</p>
                    <p className="text-primary-200 text-xs">{d.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRow rating={5} />
                      <span className="text-xs text-primary-200">{d.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="section-title">Browse by Specialty</h2>
          <p className="section-subtitle mt-2">Find the right specialist for your needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {specialties.map((s) => (
            <Link key={s.name}
              to={user ? `/patient/search?specialty=${s.name}` : '/register'}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${s.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold text-center leading-tight">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Doctors ── */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Top Rated Doctors</h2>
            <p className="section-subtitle mt-1">Hand-picked specialists trusted by thousands</p>
          </div>
          <Link to={user ? '/patient/search' : '/register'} className="btn-outline text-sm hidden sm:inline-flex">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDoctors.map((doc) => (
            <div key={doc.name} className="card-hover flex flex-col">
              {/* Photo */}
              <div className="relative mb-4">
                <img
                  src={doc.photo}
                  alt={`Dr. ${doc.name}`}
                  className="w-full h-48 object-cover object-top rounded-xl"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${doc.name}&background=ccfbf1&color=0d9488&size=200`; }}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-xs font-bold text-slate-800">{doc.rating}</span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900">Dr. {doc.name}</h3>
              <p className="text-sm text-primary-600 font-medium mt-0.5">{doc.specialty}</p>
              <p className="text-xs text-slate-400 mt-1">{doc.experience} yrs experience · {doc.reviews} reviews</p>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-100 mt-3">
                <p className="font-extrabold text-slate-900">₹{doc.fee}</p>
                <Link to={user ? '/patient/search' : '/register'} className="btn-primary text-xs py-2 px-3">
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="section-title">How MediLink Works</h2>
          <p className="section-subtitle mt-2">Get started in 4 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={step.num} className="card text-center hover:shadow-card-hover transition-shadow group">
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-primary-400 tracking-widest">{step.num}</span>
              <h3 className="font-bold text-slate-900 mt-1 mb-1">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="section-title">What Patients Say</h2>
          <p className="section-subtitle mt-2">Real experiences from real patients</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card hover:shadow-card-hover transition-shadow">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                <img src={t.photo} alt={t.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=f0fdfa&color=0d9488&size=80`; }} />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="relative overflow-hidden card gradient-card border-primary-100 text-center py-14">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #99f6e4 0%, transparent 50%)' }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-5 shadow-card-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Start your health journey today</h2>
            <p className="mt-3 text-slate-500 max-w-md mx-auto">
              Join 50,000+ patients who trust MediLink for their healthcare needs.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary px-8 py-3.5 text-base">Create Free Account</Link>
              <Link to="/login"    className="btn-outline px-8 py-3.5 text-base">Sign In</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
