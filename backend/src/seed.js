/**
 * Seed script — populates the DB with 10 demo doctors + 2 demo patients + 1 admin
 * Run: node src/seed.js
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');

dotenv.config();

const User        = require('./models/User');
const Doctor      = require('./models/Doctor');
const Appointment = require('./models/Appointment');

// ── Stock photo URLs (Unsplash, free-to-use) ──────────────────────────────────
// Using UI Avatars + Unsplash sourced professional doctor headshots
const doctors = [
  {
    user: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43210',
      profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Cardiologist',
      qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
      experience: 12,
      bio: 'Dr. Sarah Mitchell is a board-certified cardiologist with over 12 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart failure management.',
      consultationFee: 800,
      clinicAddress: 'Suite 201, Heart Care Center, Mumbai',
      rating: 4.9,
      totalReviews: 312,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43211',
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Neurologist',
      qualifications: ['MBBS', 'DM Neurology', 'PhD'],
      experience: 15,
      bio: 'Dr. Rajesh Sharma is a leading neurologist specializing in epilepsy, migraines, and movement disorders. He has published over 40 research papers and is a visiting faculty at AIIMS.',
      consultationFee: 1000,
      clinicAddress: 'Block C, NeuroHealth Hospital, Delhi',
      rating: 4.8,
      totalReviews: 289,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Priya Patel',
      email: 'priya.patel@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43212',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Dermatologist',
      qualifications: ['MBBS', 'MD Dermatology', 'DNB'],
      experience: 8,
      bio: 'Dr. Priya Patel is a renowned dermatologist offering treatments for acne, eczema, psoriasis, and cosmetic skin care. She is known for her patient-centric approach and personalized treatment plans.',
      consultationFee: 600,
      clinicAddress: 'Skin Clinic, Koregaon Park, Pune',
      rating: 4.7,
      totalReviews: 198,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Anil Kumar',
      email: 'anil.kumar@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43213',
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Orthopedist',
      qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
      experience: 18,
      bio: 'Dr. Anil Kumar is an orthopedic surgeon with extensive experience in joint replacement, sports injuries, and spine surgery. He has performed over 3000 successful surgeries.',
      consultationFee: 900,
      clinicAddress: 'Bone & Joint Clinic, Bengaluru',
      rating: 4.9,
      totalReviews: 421,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Meera Nair',
      email: 'meera.nair@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43214',
      profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Pediatrician',
      qualifications: ['MBBS', 'MD Pediatrics', 'MRCPCH'],
      experience: 10,
      bio: 'Dr. Meera Nair is a compassionate pediatrician who has been caring for children from newborns to adolescents for a decade. She has a special interest in developmental pediatrics and childhood nutrition.',
      consultationFee: 500,
      clinicAddress: 'Little Stars Clinic, Chennai',
      rating: 4.8,
      totalReviews: 267,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Vikram Desai',
      email: 'vikram.desai@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43215',
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Psychiatrist',
      qualifications: ['MBBS', 'MD Psychiatry', 'CBT Certified'],
      experience: 9,
      bio: 'Dr. Vikram Desai specializes in mood disorders, anxiety, PTSD, and addiction psychiatry. He uses an integrative approach combining medication management with psychotherapy.',
      consultationFee: 700,
      clinicAddress: 'MindCare Centre, Hyderabad',
      rating: 4.6,
      totalReviews: 154,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Anjali Singh',
      email: 'anjali.singh@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43216',
      profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face&seed=anjali',
    },
    profile: {
      specialty: 'General Physician',
      qualifications: ['MBBS', 'MD General Medicine'],
      experience: 7,
      bio: 'Dr. Anjali Singh is a trusted general physician providing comprehensive primary care. She focuses on preventive medicine, chronic disease management, and health screenings.',
      consultationFee: 400,
      clinicAddress: 'City Health Clinic, Jaipur',
      rating: 4.7,
      totalReviews: 342,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Suresh Menon',
      email: 'suresh.menon@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43217',
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Ophthalmologist',
      qualifications: ['MBBS', 'MS Ophthalmology', 'FICO'],
      experience: 14,
      bio: 'Dr. Suresh Menon is an experienced ophthalmologist specializing in cataract surgery, LASIK, glaucoma management, and diabetic retinopathy. He has performed over 5000 eye surgeries.',
      consultationFee: 650,
      clinicAddress: 'Vision Plus Eye Center, Kochi',
      rating: 4.8,
      totalReviews: 376,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Deepa Krishnamurthy',
      email: 'deepa.krishnamurthy@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43218',
      profileImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'Gynecologist',
      qualifications: ['MBBS', 'MS OBG', 'FRCOG'],
      experience: 16,
      bio: "Dr. Deepa Krishnamurthy is a highly experienced gynecologist and obstetrician specializing in high-risk pregnancies, laparoscopic surgery, and women's reproductive health.",
      consultationFee: 750,
      clinicAddress: "Women's Wellness Center, Bengaluru",
      rating: 4.9,
      totalReviews: 498,
      isApproved: true,
    },
  },
  {
    user: {
      name: 'Ravi Chandran',
      email: 'ravi.chandran@medilink.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91 98765 43219',
      profileImage: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
    },
    profile: {
      specialty: 'ENT Specialist',
      qualifications: ['MBBS', 'MS ENT', 'DNB'],
      experience: 11,
      bio: 'Dr. Ravi Chandran is an ENT specialist treating conditions of the ear, nose, and throat. He has expertise in endoscopic sinus surgery, cochlear implants, and voice disorders.',
      consultationFee: 550,
      clinicAddress: 'ENT Care Hospital, Coimbatore',
      rating: 4.7,
      totalReviews: 221,
      isApproved: true,
    },
  },
];

// Demo patients
const patients = [
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@demo.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 99887 76655',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@demo.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 99887 76656',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
];

// Admin
const admin = {
  name: 'Admin User',
  email: 'admin@medilink.com',
  password: 'admin123',
  role: 'admin',
  phone: '+91 99887 00000',
};

// ── Generate time slots for the next 7 days ───────────────────────────────────
function generateSlots(startHour = 9, count = 8, duration = 30) {
  const slots = [];
  const today = new Date();
  for (let day = 1; day <= 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    // skip Sundays
    if (date.getDay() === 0) continue;
    const dateStr = date.toISOString().split('T')[0];
    let h = startHour, m = 0;
    for (let i = 0; i < count; i++) {
      const start = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const tot   = h * 60 + m + duration;
      const end   = `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`;
      slots.push({ date: dateStr, startTime: start, endTime: end, isBooked: false });
      h = Math.floor(tot/60); m = tot%60;
    }
  }
  return slots;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({ role: { $in: ['doctor', 'patient'] }, email: { $regex: /@(medilink|demo)\.com$/ } }),
      Doctor.deleteMany({}),
    ]);
    // Delete old seeded admin if exists
    await User.deleteMany({ email: 'admin@medilink.com' });
    console.log('🗑️  Cleared old seed data');

    // Create admin
    const adminUser = await User.create(admin);
    console.log(`👤 Admin created: ${adminUser.email}`);

    // Create patients
    for (const p of patients) {
      await User.create(p);
      console.log(`👤 Patient created: ${p.email}`);
    }

    // Create doctors
    for (const d of doctors) {
      const user = await User.create(d.user);
      const slotHour  = 9 + Math.floor(Math.random() * 2); // start 9 or 10
      const slotCount = 6 + Math.floor(Math.random() * 4); // 6-9 slots per day
      await Doctor.create({
        user: user._id,
        ...d.profile,
        availableSlots: generateSlots(slotHour, slotCount),
      });
      console.log(`👨‍⚕️ Doctor created: Dr. ${user.name} (${d.profile.specialty})`);
    }

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo Credentials');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin   → admin@medilink.com        / admin123');
    console.log('Patient → arjun.mehta@demo.com      / patient123');
    console.log('Patient → sneha.reddy@demo.com      / patient123');
    console.log('Doctor  → sarah.mitchell@medilink.com / doctor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
