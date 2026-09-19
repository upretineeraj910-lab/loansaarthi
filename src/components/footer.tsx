"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "./Footer.css";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();

        setIsLoggedIn(data.authenticated === true);
      } catch (error) {
        console.error("AUTH CHECK ERROR:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed");
        return;
      }

      // Immediately update UI
      setIsLoggedIn(false);

      // Go to login
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  return (
    <footer className="ls-footer">
      <div className="ls-footer-container">

        {/* Brand */}
        <div className="ls-footer-column ls-footer-brand">
          <Link href="/" className="ls-footer-logo">
            Loan<span>Saarthi</span>
          </Link>

          <p>
            LoanSaarthi helps you explore suitable loan and financial
            solutions with a simple and transparent experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="ls-footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/Blog">Blog</Link>
            </li>

            <li>
              <Link href="/Career">Career</Link>
            </li>

            {/* Auth Links */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="ls-footer-logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Services */}
        <div className="ls-footer-column">
          <h3>Our Services</h3>

          <ul>
            <li>
              <Link href="/personal-loan">
                Personal Loan
              </Link>
            </li>

            <li>
              <Link href="/business-loan">
                Business Loan
              </Link>
            </li>

            <li>
              <Link href="/home-loan">
                Home Loan
              </Link>
            </li>

            <li>
              <Link href="/education-loan">
                Education Loan
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="ls-footer-column ls-footer-contact">
          <h3>Contact Us</h3>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">📍</span>

            <p>
              2151/9B Goswami Girdhari Lal Marg,
              <br />
              New Patel Nagar, Shadipur,
              <br />
              Delhi - 110008
            </p>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">☎</span>
            <a href="tel:01125792874">
              011-25792874
            </a>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">📱</span>
            <a href="tel:+919810168635">
              +91-9810168635
            </a>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">✉</span>

            <a href="mailto:contactus@loansaarthi.com">
              contactus@loansaarthi.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="ls-footer-bottom">
        <div className="ls-footer-bottom-container">

          <p>
            © {new Date().getFullYear()} LoanSaarthi.
            All Rights Reserved.
          </p>

          <div className="ls-footer-bottom-links">
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <Link href="/terms-and-conditions">
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}