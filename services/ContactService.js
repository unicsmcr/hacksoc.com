"use strict";

const nodemailer = require('nodemailer');

exports.sendEmail = (sender, body) => {
  const transporter = nodemailer.createTransport({
    host: 'server102.web-hosting.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.CONTACT_EMAIL,
    to: process.env.CONTACT_EMAIL,
    subject: sender,
    text: body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
