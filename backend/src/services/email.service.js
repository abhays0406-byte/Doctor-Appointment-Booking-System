const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password, not your Gmail password
  },
});

/**
 * Send a booking confirmation email to the patient
 */
const sendBookingConfirmation = async ({ patientEmail, patientName, doctorName, date, startTime, endTime, specialty }) => {
  const mailOptions = {
    from: `"Doctor Appointment" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: 'Appointment Booking Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
        <p>Hi <strong>${patientName}</strong>,</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="background:#f3f4f6;">
            <td style="padding:8px; border:1px solid #e5e7eb;"><strong>Doctor</strong></td>
            <td style="padding:8px; border:1px solid #e5e7eb;">Dr. ${doctorName}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;"><strong>Specialty</strong></td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${specialty}</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:8px; border:1px solid #e5e7eb;"><strong>Date</strong></td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${date}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;"><strong>Time</strong></td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${startTime} - ${endTime}</td>
          </tr>
        </table>
        <p>Please arrive 10 minutes early. If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
        <p style="color:#6b7280; font-size:12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send a cancellation email to the patient
 */
const sendCancellationEmail = async ({ patientEmail, patientName, doctorName, date, startTime }) => {
  const mailOptions = {
    from: `"Doctor Appointment" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: 'Appointment Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Hi <strong>${patientName}</strong>,</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${date}</strong> at <strong>${startTime}</strong> has been cancelled.</p>
        <p>You can book a new appointment anytime from our platform.</p>
        <p style="color:#6b7280; font-size:12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send appointment reminder email
 */
const sendReminderEmail = async ({ patientEmail, patientName, doctorName, date, startTime }) => {
  const mailOptions = {
    from: `"Doctor Appointment" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: 'Appointment Reminder – Tomorrow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reminder: Appointment Tomorrow</h2>
        <p>Hi <strong>${patientName}</strong>,</p>
        <p>This is a reminder that you have an appointment with <strong>Dr. ${doctorName}</strong> tomorrow, <strong>${date}</strong> at <strong>${startTime}</strong>.</p>
        <p>Please arrive 10 minutes early and bring any relevant medical records.</p>
        <p style="color:#6b7280; font-size:12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation, sendCancellationEmail, sendReminderEmail };
