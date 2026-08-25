'use client';
import Script from 'next/script';
import styles from './GoogleReviews.module.css';

export default function GoogleReviews() {
  return (
    <section className={styles.reviewSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          From the Ledger Margin
        </h2>

        {/* Elfsight Platform Script loaded asynchronously */}
        <Script 
          src="https://elfsightcdn.com/platform.js" 
          strategy="lazyOnload" 
        />
        
        {/* Your Unique Elfsight Widget Container */}
        <div 
          className="elfsight-app-f1d71447-2b1f-4470-88de-d0ff6e124ff2" 
          data-elfsight-app-lazy
        ></div>
        
      </div>
    </section>
  );
}