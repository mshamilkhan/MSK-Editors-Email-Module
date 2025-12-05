import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route to handle form submissions
app.post("/api/book-now", async (req, res) => {
  try {
    const { name, contact, email, service, description } = req.body;

    if (!name || !contact || !email || !service || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"MSK Editors" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `New Booking Request from ${name}`,
      html: `
        <h2>New Booking Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent from ${email} to ${process.env.TO_EMAIL}`);
    res.status(200).json({ message: "Booking email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));