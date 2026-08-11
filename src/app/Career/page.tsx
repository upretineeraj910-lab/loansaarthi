"use client";
import Link from "next/link";
import "./Career.css";

export default function CareerPage() {
  // Sample job data
  const positions = [
    {
      id: 1,
      title: "Loan Relationship Manager",
      type: "full-time",
      location: "New Delhi",
    },
    {
      id: 2,
      title: "Credit Analyst",
      type: "full-time",
      location: "Mumbai",
    },
    {
      id: 3,
      title: "Business Development Executive",
      type: "full-time",
      location: "Bangalore",
    },
    {
      id: 4,
      title: "Customer Support Specialist",
      type: "full-time",
      location: "Remote",
    },
  ];

  const stats = [
    { number: "50+", label: "Open Positions" },
    { number: "200+", label: "Team Members" },
    { number: "15+", label: "Offices" },
    { number: "5+", label: "Years of Excellence" },
  ];

  const reasons = [
    { icon: "🚀", title: "Fast Growth", desc: "Rapid career growth in fintech" },
    { icon: "💡", title: "Innovation", desc: "Work with latest fintech tech" },
    { icon: "🤝", title: "Great Culture", desc: "Supportive team environment" },
    { icon: "📈", title: "Learning", desc: "Continuous learning & development" },
    { icon: "🏆", title: "Recognition", desc: "Your work gets noticed" },
    { icon: "🌍", title: "Impact", desc: "Help people achieve financial goals" },
  ];

  const culture = [
    { icon: "🤝", title: "Collaborative", desc: "Team first approach" },
    { icon: "💚", title: "Empathetic", desc: "We care for our people" },
    { icon: "⭐", title: "Excellence", desc: "Strive for the best" },
    { icon: "🔓", title: "Transparent", desc: "Open communication" },
  ];

  return (
    <main className="career-page">
      {/* HERO SECTION */}
      <section className="career-hero">
        <div className="container">
          <div className="career-hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">Join Our Team</span>
            </div>

            <h1>
              Build Your Career <br />
              <span>With LoanSaarthi</span>
            </h1>

            <p>
              Help people achieve their financial dreams. Join India's
              fastest-growing fintech platform and make a real difference.
            </p>

            <div className="career-stats">
              {stats.map((stat, i) => (
                <div key={i} className="career-stat-item">
                  <div className="career-stat-number">{stat.number}</div>
                  <div className="career-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN US */}
      <section className="why-join">
        <div className="container">
          <div className="why-join-header">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">Why LoanSaarthi</span>
            </div>
            <h2>
              Why Join <span>Us?</span>
            </h2>
            <p>We believe in creating an environment where you can thrive</p>
          </div>

          <div className="why-join-grid">
            {reasons.map((item, i) => (
              <div key={i} className="why-join-card">
                <div className="why-join-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="open-positions">
        <div className="container">
          <div className="open-positions-header">
            <h2>
              Open <span>Positions</span>
            </h2>
            <p>Find the perfect role for you</p>
          </div>

          {positions.length > 0 ? (
            <div className="positions-list">
              {positions.map((job) => (
                <div key={job.id} className="position-item">
                  <div className="position-info">
                    <span className="position-title">{job.title}</span>
                    <span className={`position-tag ${job.type}`}>
                      {job.type.replace("-", " ")}
                    </span>
                    <span className="position-location">
                      📍 {job.location}
                    </span>
                  </div>
                  <span className="position-arrow">→</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-positions">
              <div className="no-positions-icon">🔍</div>
              <h3>No Open Positions Right Now</h3>
              <p>
                We're always looking for talented people. Send us your resume
                and we'll reach out when something matches.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CULTURE */}
      <section className="culture-section">
        <div className="container">
          <div className="culture-header">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">Our Culture</span>
            </div>
            <h2>How We Work</h2>
            <p>Our values define who we are and how we work together</p>
          </div>

          <div className="culture-grid">
            {culture.map((item, i) => (
              <div key={i} className="culture-item">
                <div className="culture-item-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="career-cta">
        <div className="container">
          <h2>
            Ready to <span>Join Us?</span>
          </h2>
          <p>Take the first step towards an exciting career at LoanSaarthi</p>
          <div className="career-cta-buttons">
            <Link href="/Career/apply" className="btn-primary">
              View All Openings
            </Link>
            <Link href="/Contact_Us" className="btn-outline">
              Send Your CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}