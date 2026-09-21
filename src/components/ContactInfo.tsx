"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import "../app/Contact_Us/Contact.css"; // Import contact-specific CSS

export default function ContactInfo() {
  return (
    <div className="contact-info-wrapper">
      <h2 className="contact-info-title">Get in Touch</h2>

      <div className="contact-info-item">
        <div className="contact-info-icon">
          <Phone />
        </div>
        <div>
          <div className="contact-info-label">Phone</div>
          <div className="contact-info-value">
            <a href="tel:+919810168635">+91 98101 68635</a> /{" "}
            <a href="tel:01125792874">011-25792874</a>
          </div>
        </div>
      </div>

      <div className="contact-info-item">
        <div className="contact-info-icon">
          <Mail />
        </div>
        <div>
          <div className="contact-info-label">Email</div>
          <div className="contact-info-value">
            <a href="mailto:contactus@loansaarthi.com">contactus@loansaarthi.com</a>
          </div>
        </div>
      </div>

      <div className="contact-info-item">
        <div className="contact-info-icon">
          <MapPin />
        </div>
        <div>
          <div className="contact-info-label">Address</div>
          <div className="contact-info-value">
            2151/9B Goswami Girdhari Lal Marg, New Patel Nagar, Shadipur, Delhi - 110008
          </div>
        </div>
      </div>

      <div className="contact-info-item">
        <div className="contact-info-icon">
          <Clock />
        </div>
        <div>
          <div className="contact-info-label">Working Hours</div>
          <div className="contact-info-value">
            Mon - Sat: 10:00 AM - 7:00 PM
          </div>
        </div>
      </div>
    </div>
  );
}