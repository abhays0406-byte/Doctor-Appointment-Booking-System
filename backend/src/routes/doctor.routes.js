const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctorProfile,
  addSlots,
  deleteSlot,
  getSpecialties,
} = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getDoctors);
router.get('/specialties', getSpecialties);
router.get('/:id', getDoctorById);

// Private doctor routes
router.get('/profile/me', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/profile/me', protect, authorize('doctor'), updateDoctorProfile);
router.post('/slots', protect, authorize('doctor'), addSlots);
router.delete('/slots/:slotId', protect, authorize('doctor'), deleteSlot);

module.exports = router;
