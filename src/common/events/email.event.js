import EventEmitter from 'node:events';
import { sendEmail } from '../service/mail.service.js';

import { otpTemplate } from '../templates/templates.js';

export const emailEvent = new EventEmitter();


emailEvent.on('signup', async (data) => {
  try {
    const { email, otp } = data;


    await sendEmail({
      to: email,
      subject: "Confirm your email",
      html:otpTemplate({otp})
    });
    
    console.log("Email sent successfully in background");
  } catch (err) {
    console.error("Failed to send email:", err);
  }
});