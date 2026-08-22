"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../components/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="faq-item">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="faq-button"
              aria-expanded={isOpen}
            >
              <span className="faq-question">{f.q}</span>
              <ChevronDown
                size={18}
                className={`faq-chevron ${isOpen ? "open" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div className={`faq-answer ${isOpen ? "open" : ""}`}>
              <p className="faq-answer-text">{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
