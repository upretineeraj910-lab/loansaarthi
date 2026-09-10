"use client";

import "../app/Contact_Us/Contact.css";
import "./map.css";

export default function Map() {
  return (
    <section className="contact-map-section" id="contact-map-section">
      <div id="map-container">
        <div className="maph2container">
          <h2 className="contact-map-title">
            Visit Our Office
          </h2></div>


        <div className="contact-map-wrapper">
          <iframe
            src="https://maps.google.com/maps?q=Loansaarthi%2C%20Metro%20Pillar%20Number%20248%2C%20Shadipur%2C%20New%20Delhi&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[350px] border-0 rounded-2xl"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ height: "220px" }}
          />
        </div>
      </div>
    </section>
  );
}