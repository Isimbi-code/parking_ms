const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email utility function
const sendEmail = async (options) => {


  const mailOptions = {
    from: 'Parking System <no-reply@parkingsystem.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html (you can add HTML version later)
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

const sendSlotApprovalEmail = async (user, slot, vehicle) => {
  const subject = 'Your Parking Slot Request Has Been Approved';
  const message = `Dear ${user.name},\n\nYour parking slot request for vehicle ${vehicle.plateNumber} has been approved.\n\nSlot Details:\n- Slot Number: ${slot.slotNumber}\n- Location: ${slot.location}\n- Size: ${slot.size}\n\nThank you for using our parking system.`;

  await sendEmail({
    email: user.email,
    subject,
    message,
  });
};

module.exports = {
  sendEmail,
  sendSlotApprovalEmail,
};