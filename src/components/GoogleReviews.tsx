'use client';
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import styles from './GoogleReviews.module.css';

export default function GoogleReviews() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 1. Viewport Intersection: Reviews section paas aane par hi script load karega
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' } // 250px pehle trigger hoga taaki user ko delay na dikhe
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Badge Removal: Sirf tab chalega jab widget load ho chuka ho
  useEffect(() => {
    if (!isVisible) return;

    const removeBadge = () => {
      const badge = document.querySelector('a[href*="elfsight.com/google-reviews-widget"]');
      if (badge) {
        badge.remove();
        return true;
      }
      return false;
    };

    if (removeBadge()) return;

    const observer = new MutationObserver(() => {
      // Badge milte hi disconnect kar do taaki memory leak aur lag na ho
      if (removeBadge()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 10 sec safety timeout agar badge na mile
    const timeout = setTimeout(() => observer.disconnect(), 10000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef} 
      className={styles.reviewSection}
      style={{ minHeight: '380px' }} // Layout shift (CLS) avoid karne ke liye placeholder height
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>
          From the Ledger Margin
        </h2>

        {isVisible && (
          <>
            <Script 
              src="https://elfsightcdn.com/platform.js" 
              strategy="afterInteractive" 
            />
            <div 
              className="elfsight-app-f1d71447-2b1f-4470-88de-d0ff6e124ff2" 
              data-elfsight-app-lazy
            />
          </>
        )}
      </div>
    </section>
  );
}