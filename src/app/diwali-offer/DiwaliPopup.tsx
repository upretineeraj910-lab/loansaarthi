"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./popup.module.css";

const APPLY_HREF = "/#apply"; // <- apni lead form ka link
// Lakshmi Puja evening, Indian Standard Time (+05:30) - user ke timezone se koi fark nahi padta
const DIWALI_TARGET = new Date("2026-11-08T18:00:00+05:30").getTime();
const SHOW_DELAY_MS = 1200;

function getIstDate(): string {
  // "YYYY-MM-DD" in India time
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function getGreeting(istDate: string) {
  if (istDate < "2026-11-06") return { title: "Diwali Aa Rahi Hai! 🪔", sub: "Pehle se hi apni Diwali roshan karein" };
  if (istDate === "2026-11-06") return { title: "Dhanteras Ki Hardik Shubhkamnayein! 🪙", sub: "Aaj ka din shubh hai, apne paiso ko sahi disha dein" };
  if (istDate === "2026-11-07") return { title: "Choti Diwali Ki Shubhkamnayein! 🪔", sub: "Kal Lakshmi Puja hai, aaj hi offer pakdein" };
  if (istDate === "2026-11-08") return { title: "Shubh Deepawali! ✨", sub: "Aapke ghar roshni aur samriddhi aaye" };
  return { title: "Happy Diwali Week! 🎆", sub: "Festive offer abhi bhi chalu hai" };
}

function diff(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function DiwaliPopup() {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting("2026-11-06"));
  const [left, setLeft] = useState<number | null>(null);

  // show once per session
  useEffect(() => {
    setGreeting(getGreeting(getIstDate()));
    let seen = false;
    try {
      seen = sessionStorage.getItem("ls_diwali_popup") === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // IST countdown
  useEffect(() => {
    if (!open) return;
    const tick = () => setLeft(DIWALI_TARGET - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [open]);

  // Esc to close + lock body scroll
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
  const t = left !== null && left > 0 ? diff(left) : null;

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
          Personal Loan <strong>10.25%*</strong> se shuru
        </div>
        <p className={styles.merge}>
          + Credit card, loan app aur chhote loans ko <b>ek EMI</b> me merge karein
        </p>

        {t && (
          <div className={styles.countWrap}>
            <span className={styles.countLabel}>Diwali Lakshmi Puja (8 Nov, IST) me</span>
            <div className={styles.count}>
              <div><b>{pad(t.d)}</b><small>Din</small></div>
              <div><b>{pad(t.h)}</b><small>Ghante</small></div>
              <div><b>{pad(t.m)}</b><small>Min</small></div>
              <div><b>{pad(t.s)}</b><small>Sec</small></div>
            </div>
          </div>
        )}

        <Link href={APPLY_HREF} className={styles.cta} onClick={close}>
          Abhi Apply Karein
        </Link>
        <button className={styles.later} onClick={close}>Baad me</button>
        <p className={styles.tnc}>*T&amp;C apply. Rate profile aur credit score par depend karta hai.</p>
      </div>
    </div>
  );
}
