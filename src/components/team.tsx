"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

const AUTOPLAY_DELAY = 3000;
const TRANSITION_DURATION = 500;

const getVisibleCards = (width: number): number => {
  if (width <= 650) return 1;
  if (width <= 900) return 2;
  return 3;
};

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const resetFrameRef = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [withTransition, setWithTransition] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /*
   * Keep enough cloned slides to fill the visible viewport.
   * This prevents gaps when the number of visible cards changes.
   */
  const cloneCount = Math.min(visibleCards, expertTeam.length);

  const sliderItems = [
    ...expertTeam,
    ...expertTeam.slice(0, cloneCount),
  ];

  const cardWidthPercent = 100 / visibleCards;

  /*
   * Detect reduced-motion preference.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  /*
   * Responsive visible-card calculation.
   * Only update state when the value actually changes.
   */
  useEffect(() => {
    const updateVisibleCards = () => {
      const nextVisibleCards = getVisibleCards(window.innerWidth);

      setVisibleCards((previous) =>
        previous === nextVisibleCards ? previous : nextVisibleCards
      );
    };

    updateVisibleCards();

    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(updateVisibleCards, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);

      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  /*
   * Keep the current position valid after responsive changes.
   */
  useEffect(() => {
    setCurrentIndex((previous) => {
      const maxIndex = expertTeam.length;

      return Math.min(previous, maxIndex);
    });
  }, [visibleCards]);

  /*
   * Only activate carousel behavior while the section is near/in viewport.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Move to next slide.
   */
  const nextSlide = useCallback(() => {
    setWithTransition(true);

    setCurrentIndex((previous) => previous + 1);
  }, []);

  /*
   * Move to previous slide.
   */
  const prevSlide = useCallback(() => {
    setCurrentIndex((previous) => {
      if (previous > 0) {
        setWithTransition(true);
        return previous - 1;
      }

      /*
       * Jump to the cloned end without animation,
       * then animate back to the previous real slide.
       */
      setWithTransition(false);

      if (resetFrameRef.current !== null) {
        cancelAnimationFrame(resetFrameRef.current);
      }

      resetFrameRef.current = requestAnimationFrame(() => {
        resetFrameRef.current = requestAnimationFrame(() => {
          setWithTransition(true);
          setCurrentIndex(expertTeam.length - 1);
        });
      });

      return expertTeam.length;
    });
  }, []);

  /*
   * Autoplay:
   * - Only while visible
   * - Disabled when user interacts
   * - Disabled for reduced-motion users
   */
  useEffect(() => {
    if (!isVisible || isPaused || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isVisible,
    isPaused,
    prefersReducedMotion,
    nextSlide,
  ]);

  /*
   * Reset infinite-loop position after the cloned slides.
   */
  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= expertTeam.length) {
      setWithTransition(false);

      if (resetFrameRef.current !== null) {
        cancelAnimationFrame(resetFrameRef.current);
      }

      resetFrameRef.current = requestAnimationFrame(() => {
        setCurrentIndex(0);
      });
    }
  }, [currentIndex]);

  /*
   * Keyboard support for carousel navigation.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  /*
   * Cleanup pending animation frames.
   */
  useEffect(() => {
    return () => {
      if (resetFrameRef.current !== null) {
        cancelAnimationFrame(resetFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="expert-team"
      aria-labelledby="expert-team-title"
    >
      <div className="expert-team-container">
        <header className="expert-team-heading">
          <span>OUR TEAM</span>

          <h2 id="expert-team-title">
            Meet Our Expert People
          </h2>

          <p>
            Experienced professionals helping you find suitable
            loan and financial solutions.
          </p>
        </header>

        <div
          className="expert-slider-wrapper"
          role="region"
          aria-roledescription="carousel"
          aria-label="Our expert team"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <button
            className="slider-btn prev-btn"
            onClick={prevSlide}
            aria-label="Previous team member"
            type="button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>

          <button
            className="slider-btn next-btn"
            onClick={nextSlide}
            aria-label="Next team member"
            type="button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41 1.41z" />
            </svg>
          </button>

          <div className="expert-slider">
            <div
              className="expert-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translate3d(-${
                  currentIndex * cardWidthPercent
                }%, 0, 0)`,

                transition:
                  withTransition && !prefersReducedMotion
                    ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
                    : "none",

                willChange:
                  isVisible && !prefersReducedMotion
                    ? "transform"
                    : "auto",
              }}
            >
              {sliderItems.map((expert, index) => {
                const isClone = index >= expertTeam.length;

                return (
                  <article
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
                          width={382}
                          height={382}
                          loading="lazy"
                          sizes="
                            (max-width: 650px) 100vw,
                            (max-width: 900px) 50vw,
                            33vw
                          "
                        />
                      </div>

                      <div className="expert-info">
                        <h3>{expert.name}</h3>
                        <p>{expert.title}</p>
                      </div>
                    </div>
                  </article>
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
