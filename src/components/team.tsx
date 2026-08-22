"use client";

import React, { useEffect, useState, useRef } from "react";
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
    alt: "Ganesh Jyala CEO and Founder",
  },
  {
    name: "Meenakshi Bisht",
    title: "Loan Advisor",
    image: "/team/meenakshi-bhist.png",
    alt: "Meenakshi-bisht Loan Advisor",
  },
  {
    name: "priyanka",
    title: "Financial Consultant",
    image: "/team/priyanka.png",
    alt: "priyanka Financial Consultant",
  },
  {
    name: "rambha",
    title: "Senior Loan Specialist",
    image: "/team/rambha.png",
    alt: " rambha Senior Loan Specialist",
  },
  {
    name: " ranjeet",
    title: "Relationship Manager",
    image: "/team/ranjeet-j.png",
    alt: " ranjeet Relationship Manager",
  },
  // {
  //   name: "Ananya Gupta",
  //   title: "Financial Advisor",
  //   image: "/team/member6.jpg",
  //   alt: "Ananya Gupta Financial Advisor",
  // },
];

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);

  // Screen size ke hisab se cards count auto-detect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 650) {
        setVisibleCards(1); // Mobile: 1 card
      } else if (window.innerWidth <= 900) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(3); // Desktop: 3 cards
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Infinite loop ke liye duplicate items
  const sliderItems = [...expertTeam, ...expertTeam.slice(0, 3)];

  // Auto Slider Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Infinite Reset jab cards end par pahuche
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

  // Card width percentage calculation
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

        <div className="expert-slider">
          <div
            className="expert-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
              transition: transition ? "transform 0.55s ease-in-out" : "none",
            }}
          >
            {sliderItems.map((expert, index) => (
              <div
                className="expert-card"
                key={`${expert.name}-${index}`}
                style={{
                  flex: `0 0 ${cardWidthPercent}%`,
                  maxWidth: `${cardWidthPercent}%`,
                }}
              >
                <div className="expert-card-inner">
                  <div className="expert-image-wrapper">
                    {/* <Image
                      src={expert.image}
                      alt={expert.alt}
                      width={400}
                      height={320}
                      className="expert-image"
                      priority={index < 3}
                    /> */}

                    <div className="expert-image-wrapper">
                      <Image
                        src={expert.image}
                        alt={expert.alt}
                        fill
                        className="expert-image"
                        priority={index < 3}
                        sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33.33vw"
                      />
                    </div>
                  </div>

                  <div className="expert-info">
                    <h3>{expert.name}</h3>
                    <p>{expert.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;