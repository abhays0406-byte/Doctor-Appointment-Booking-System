const express = require('express');
const router  = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
} = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/',              protect, authorize('patient'), bookAppointment);
router.get('/my',             protect, authorize('patient'), getMyAppointments);
router.get('/doctor',         protect, authorize('doctor'),  getDoctorAppointments);
router.put('/:id/cancel',     protect, cancelAppointment);
router.put('/:id/reschedule', protect, authorize('patient'), rescheduleAppointment);
router.put('/:id/complete',   protect, authorize('doctor'),  completeAppointment);

module.exports = router;
