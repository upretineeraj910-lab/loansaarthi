"use client";

import React, { useEffect, useState } from "react";
import "./team.css";

type Expert = {
  name: string;
  title: string;
  url: string;
  alt: string;
};

const expertTeam: Expert[] = [
  {
    name: "Rajiv Sharma",
    title: "CEO & Founder",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    alt: "Rajiv Sharma CEO and Founder",
  },
  {
    name: "Priya Mehta",
    title: "Loan Advisor",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    alt: "Priya Mehta Loan Advisor",
  },
  {
    name: "Amit Verma",
    title: "Financial Consultant",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    alt: "Amit Verma Financial Consultant",
  },
  {
    name: "Neha Kapoor",
    title: "Senior Loan Specialist",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800",
    alt: "Neha Kapoor Senior Loan Specialist",
  },
  {
    name: "Vikas Singh",
    title: "Relationship Manager",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800",
    alt: "Vikas Singh Relationship Manager",
  },
  {
    name: "Ananya Gupta",
    title: "Financial Advisor",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
    alt: "Ananya Gupta Financial Advisor",
  },
];

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  const sliderItems = [
    ...expertTeam,
    ...expertTeam.slice(0, 3),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Jab duplicate cards tak pahunch jaaye,
   * transition temporarily off karke original
   * starting position par silently reset karenge.
   */
  useEffect(() => {
    if (currentIndex === expertTeam.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrentIndex(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransition(true);
          });
        });
      }, 550);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <section className="expert-team">
      <div className="expert-team-container">

        <div className="expert-team-heading">
          <span>OUR TEAM</span>

          <h2>Meet Our Expert People</h2>

          <p>
            Experienced professionals helping you find suitable loan
            and financial solutions.
          </p>
        </div>

        <div className="expert-slider">
          <div
            className="expert-track"
            style={{
              transform: `translateX(-${currentIndex * 33.333333}%)`,
              transition: transition
                ? "transform 0.55s ease-in-out"
                : "none",
            }}
          >
            {sliderItems.map((expert, index) => (
              <a
                href={expert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="expert-card"
                key={`${expert.name}-${index}`}
              >
                <div className="expert-image-wrapper">
                  <img
                    src={expert.url}
                    alt={expert.alt}
                    className="expert-image"
                  />
                </div>

                <div className="expert-info">
                  <h3>{expert.name}</h3>
                  <p>{expert.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;