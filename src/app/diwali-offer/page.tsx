import type { Metadata } from "next";
import Link from "next/link";
import styles from "./diwali.module.css";
import DiwaliPopup from "./DiwaliPopup";

export const metadata: Metadata = {
  title: "Diwali Loan Offer | Personal Loan @ 10.25%* | LoanSaarthi",
  description:
    "Is Diwali par LoanSaarthi ke saath personal loan sirf 10.25%* se shuru. Credit card, loan app aur chhote loans ko ek hi EMI mein merge karein.",
  keywords: [
    "Diwali loan offer",
    "personal loan 10.25%",
    "loan consolidation",
    "credit card debt consolidation",
    "LoanSaarthi",
  ],
};

const APPLY_HREF = "/#apply"; // <- apni lead form / apply section ka link yahan daalo

const MERGE_ITEMS = [
  { icon: "💳", title: "Credit Card Outstanding", text: "Kai cards ka bill, high interest ke saath" },
  { icon: "📱", title: "Loan App Ke Loans", text: "Instant loan apps ke chhote-chhote, mehnge loans" },
  { icon: "🛍️", title: "BNPL & No-Cost EMI", text: "Alag-alag due dates ka jhanjhat" },
  { icon: "🏦", title: "Purane Personal Loans", text: "Zyada rate wale loans ko kam rate par laayein" },
];

const STEPS = [
  { n: "01", title: "Apply Karein", text: "2 minute mein form bharein aur OTP se verify karein." },
  { n: "02", title: "Best Offer Paayein", text: "Hum aapki profile ke hisaab se sahi bank match karte hain." },
  { n: "03", title: "Ek EMI, Ek Due Date", text: "Saare loans clear, sirf ek EMI ka tension." },
];

function Diya({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.diya} ${className}`} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.flame} />
      <span className={styles.wick} />
      <span className={styles.bowl} />
      <span className={styles.base} />
    </div>
  );
}

export default function DiwaliOfferPage() {
  const sparks = Array.from({ length: 28 }, (_, i) => ({
    "--x": `${(i * 37) % 100}%`,
    "--delay": `${(i * 0.7) % 9}s`,
    "--dur": `${7 + ((i * 3) % 6)}s`,
    "--size": `${2 + (i % 4)}px`,
  })) as React.CSSProperties[];

  return (
    <main className={styles.page}>
      <DiwaliPopup />
      {/* floating sparkles */}
      <div className={styles.sparks} aria-hidden="true">
        {sparks.map((s, i) => (
          <i key={i} style={s} />
        ))}
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>🪔 Diwali Special Offer</span>
        <h1 className={styles.title}>
          Roshan Karein Apni <span className={styles.gold}>Diwali</span>,
          <br />
          Loan Ke Tension Ke Bina
        </h1>
        <p className={styles.subtitle}>
          LoanSaarthi ke saath paayein personal loan sirf
        </p>

        <div className={styles.rateCard}>
          <div className={styles.rate}>
            10.25<small>%*</small>
          </div>
          <div className={styles.rateLabel}>p.a. se shuru &nbsp;•&nbsp; Personal Loan</div>
        </div>

        <Link href={APPLY_HREF} className={styles.cta}>
          Abhi Apply Karein
        </Link>
        <p className={styles.note}>*Rate aapki profile, income aur credit score par depend karta hai.</p>

        <div className={styles.diyaRow}>
          <Diya />
          <Diya className={styles.diyaBig} />
          <Diya />
        </div>
      </section>

      {/* CONSOLIDATION */}
      <section className={styles.section}>
        <span className={styles.eyebrow}>Loan Consolidation</span>
        <h2 className={styles.h2}>
          Sab Loans <span className={styles.gold}>Ek Jagah</span>, Ek EMI
        </h2>
        <p className={styles.lead}>
          Credit card, loan app aur is tarah ke bikhre hue loans ke alag-alag EMI aur due dates se
          pareshaan? Hum sabko merge karke ek single, kam interest wala loan banate hain.
        </p>

        <div className={styles.grid}>
          {MERGE_ITEMS.map((m) => (
            <div key={m.title} className={styles.card}>
              <div className={styles.icon}>{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.arrow} aria-hidden="true">⬇</div>

        <div className={styles.mergeResult}>
          <Diya className={styles.diyaSmall} />
          <div>
            <h3>1 Loan • 1 EMI • 1 Due Date</h3>
            <p>Kam interest, kam tension, aur better cash flow.</p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.section}>
        <h2 className={styles.h2}>Kyun <span className={styles.gold}>LoanSaarthi</span>?</h2>
        <ul className={styles.perks}>
          <li>✨ Personal loan 10.25%* se shuru</li>
          <li>✨ Multiple banks ke offers ek jagah compare</li>
          <li>✨ Kam documentation, fast process</li>
          <li>✨ Expert guidance, har step par</li>
        </ul>
      </section>

      {/* STEPS */}
      <section className={styles.section}>
        <h2 className={styles.h2}>Kaise <span className={styles.gold}>Kaam</span> Karta Hai</h2>
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={styles.stepNo}>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.final}>
        <Diya className={styles.diyaBig} />
        <h2 className={styles.h2}>Is Diwali, Loan Bojh Nahi — Roshni Banao 🪔</h2>
        <Link href={APPLY_HREF} className={styles.cta}>
          Free Consultation Lein
        </Link>
        <p className={styles.note}>
          Offer terms & conditions apply. Final rate, eligibility aur approval partner bank ke
          credit policy par depend karte hain.
        </p>
      </section>
    </main>
  );
}
