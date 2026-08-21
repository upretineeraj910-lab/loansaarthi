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
    name: "Rajiv Sharma",
    title: "CEO & Founder",
    image: "/team/gamesh-ceo.png",
    alt: "Rajiv Sharma CEO and Founder",
  },
  {
    name: "Priya Mehta",
    title: "Loan Advisor",
    image: "/team/member2.jpg",
    alt: "Priya Mehta Loan Advisor",
  },
  {
    name: "Amit Verma",
    title: "Financial Consultant",
    image: "/team/member3.jpg",
    alt: "Amit Verma Financial Consultant",
  },
  {
    name: "Neha Kapoor",
    title: "Senior Loan Specialist",
    image: "/team/member4.jpg",
    alt: "Neha Kapoor Senior Loan Specialist",
  },
  {
    name: "Vikas Singh",
    title: "Relationship Manager",
    image: "/team/member5.jpg",
    alt: "Vikas Singh Relationship Manager",
  },
  {
    name: "Ananya Gupta",
    title: "Financial Advisor",
    image: "/team/member6.jpg",
    alt: "Ananya Gupta Financial Advisor",
  },
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
                    <Image
                      src={expert.image}
                      alt={expert.alt}
                      width={400}
                      height={320}
                      className="expert-image"
                      priority={index < 3}
                    />
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