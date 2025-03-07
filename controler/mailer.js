const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const notifier = require('node-notifier');


// Setup transport using Gmail SMTP details
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Define POST route to handle email sending
router.post('/', async (req, res) => {
    console.log(req.body);
    const { name, email, message } = req.body;

    // Validate the required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields: name, email, or message.'
        });
    }


    // 🔹 **Email 1: Aapko (Admin) Jayega**
    const adminMailOptions = {
        from: `${name} <${email}>`, // Sender's Name & Email
        to: process.env.EMAIL_USER, // Aapka Email
        subject: `New message from ${name}`,
        text: message,
        // cc: email // Sender ko bhi copy jayegi
    };

    // 🔹 **Email 2: User Ko Confirmation Message**
    const userMailOptions = {
        from: process.env.EMAIL_USER,  // Use only verified Gmail ID
        to: email, // User ka Email
        subject: 'Thank you for contacting us!',
        html: `<p>Dear <strong>${name}</strong>,</p>
           <p>Thank you for reaching out to us.</p>
           <p>We have received your message: "<i>${message}</i>".</p>
           <p>Our team will get back to you soon.</p>
           <p>Best regards,</p>
           <p><b>Manish Kumar</b></p>`};

    try {
        // ✅ Admin Email Send Karein
        const adminInfo = await transporter.sendMail(adminMailOptions);
        console.log("📩 Admin Email Sent, Message ID:", adminInfo.messageId);

        // ✅ User Confirmation Email Send Karein
        const userInfo = await transporter.sendMail(userMailOptions);
        console.log("📩 User Email Sent, Message ID:", userInfo.messageId);

        notifier.notify({
            title: 'success',
            message: 'Emails sent successfully.',
            sound: true
        });

        res.status(200).json({
            status: 'success',
            message: `Emails sent successfully!`
        });
    } catch (error) {
        console.error("❌ Email sending error:", error); // Yeh line error print karega
        res.status(500).json({

            status: 'error',
            message: error.message
        });
    }
});


module.exports = router;