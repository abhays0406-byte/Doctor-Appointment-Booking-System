const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status (activate/deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Also delete doctor profile if exists
    await Doctor.findOneAndDelete({ user: req.params.id });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors (including unapproved)
// @route   GET /api/admin/doctors
// @access  Private (admin)
const getAllDoctors = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = approved !== undefined ? { isApproved: approved === 'true' } : {};
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone profileImage isActive')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (admin)
const approveDoctor = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('user', 'name email');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    res.json({
      success: true,
      message: `Doctor ${isApproved ? 'approved' : 'rejected'}`,
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a doctor profile
// @route   DELETE /api/admin/doctors/:id
// @access  Private (admin)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Also delete the user account
    await User.findByIdAndDelete(doctor.user);

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (admin)
const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(filter);
    res.json({ success: true, total, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingDoctors,
      confirmedAppointments,
      cancelledAppointments,
      completedAppointments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Doctor.countDocuments({ isApproved: false }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.countDocuments({ status: 'completed' }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingDoctors,
        confirmedAppointments,
        cancelledAppointments,
        completedAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  deleteDoctor,
  getAllAppointments,
  getDashboardStats,
};
