const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors (with optional search filters)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialty, name, page = 1, limit = 10 } = req.query;

    // Build filter query
    let filter = { isApproved: true };

    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }

    // Get approved doctors, populate user info
    let query = Doctor.find(filter).populate({
      path: 'user',
      select: 'name email profileImage phone',
      match: name ? { name: { $regex: name, $options: 'i' } } : {},
    });

    const doctors = await query
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Filter out doctors where user didn't match name search
    const filtered = doctors.filter((d) => d.user !== null);

    res.json({ success: true, count: filtered.length, doctors: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'user',
      'name email profileImage phone'
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the logged-in doctor's own profile
// @route   GET /api/doctors/profile/me
// @access  Private (doctor)
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      'user',
      'name email profileImage phone'
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile/me
// @access  Private (doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    const { specialty, qualifications, experience, bio, consultationFee, clinicAddress } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { specialty, qualifications, experience, bio, consultationFee, clinicAddress },
      { new: true, runValidators: true }
    ).populate('user', 'name email profileImage phone');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add available time slots
// @route   POST /api/doctors/slots
// @access  Private (doctor)
const addSlots = async (req, res) => {
  try {
    const { slots } = req.body; // array of { date, startTime, endTime }

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide slots array' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Prevent duplicate slots
    for (const slot of slots) {
      const exists = doctor.availableSlots.some(
        (s) => s.date === slot.date && s.startTime === slot.startTime
      );
      if (!exists) {
        doctor.availableSlots.push(slot);
      }
    }

    await doctor.save();
    res.json({ success: true, message: 'Slots added successfully', availableSlots: doctor.availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a specific time slot
// @route   DELETE /api/doctors/slots/:slotId
// @access  Private (doctor)
const deleteSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const slot = doctor.availableSlots.id(req.params.slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ success: false, message: 'Cannot delete a booked slot' });
    }

    doctor.availableSlots.pull(req.params.slotId);
    await doctor.save();

    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all specialties (distinct)
// @route   GET /api/doctors/specialties
// @access  Public
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty', { isApproved: true });
    res.json({ success: true, specialties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctorProfile,
  addSlots,
  deleteSlot,
  getSpecialties,
};
