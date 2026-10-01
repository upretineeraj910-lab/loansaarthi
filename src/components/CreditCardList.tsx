'use client';

import { useState, useMemo } from 'react';
import { CreditCard } from '@/components/creditCards';

interface CreditCardListProps {
  cards: CreditCard[];
}

export default function CreditCardList({ cards }: CreditCardListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIssuerType, setSelectedIssuerType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Lifetime Free', 'Cashback', 'UPI / RuPay', 'Travel & Lounge', 'Rewards'];

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const matchesIssuer = selectedIssuerType === 'All' || card.issuerType === selectedIssuerType;
      const matchesSearch =
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.rewardRate.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesIssuer && matchesSearch;
    });
  }, [cards, selectedCategory, selectedIssuerType, searchQuery]);

  return (
    <div>
      {/* Controls Box */}
      <div className="cc-filter-card">
        <div className="cc-controls-row">
          <input
            type="text"
            placeholder="Search by card name, bank (HDFC, ICICI...) or perks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cc-search-input"
          />

          <div className="cc-type-toggle">
            <span style={{ padding: '0 8px', color: 'var(--ls-text-muted)' }}>Issuer:</span>
            {['All', 'Private Bank', 'NBFC'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedIssuerType(type)}
                className={`cc-type-btn ${selectedIssuerType === type ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="cc-categories-bar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cc-cat-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="cc-grid">
        {filteredCards.map((card) => (
          <div key={card.id} className="cc-card-item">
            <div>
              {/* Card Graphical View */}
              <div className={`cc-card-visual bg-gradient-to-tr ${card.gradient}`}>
                <div className="cc-card-visual-top">
                  <div>
                    <div className="cc-card-issuer">{card.issuer}</div>
                    <div className="cc-card-title-preview">{card.name}</div>
                  </div>
                  <span className="cc-card-network">{card.network}</span>
                </div>
                <div className="cc-card-visual-bottom">
                  <span className="cc-card-number-mask">•••• •••• •••• 8421</span>
                  <span className="cc-card-cat-badge">{card.category}</span>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="cc-details-header">
                <div>
                  <div className="cc-card-name">{card.name}</div>
                  <div className="cc-card-issuer-sub">{card.issuer} • {card.issuerType}</div>
                </div>
                {card.popularBadge && <span className="cc-pill-tag">{card.popularBadge}</span>}
              </div>

              {/* Reward Box */}
              <div className="cc-perk-box">
                <p>★ {card.rewardRate}</p>
              </div>

              {/* Perks */}
              <ul className="cc-perks-list">
                {card.keyPerks.map((perk, idx) => (
                  <li key={idx}>
                    <span className="check">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Section */}
            <div className="cc-card-footer">
              <div className="cc-fees-row">
                <div>
                  <span className="cc-fee-label">Annual Fee</span>
                  <span className="cc-fee-val">{card.annualFee === 0 ? 'FREE' : `₹${card.annualFee}`}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="cc-fee-label">Waiver</span>
                  <span className="cc-fee-waiver">{card.feeWaiverText}</span>
                </div>
              </div>

              <a href={card.applyUrl} className="cc-apply-btn">
                Apply Online
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}