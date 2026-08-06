"use client";

import "../app/Contact_Us/Contact.css"; 

export default function Map() {
  return (
    // 'id' and 'className' ensure kiye hain taaki CSS mein "contact-map-section" catch kar paaye
    <section className="contact-map-section" id="contact-map-section">
      <div className="container" id="map-container">
        <h2 className="contact-map-title">Visit Our Office</h2>

        <div className="contact-map-wrapper">
          <iframe
            className="contact-map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.2407286364287!2d77.15297217626856!3d28.65250988317194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03fb8ae538cf%3A0xb74391ebca72a4d4!2sLoansaarthi!5e0!3m2!1sen!2sin!4v1785483593521!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen
            title="Office Location Map"
          />
        </div>
      </div>
    </section>
  );
}