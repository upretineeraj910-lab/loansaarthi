"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./popup.module.css";

const APPLY_HREF = "/#HeroVerification"; // <- change to your lead form link
const SHOW_DELAY_MS = 1200;
const LAST_DAY = "2026-11-10"; // popup stops showing after this date (IST)

// Today's date in Indian Standard Time, as "YYYY-MM-DD"
function getIstDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function getGreeting(istDate: string) {
  if (istDate < "2026-11-06")
    return { title: "Diwali Is Almost Here!", sub: "Light up your festival with a great loan offer" };
  if (istDate === "2026-11-06")
    return { title: "Happy Dhanteras!", sub: "Wishing you wealth and prosperity today" };
  if (istDate === "2026-11-07")
    return { title: "Happy Choti Diwali!", sub: "Wishing you a bright and joyful festival" };
  if (istDate === "2026-11-08")
    return { title: "Happy Diwali!", sub: "May your home be filled with light and prosperity" };
  return { title: "Happy Diwali Week! ", sub: "Our festive offer is still on" };
}

export default function DiwaliPopup() {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting("2026-11-06"));

  // Show once per session
  useEffect(() => {
    const today = getIstDate();
    if (today > LAST_DAY) return;
    setGreeting(getGreeting(today));

    let seen = false;
    try {
      seen = sessionStorage.getItem("ls_diwali_popup") === "1";
    } catch {}
    if (seen) return;

    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem("ls_diwali_popup", "1");
    } catch {}
  }

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={close} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Diwali offer"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={close} aria-label="Close">
          ×
        </button>

        <div className={styles.diya} aria-hidden="true">🪔</div>
        <h2 className={styles.title}>{greeting.title}</h2>
        <p className={styles.sub}>{greeting.sub}</p>

        <div className={styles.offer}>
          Personal Loan starting at <strong>10.25%*</strong>
        </div>
        <p className={styles.merge}>
          Also, combine your credit card dues, loan app loans and other small loans into{" "}
          <b>one single EMI</b>.
        </p>

        <Link href={APPLY_HREF} className={styles.cta} onClick={close}>
          Apply Now
        </Link>
        <button className={styles.later} onClick={close}>Maybe later</button>
        <p className={styles.tnc}>
          *Terms &amp; conditions apply. Rate depends on your profile and credit score.
        </p>
      </div>
    </div>
  );
}