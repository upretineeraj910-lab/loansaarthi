import Link from "next/link";
import styles from "@/app/home.module.css";

const FEATURES = [
  {
    title: "100% Digital Process",
    sub: "End-to-end online, paperless",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="14" y="5" width="20" height="38" rx="3.5" />
        <line x1="21" y1="38" x2="27" y2="38" />
      </svg>
    ),
  },
  {
    title: "Free Video Consultancy",
    sub: "Expert advice on video call",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="5" y="12" width="26" height="24" rx="4" />
        <path d="M31 21l12-6v18l-12-6z" />
      </svg>
    ),
  },
  {
    title: "Best Comparison of Rates & Policies",
    sub: "Compare & choose the best offer",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <line x1="24" y1="6" x2="24" y2="40" />
        <line x1="14" y1="42" x2="34" y2="42" />
        <line x1="8" y1="12" x2="40" y2="12" />
        <path d="M8 12l-5 14c0 3 10 3 10 0L8 12z" />
        <path d="M40 12l-5 14c0 3 10 3 10 0l-5-14z" />
      </svg>
    ),
  },
  {
    title: "Consolidate Today, Celebrate Tomorrow",
    sub: "Convert Your Multiple High-interest App Loan, Credit Card Outstanding Loans into One Low EMI",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10l16-6z" />
        <path d="M17 24l5 5 10-11" />
      </svg>
    ),
  },
];

export default function LuxuryHero() {
  return (
    <section id="home" className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Your Loan.
            <br />Your Eligiblity.
            <br />Our Expertise
          </h1>
          <p className={styles.sub}>
           We match your profile with 42+ Banks & NBFCs to get you the right loan,<br /> not just any loan. <br/>
           LoanSaarthi is <span className={styles.goldText}>ISO 9001:2015</span> and <span className={styles.goldText}>ISO 27001:2022</span> certified, tested and verified. Our credibility is validated by <span className={styles.goldText}>genuine reviews on Google</span>.
          </p>
          <div className={styles.actions}>
            <Link href="#loan-eligibility-form" className={styles.btnPrimary}>
              Check Eligibility
            </Link>
            <Link href="/talk-to-expert" className={styles.btnGhost}>
              Talk to Expert
            </Link>
          </div>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <span className={styles.badge}>Why Choose Loan Saarthi</span>
            <div className={styles.grid}>
              {FEATURES.map((f) => (
                <div key={f.title} className={styles.feature}>
                  <div className={styles.icon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
