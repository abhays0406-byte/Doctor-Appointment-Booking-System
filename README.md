# MediLink — Doctor Appointment Booking System

A full-stack web application for booking doctor appointments. Built with React, Node.js/Express, MongoDB, and Tailwind CSS.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT (JSON Web Tokens)               |
| Email      | Nodemailer + Gmail                  |

---

## Features

### Patient
- Register / Login
- Search doctors by name or specialty
- View doctor profiles, ratings, qualifications, and available slots
- Book appointments instantly (no payment required)
- Cancel appointments
- Email confirmation on booking
- My Appointments dashboard with status tracking

### Doctor
- Register / Login (requires admin approval)
- Set availability — add single slots or bulk-generate by day
- View and manage patient appointments
- Mark appointments as completed with notes
- Edit professional profile

### Admin
- Dashboard with platform stats
- Approve / reject doctor registrations
- Manage all users (activate / deactivate / delete)
- View all appointments with status filters

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # auth, doctor, appointment, admin
│   │   ├── middleware/      # JWT auth, role-based access
│   │   ├── models/         # User, Doctor, Appointment
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Email (Nodemailer)
│   │   ├── utils/          # Token generation
│   │   ├── seed.js         # Demo data seeder
│   │   └── server.js       # Entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Spinner, Avatar
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── pages/          # patient/, doctor/, admin/, Home, Login, Register
│   │   ├── services/       # Axios API config
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── package.json            # Root — runs both with concurrently
├── start.bat               # Double-click to start everything
└── README.md
```

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Install dependencies

```bash
# From the root folder — installs everything
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Gmail App Password (not your regular Gmail password)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail"

### 3. Seed demo data (optional but recommended)

```bash
cd backend
node src/seed.js
```

This creates **10 doctors with real photos**, 2 patients, and 1 admin — all with time slots ready to book.

### 4. Run the app

**Single command from the root folder:**

```bash
npm start
```

Or double-click `start.bat`.

- Frontend → http://localhost:5173
- Backend API → http://localhost:5000

---

## Demo Credentials

| Role    | Email                          | Password   |
|---------|--------------------------------|------------|
| Admin   | admin@medilink.com             | admin123   |
| Patient | arjun.mehta@demo.com           | patient123 |
| Patient | sneha.reddy@demo.com           | patient123 |
| Doctor  | sarah.mitchell@medilink.com    | doctor123  |

---

## Seeded Doctors

| Doctor                   | Specialty        | Fee    |
|--------------------------|------------------|--------|
| Dr. Sarah Mitchell       | Cardiologist     | ₹800   |
| Dr. Rajesh Sharma        | Neurologist      | ₹1000  |
| Dr. Priya Patel          | Dermatologist    | ₹600   |
| Dr. Anil Kumar           | Orthopedist      | ₹900   |
| Dr. Meera Nair           | Pediatrician     | ₹500   |
| Dr. Vikram Desai         | Psychiatrist     | ₹700   |
| Dr. Anjali Singh         | General Physician| ₹400   |
| Dr. Suresh Menon         | Ophthalmologist  | ₹650   |
| Dr. Deepa Krishnamurthy  | Gynecologist     | ₹750   |
| Dr. Ravi Chandran        | ENT Specialist   | ₹550   |

Each doctor has 6–9 slots per day for the next 7 days pre-generated.

---

## API Endpoints

### Auth
| Method | Route                    | Access  |
|--------|--------------------------|---------|
| POST   | /api/auth/register       | Public  |
| POST   | /api/auth/login          | Public  |
| GET    | /api/auth/me             | Private |
| PUT    | /api/auth/profile        | Private |

### Doctors
| Method | Route                        | Access         |
|--------|------------------------------|----------------|
| GET    | /api/doctors                 | Public         |
| GET    | /api/doctors/specialties     | Public         |
| GET    | /api/doctors/:id             | Public         |
| GET    | /api/doctors/profile/me      | Doctor         |
| PUT    | /api/doctors/profile/me      | Doctor         |
| POST   | /api/doctors/slots           | Doctor         |
| DELETE | /api/doctors/slots/:slotId   | Doctor         |

### Appointments
| Method | Route                            | Access  |
|--------|----------------------------------|---------|
| POST   | /api/appointments                | Patient |
| GET    | /api/appointments/my             | Patient |
| GET    | /api/appointments/doctor         | Doctor  |
| PUT    | /api/appointments/:id/cancel     | Any     |
| PUT    | /api/appointments/:id/reschedule | Patient |
| PUT    | /api/appointments/:id/complete   | Doctor  |

### Admin
| Method | Route                              | Access |
|--------|------------------------------------|--------|
| GET    | /api/admin/stats                   | Admin  |
| GET    | /api/admin/users                   | Admin  |
| PUT    | /api/admin/users/:id/toggle-status | Admin  |
| DELETE | /api/admin/users/:id               | Admin  |
| GET    | /api/admin/doctors                 | Admin  |
| PUT    | /api/admin/doctors/:id/approve     | Admin  |
| DELETE | /api/admin/doctors/:id             | Admin  |
| GET    | /api/admin/appointments            | Admin  |
