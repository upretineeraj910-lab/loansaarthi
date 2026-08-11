"use client";

import React, { useState } from "react";
import "../app/Contact_Us/Contact.css"; // Import contact-specific CSS

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.phone.trim()) newErrors.phone = "phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  return (
    <div className="contact-form-wrapper">
      <h2 className="contact-form-title">Send us a Message</h2>

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="contact-form-grid">
          <div>
            <input
              type="text"
              name="fullName"
              className={`contact-form-input ${errors.fullName ? "error" : ""}`}
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <p className="contact-form-error">{errors.fullName}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              className={`contact-form-input ${errors.email ? "error" : ""}`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="contact-form-error">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="number"
            name="phone"
            className="contact-form-input"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
              <p className="contact-form-error">{errors.phone}</p>
            )}
        </div>

        <div>
          <select
            name="service"
            className={`contact-form-select ${errors.service ? "error" : ""}`}
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">Select Service</option>
            <option value="personal-loan">Personal Loan</option>
            <option value="credit-card">Credit Card</option>
            <option value="business-loan">Business Loan</option>
            <option value="home-loan">Home Loan</option>
            <option value="education-loan">Education Loan</option>
            <option value="loan-against-property">Loan Against Property</option>
            <option value="balance-transfer">Loan Balance Transfer</option>
          </select>
          {errors.service && (
            <p className="contact-form-error">{errors.service}</p>
          )}
        </div>

        <div>
          <textarea
            name="message"
            rows={6}
            className={`contact-form-textarea ${errors.message ? "error" : ""}`}
            placeholder="How can we help?"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && (
            <p className="contact-form-error">{errors.message}</p>
          )}
        </div>

        <button type="submit" className="contact-form-submit">
          Send Message
        </button>
      </form>
    </div>
  );
}
