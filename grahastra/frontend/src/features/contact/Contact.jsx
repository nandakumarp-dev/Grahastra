// src/components/Contact.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can connect this to your Django API later
    console.log("Form submitted:", formData);
    setStatus("✅ Message sent successfully!");
    setFormData({ subject: "", category: "general", message: "" });
  };

  return (
    <div className="container py-5 mt-4 contact-body">
      <h2 className="text-center mb-5 brand-text">📩 Contact Us</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <form className="form-box" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-control"
                id="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="report">Report an Issue</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn-purple">
                Send Message
              </button>
            </div>

            {status && (
              <div className="alert alert-success text-center mt-3">{status}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
