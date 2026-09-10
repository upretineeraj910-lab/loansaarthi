"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import "./team.css";

type Expert = {
  name: string;
  title: string;
  image: string;
  alt: string;
};

const expertTeam: Expert[] = [
  {
    name: "Ganesh Jyala",
    title: "CEO & Founder",
    image: "/team/ganesh-ceo.png",
    alt: "Ganesh Jyala - CEO and Founder",
  },
  {
    name: "Meenakshi Bisht",
    title: "Loan Advisor",
    image: "/team/meenakshi-bhist.png",
    alt: "Meenakshi Bisht - Loan Advisor",
  },
  {
    name: "Priyanka",
    title: "Financial Consultant",
    image: "/team/priyanka.png",
    alt: "Priyanka - Financial Consultant",
  },
  {
    name: "Rambha",
    title: "Senior Loan Specialist",
    image: "/team/rambha.png",
    alt: "Rambha - Senior Loan Specialist",
  },
  {
    name: "Ranjeet",
    title: "Relationship Manager",
    image: "/team/ranjeet-j.png",
    alt: "Ranjeet - Relationship Manager",
  },
];

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Responsive cards check (CSS breakpoints match)
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width <= 650) {
        setVisibleCards(1);
      } else if (width <= 900) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateVisibleCards, 150);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // TBT Fix: Only observe and activate slider when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = () => {
    if (currentIndex <= 0) {
      setWithTransition(false);
      setCurrentIndex(expertTeam.length);
      setTimeout(() => {
        setWithTransition(true);
        setCurrentIndex(expertTeam.length - 1);
      }, 20);
    } else {
      setWithTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Autoplay only runs when visible on screen
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, nextSlide]);

  const handleTransitionEnd = () => {
    if (currentIndex >= expertTeam.length) {
      setWithTransition(false);
      setCurrentIndex(0);
    }
  };

  const sliderItems = [...expertTeam, ...expertTeam.slice(0, 3)];
  const cardWidthPercent = 100 / visibleCards;

  return (
    <section ref={sectionRef} className="expert-team">
      <div className="expert-team-container">
        <div className="expert-team-heading">
          <span>OUR TEAM</span>
          <h2>Meet Our Expert People</h2>
          <p>
            Experienced professionals helping you find suitable loan and
            financial solutions.
          </p>
        </div>

        <div className="expert-slider-wrapper">
          <button 
            className="slider-btn prev-btn" 
            onClick={prevSlide} 
            aria-label="Previous"
            type="button"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>

          <button 
            className="slider-btn next-btn" 
            onClick={nextSlide} 
            aria-label="Next"
            type="button"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

          <div className="expert-slider">
            <div
              className="expert-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translate3d(-${currentIndex * cardWidthPercent}%, 0, 0)`,
                transition: withTransition ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
                willChange: isVisible ? "transform" : "auto",
              }}
            >
              {sliderItems.map((expert, index) => {
                const isClone = index >= expertTeam.length;

                return (
                  <div
                    className="expert-card"
                    key={`${expert.name}-${index}`}
                    aria-hidden={isClone}
                    style={{
                      flex: `0 0 ${cardWidthPercent}%`,
                      maxWidth: `${cardWidthPercent}%`,
                    }}
                  >
                    <div className="expert-card-inner">
                      <div className="expert-image-wrapper">
                        <Image
                          src={expert.image}
                          alt={isClone ? "" : expert.alt}
                          className="expert-image"
                          height={382}
                          width={382}
                          loading="lazy"
                          sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"
                        />
                      </div>

                      <div className="expert-info">
                        <h3>{expert.name}</h3>
                        <p>{expert.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;