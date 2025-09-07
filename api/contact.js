export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Example: send email using Nodemailer
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or use your SMTP
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER, // where you want to receive messages
        subject: `New contact form message from ${name}`,
        text: message
      });

      return res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
