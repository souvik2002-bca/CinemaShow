const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/ /g, ''), // Remove spaces if accidentally pasted
      },
    });

    const mailOptions = {
      from: 'Cinema Booking <no-reply@cinemabooking.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (error) {
    console.error('Email could not be sent', error);
    return false;
  }
};

module.exports = sendEmail;
