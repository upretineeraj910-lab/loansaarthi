"use client";

import React, { useEffect, useState } from "react";
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
  const [transition, setTransition] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 650) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 900) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderItems = [...expertTeam, ...expertTeam.slice(0, 3)];

  // Auto-play logic (Resets if user clicks next/prev because currentIndex changes)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      // Seamlessly jump to the end clone before sliding back
      setTransition(false);
      setCurrentIndex(expertTeam.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
          setCurrentIndex(expertTeam.length - 1);
        });
      });
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= expertTeam.length) {
      setTransition(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!transition) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [transition]);

  const cardWidthPercent = 100 / visibleCards;

  return (
    <section className="expert-team">
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
          {/* Navigation Buttons */}
          <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
            </svg>
          </button>

          <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Next">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
            </svg>
          </button>

          <div className="expert-slider">
            <div
              className="expert-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
                transition: transition ? "transform 0.55s ease-in-out" : "none",
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
                          // fill
                          className="expert-image"
                          priority={index < 3}
                          // sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33.33vw"
                          height={382}
                          width={382}
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