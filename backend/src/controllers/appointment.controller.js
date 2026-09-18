const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const { sendBookingConfirmation, sendCancellationEmail } = require('../services/email.service');

// @desc    Book an appointment (no payment required)
// @route   POST /api/appointments
// @access  Private (patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, reason } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({ success: false, message: 'doctorId and slotId are required' });
    }

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const slot = doctor.availableSlots.id(slotId);
    if (!slot)        return res.status(404).json({ success: false, message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ success: false, message: 'Slot already booked' });

    // Mark slot as booked
    slot.isBooked = true;
    await doctor.save();

    // Create appointment
    const appointment = await Appointment.create({
      patient:   req.user._id,
      doctor:    doctorId,
      slotId,
      date:      slot.date,
      startTime: slot.startTime,
      endTime:   slot.endTime,
      reason:    reason || '',
      status:    'confirmed',
    });

    // Send confirmation email (non-blocking)
    try {
      await sendBookingConfirmation({
        patientEmail: req.user.email,
        patientName:  req.user.name,
        doctorName:   doctor.user.name,
        date:         slot.date,
        startTime:    slot.startTime,
        endTime:      slot.endTime,
        specialty:    doctor.specialty,
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient's own appointments
// @route   GET /api/appointments/my
// @access  Private (patient)
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name profileImage' } })
      .sort({ date: -1, startTime: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Private (doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone profileImage')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (patient | doctor | admin)
const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor  = req.user.role === 'doctor';
    const isAdmin   = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['cancelled', 'completed'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Appointment is already ${appointment.status}` });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason || '';
    await appointment.save();

    // Free up the slot
    const doctor = await Doctor.findById(appointment.doctor._id);
    const slot   = doctor?.availableSlots.id(appointment.slotId);
    if (slot) { slot.isBooked = false; await doctor.save(); }

    // Send cancellation email (non-blocking)
    try {
      await sendCancellationEmail({
        patientEmail: appointment.patient.email,
        patientName:  appointment.patient.name,
        doctorName:   appointment.doctor.user.name,
        date:         appointment.date,
        startTime:    appointment.startTime,
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reschedule an appointment (pick a new slot)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (patient)
const rescheduleAppointment = async (req, res) => {
  try {
    const { newSlotId } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['cancelled', 'completed'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot reschedule a ${appointment.status} appointment` });
    }

    const doctor  = await Doctor.findById(appointment.doctor);
    const oldSlot = doctor.availableSlots.id(appointment.slotId);
    const newSlot = doctor.availableSlots.id(newSlotId);

    if (!newSlot)        return res.status(404).json({ success: false, message: 'New slot not found' });
    if (newSlot.isBooked) return res.status(400).json({ success: false, message: 'New slot is already booked' });

    if (oldSlot) oldSlot.isBooked = false;
    newSlot.isBooked = true;
    await doctor.save();

    appointment.slotId    = newSlotId;
    appointment.date      = newSlot.date;
    appointment.startTime = newSlot.startTime;
    appointment.endTime   = newSlot.endTime;
    appointment.status    = 'rescheduled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment rescheduled', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Doctor marks appointment as completed
// @route   PUT /api/appointments/:id/complete
// @access  Private (doctor)
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctor');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'completed';
    if (req.body.notes) appointment.notes = req.body.notes;
    await appointment.save();

    res.json({ success: true, message: 'Appointment marked as completed', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
};
