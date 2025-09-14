const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",   
      auth: {
        user: "glaciergoodness@gmail.com",
        pass: "wxfz hxqs juaq hhom",
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="color: #555; font-size: 16px;">
            Thank you for signing up! Please use the following OTP to verify your email:
          </p>
          <h1 style="color: #00ffa2; letter-spacing: 3px;">${otp}</h1>
          <p style="color: #777; font-size: 14px; margin-top: 20px;">
            This code will expire in <b>10 minutes</b>. If you didn’t request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"My App" <jeebanjyoti.mallik@ap2l.ai>`,
      to,
      subject: "Your Verification Code",
      text: `Your OTP is: ${otp}`, // fallback plain text
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
