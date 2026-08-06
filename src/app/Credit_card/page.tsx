import "./credit-card.css";

const cardTypes = [
  {
    title: "Cashback Cards",
    description:
      "Earn cashback on eligible everyday spending such as shopping, dining, and other selected categories.",
    icon: "₹",
  },
  {
    title: "Rewards Cards",
    description:
      "Earn reward points on eligible transactions and redeem them according to the card issuer's programme.",
    icon: "★",
  },
  {
    title: "Travel Cards",
    description:
      "Designed for frequent travellers with travel-focused rewards and selected travel-related benefits.",
    icon: "✈",
  },
  {
    title: "Fuel Cards",
    description:
      "May provide rewards or savings on eligible fuel transactions, subject to issuer terms and conditions.",
    icon: "⌁",
  },
];

const benefits = [
  {
    number: "01",
    title: "Convenient payments",
    text: "Use a credit card for eligible purchases without paying the full amount immediately, subject to your available credit limit.",
  },
  {
    number: "02",
    title: "Rewards and cashback",
    text: "Depending on the card, you may earn reward points, cashback, discounts, or other benefits on eligible transactions.",
  },
  {
    number: "03",
    title: "Credit building",
    text: "Responsible repayment and timely bill payments can help maintain a healthy credit history over time.",
  },
  {
    number: "04",
    title: "Flexible options",
    text: "Some cards offer features such as EMI conversion or promotional offers. Always check the applicable interest, fees, and terms before choosing.",
  },
];

const steps = [
  {
    step: "01",
    title: "Understand your spending",
    text: "Think about where you spend most: shopping, travel, fuel, dining, or everyday purchases.",
  },
  {
    step: "02",
    title: "Compare card features",
    text: "Look at annual fees, rewards, cashback rules, interest rates, charges, and eligibility requirements.",
  },
  {
    step: "03",
    title: "Check the terms",
    text: "Read the key facts, fees, interest rates, and reward conditions before applying.",
  },
  {
    step: "04",
    title: "Apply responsibly",
    text: "Choose a card that matches your financial needs and repay your bills on time.",
  },
];

export default function CreditCardPage() {
  return (
    <main className="credit-page">
      {/* Hero */}
      <section className="credit-hero">
        <div className="credit-container credit-hero-grid">
          <div className="credit-hero-content">
            <p className="credit-eyebrow">CREDIT CARDS</p>

            <h1>
              Find a credit card
              <span> that fits your lifestyle.</span>
            </h1>

            <p className="credit-hero-text">
              Explore different types of credit cards and understand rewards,
              cashback, fees, and important terms before choosing a card.
            </p>

            <div className="credit-hero-actions">
              <a href="#compare" className="credit-btn credit-btn-primary">
                Explore options
              </a>

              <a href="#how-to-choose" className="credit-btn credit-btn-secondary">
                How to choose
              </a>
            </div>

            <p className="credit-disclaimer">
              Information is for general guidance. Card approval, fees,
              rewards, and eligibility depend on the card issuer and its
              current terms.
            </p>
          </div>

          {/* Visual credit card */}
          <div className="credit-card-visual-wrap">
            <div className="credit-card-visual">
              <div className="credit-card-top">
                <span>LoanSaarthi</span>
                <span className="credit-card-chip">▦</span>
              </div>

              <div className="credit-card-number">
                •••• &nbsp; •••• &nbsp; •••• &nbsp; 2026
              </div>

              <div className="credit-card-bottom">
                <span>YOUR NAME</span>
                <span>VISA</span>
              </div>
            </div>

            <div className="credit-floating-note">
              <strong>Choose wisely</strong>
              <span>
                Compare fees, benefits and repayment terms.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick intro */}
      <section className="credit-intro">
        <div className="credit-container credit-intro-grid">
          <div>
            <p className="credit-eyebrow">UNDERSTANDING CREDIT CARDS</p>
            <h2>
              A credit card is a payment tool with a
              <span> predefined credit limit.</span>
            </h2>
          </div>

          <div>
            <p>
              A credit card lets you make eligible purchases using the credit
              made available by the card issuer. Depending on the card and
              issuer, you may receive a billing cycle and a payment due date.
            </p>

            <p>
              If you carry an unpaid balance, interest and other applicable
              charges may apply. Always check the issuer's terms and pay your
              bills on time.
            </p>
          </div>
        </div>
      </section>

      {/* Card Types */}
      <section className="credit-types" id="compare">
        <div className="credit-container">
          <div className="credit-section-heading">
            <div>
              <p className="credit-eyebrow">EXPLORE YOUR OPTIONS</p>
              <h2>Different cards for different spending habits.</h2>
            </div>

            <p>
              The right card depends on your spending patterns, preferred
              benefits, fees, and eligibility.
            </p>
          </div>

          <div className="credit-type-grid">
            {cardTypes.map((card) => (
              <article className="credit-type-card" key={card.title}>
                <div className="credit-type-icon">{card.icon}</div>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <a href="#contact">Learn more →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="credit-benefits">
        <div className="credit-container">
          <div className="credit-section-heading">
            <div>
              <p className="credit-eyebrow">WHY CONSIDER A CREDIT CARD?</p>
              <h2>Benefits that can make everyday spending more convenient.</h2>
            </div>
          </div>

          <div className="credit-benefit-grid">
            {benefits.map((benefit) => (
              <article className="credit-benefit" key={benefit.number}>
                <span>{benefit.number}</span>

                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to choose */}
      <section className="credit-how" id="how-to-choose">
        <div className="credit-container">
          <div className="credit-how-heading">
            <p className="credit-eyebrow">HOW TO CHOOSE</p>

            <h2>
              Take a closer look before
              <span> applying.</span>
            </h2>

            <p>
              A good credit card is not necessarily the one with the most
              rewards. Look for a card whose costs and benefits make sense for
              your actual spending habits.
            </p>
          </div>

          <div className="credit-steps">
            {steps.map((item) => (
              <article className="credit-step" key={item.step}>
                <span>{item.step}</span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible usage */}
      <section className="credit-responsible">
        <div className="credit-container">
          <div className="credit-responsible-box">
            <div>
              <p className="credit-eyebrow">USE CREDIT RESPONSIBLY</p>

              <h2>
                Rewards are useful.
                <span> Responsible repayment matters more.</span>
              </h2>
            </div>

            <div className="credit-responsible-points">
              <p>✓ Pay your bill by the due date.</p>
              <p>✓ Understand interest and applicable charges.</p>
              <p>✓ Check annual and other applicable fees.</p>
              <p>✓ Keep your spending within a manageable budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="credit-cta" id="contact">
        <div className="credit-container">
          <div className="credit-cta-inner">
            <p className="credit-eyebrow">NEED HELP CHOOSING?</p>

            <h2>
              Let's find a card that
              <span> makes sense for you.</span>
            </h2>

            <p>
              Share your requirements with the LoanSaarthi team and explore
              available options based on your needs and eligibility.
            </p>

            <a href="tel:+911244567890" className="credit-btn credit-btn-light">
              Talk to an advisor
            </a>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="credit-source-note">
        <div className="credit-container">
          <p>
            <strong>Important:</strong> Credit card fees, interest rates,
            rewards, cashback, eligibility, and other benefits vary by issuer
            and card. Always review the issuer's latest Key Fact Statement,
            Most Important Terms and Conditions, and applicable fees before
            applying.
          </p>
        </div>
      </section>
    </main>
  );
}