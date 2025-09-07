const nodemailer = require("nodemailer");
const querystring = require("querystring");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    // Handle form submissions
    const contentType = req.headers["content-type"] || "";
    let data = {};
    if (contentType.includes("application/json")) {
      data = JSON.parse(body);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      data = querystring.parse(body);
    }

    const { name, email, message } = data;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be an App Password, not your normal Gmail password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${name}`,
      text: message,
    });

    return res.status(200).json({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: error.message || "Failed to send message" });
  }
};
