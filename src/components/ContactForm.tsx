"use client";

import React, { useState } from "react";
import "../app/Contact_Us/Contact.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      setSuccessMsg('Thank you! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });

    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <h2 className="contact-form-title">Send us a Message</h2>

      {successMsg && (
        <div className="contact-form-status success">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="contact-form-status error">{errorMsg}</div>
      )}

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
            type="tel"
            name="phone"
            className={`contact-form-input ${errors.phone ? "error" : ""}`}
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
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

        <button 
          type="submit" 
          className="contact-form-submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}