import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import Map from "@/components/Map";
import "./Contact.css"; // Import contact-specific CSS

export const metadata = {
  title: "Contact Us | LoanSaarthi",
  description:
    "Get in touch with LoanSaarthi for Personal Loans, Credit Cards, Home Loans, Business Loans and financial assistance.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="contact-hero-badge">Contact Us</span>

          <h1 className="contact-hero-title">
            We're Here To Help
          </h1>

          <p className="contact-hero-text">
            Whether you have questions about Personal Loans, Credit Cards,
            Business Loans or Home Loans, our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="contact-section">
        <div className="container contact-grid">
          <div className="contact-grid-full">
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Map */}
      <Map />
    </>
  );
}