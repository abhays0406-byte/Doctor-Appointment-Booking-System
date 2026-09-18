const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  deleteDoctor,
  getAllAppointments,
  getDashboardStats,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All admin routes are protected
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/appointments', getAllAppointments);

module.exports = router;
