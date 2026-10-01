import type { Metadata } from 'next';
import { CREDIT_CARDS } from '@/components/creditCards';
import CreditCardList from '@/components/CreditCardList';
import './credit-card.css';

export const metadata: Metadata = {
  title: 'Best Credit Cards in India 2026 | Private Banks & Top NBFCs',
  description:
    'Compare top credit cards from private banks (HDFC, ICICI, Axis, IDFC FIRST, Kotak) & NBFCs in India. Find lifetime free, cashback, UPI RuPay & lounge access cards with instant approval.',
  keywords: [
    'best credit cards in india',
    'lifetime free credit card',
    'hdfc millennia credit card',
    'amazon pay icici card',
    'rupay credit card on upi',
    'private sector bank credit cards',
    'instant approval credit card nbfc',
    'airport lounge access credit cards'
  ],
};

export default function CreditCardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Private Bank & NBFC Credit Cards in India',
    itemListElement: CREDIT_CARDS.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: card.name,
        feesAndCommissionsSpecification: card.feeWaiverText,
        annualPercentageRate: card.annualFee === 0 ? '0 Annual Fee' : `₹${card.annualFee} / year`,
        provider: {
          '@type': 'BankOrCreditUnion',
          name: card.issuer,
        },
      },
    })),
  };

  return (
    <main className="cc-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="cc-hero">
        <div className="cc-badge">
          🇮🇳 Private Banks & NBFCs Only
        </div>
        <h1>
          Find the Best <span>Credit Card</span> in India
        </h1>
        <p>
          Compare premium cashback, lifetime free, airport lounge perks, and RuPay UPI credit cards from top private lenders like HDFC, ICICI, Axis, IDFC FIRST, and OneCard.
        </p>
      </section>

      <CreditCardList cards={CREDIT_CARDS} />

      <section className="cc-info-section">
        <h2>Eligibility & Required Documents for Private Bank Credit Cards</h2>
        <div className="cc-info-grid">
          <div>
            <h3>1. Minimum Age & Income</h3>
            <p>
              Salaried professionals typically require a net take-home income of ₹25,000/month or higher. Self-employed applicants must show an ITR of at least ₹5 Lakhs p.a.
            </p>
          </div>
          <div>
            <h3>2. Credit Score (CIBIL)</h3>
            <p>
              A CIBIL credit score of 750+ offers higher approval rates and lower APRs across leading private sector banks like HDFC, ICICI, and Axis Bank.
            </p>
          </div>
          <div>
            <h3>3. KYC Documentation</h3>
            <p>
              PAN Card (mandatory), Aadhaar for digital e-KYC/Video KYC, and latest 3 months salary slips or bank statements for credit limit assessment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}