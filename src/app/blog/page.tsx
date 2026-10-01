"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import "./blog.css";

export interface BlogArticle {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  createdAt: string | Date;
  authorName?: string;
}

const CATEGORIES = [
  "All",
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Credit Score",
  "Loan Against Property",
  "Financial Advice",
];

const FALLBACK_BLOGS: BlogArticle[] = [
  {
    title: "Complete Personal Loan Eligibility and Interest Rates Guide 2026",
    slug: "complete-personal-loan-eligibility-guide-2026",
    category: "Personal Loan",
    excerpt:
      "Learn how personal loan interest rates are calculated, essential eligibility factors, necessary documents, and insider tips to get lowest rate approval.",
    readTime: "6 min read",
    createdAt: "2026-09-28T09:00:00.000Z",
    authorName: "LoanSaarthi Credit Advisory Team",
    content: `
      <h2>Introduction to Personal Loans</h2>
      <p>A personal loan is an unsecured financing option that allows you to borrow funds without pledging collateral.</p>
      <h3>Key Factors That Determine Interest Rate</h3>
      <ul>
        <li><strong>Credit Score (CIBIL):</strong> A score of 750+ qualifies you for the lowest rates.</li>
        <li><strong>Monthly Net Income:</strong> Higher monthly earnings improve debt-to-income stability.</li>
        <li><strong>Employer Profile:</strong> Working with top MNCs or corporate firms provides preferential corporate interest rates.</li>
      </ul>
    `,
  },
  {
    title: "How to Boost Your CIBIL Score Above 750 in 90 Days",
    slug: "how-to-improve-cibil-score-above-750",
    category: "Credit Score",
    excerpt:
      "A step-by-step actionable guide to improving your credit score, correcting credit report errors, and maintaining healthy credit utilization.",
    readTime: "5 min read",
    createdAt: "2026-09-25T11:30:00.000Z",
    authorName: "Financial Research Desk",
    content: `
      <h2>Why Does a 750+ CIBIL Score Matter?</h2>
      <p>In India, banks use your 3-digit CIBIL score to determine risk profile and loan pricing.</p>
      <h3>4 Steps to Improve Your Score</h3>
      <ul>
        <li>Never delay an EMI or credit card payment.</li>
        <li>Maintain credit card utilization under 30%.</li>
        <li>Check your credit bureau report for inaccurate open accounts.</li>
        <li>Limit hard inquiries from simultaneous loan applications.</li>
      </ul>
    `,
  },
  {
    title: "Home Loan Tax Benefits: Deductions Under Section 80C and 24(b)",
    slug: "home-loan-tax-benefits-guide",
    category: "Home Loan",
    excerpt:
      "Maximize your tax savings on home loan interest and principal repayments with this comprehensive tax saving breakdown.",
    readTime: "7 min read",
    createdAt: "2026-09-20T08:15:00.000Z",
    authorName: "LoanSaarthi Taxation Team",
    content: `
      <h2>Tax Deductions Available on Home Loans</h2>
      <p>The Income Tax Act provides substantial deductions for home buyers under the old tax regime.</p>
      <h3>1. Section 24(b) - Interest Deduction</h3>
      <p>Claim up to ₹2,00,000 per financial year on interest paid for a self-occupied house.</p>
      <h3>2. Section 80C - Principal Repayment</h3>
      <p>Deduct up to ₹1,50,000 per financial year for home loan principal repayment and stamp duty charges.</p>
    `,
  },
  {
    title: "Business Term Loan vs Dropline Overdraft: Which is Better for You?",
    slug: "business-loan-vs-dropline-overdraft",
    category: "Business Loan",
    excerpt:
      "Compare business loans and overdraft facilities to choose the most cost-effective financing for your working capital needs.",
    readTime: "6 min read",
    createdAt: "2026-09-15T10:00:00.000Z",
    authorName: "SME Advisory Group",
    content: `
      <h2>Funding Options for Indian Businesses</h2>
      <p>Choosing between a fixed term loan and a revolving dropline overdraft depends on whether you have capital asset purchases or fluctuating inventory cash cycles.</p>
    `,
  },
  {
    title: "Loan Against Property (LAP): Lowest Interest Rates with High Funding",
    slug: "loan-against-property-interest-rates-benefits",
    category: "Loan Against Property",
    excerpt:
      "Unlock the hidden value of your residential or commercial property with multi-crore funding at significantly lower interest rates.",
    readTime: "5 min read",
    createdAt: "2026-09-10T14:20:00.000Z",
    authorName: "Mortgage Specialist",
    content: `
      <h2>Unlock Real Estate Value</h2>
      <p>Loan Against Property allows property owners to pledge commercial or residential titles to access low-interest funds with tenures up to 15 years.</p>
    `,
  },
  {
    title: "Smart Strategies to Prepay Your Home Loan and Save Lakhs in Interest",
    slug: "how-to-reduce-home-loan-interest-burden",
    category: "Financial Advice",
    excerpt:
      "Learn how making one extra EMI every year or increasing your EMI by 5% can reduce a 20-year loan tenure down to 12 years.",
    readTime: "8 min read",
    createdAt: "2026-09-05T12:00:00.000Z",
    authorName: "Wealth Advisory Team",
    content: `
      <h2>Prepayment Strategies</h2>
      <p>By paying 1 extra EMI every year or stepping up your monthly EMI by 5% with annual salary increments, you save substantial lakhs in cumulative interest payout.</p>
    `,
  },
];

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>(FALLBACK_BLOGS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch blogs from API and merge with fallback
  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/blog", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const dbSlugs = new Set(json.data.map((b: any) => b.slug));
            const merged = [
              ...json.data,
              ...FALLBACK_BLOGS.filter((b: BlogArticle) => !dbSlugs.has(b.slug)),
            ];
            setBlogs(merged);
          }
        }
      } catch (err) {
        console.error("Failed to load blogs from API, using fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []);

  // Filtered blogs based on Category & Search
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b: BlogArticle) => {
      const matchesCategory =
        activeCategory === "All" ||
        b.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  const featuredBlog = blogs[0];
  const displayArticles =
    activeCategory === "All" && !searchQuery
      ? filteredBlogs.slice(1)
      : filteredBlogs;

  const formatDate = (dateValue: any) => {
    try {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return "Recently updated";
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently updated";
    }
  };

  return (
    <div className="blog-page">
      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="blog-hero">
        <div className="blog-container">
          <div className="blog-hero-content">
            <p className="blog-eyebrow">KNOWLEDGE HUB & GUIDES</p>
            <h1>
              Master your money with <span>LoanSaarthi.</span>
            </h1>
            <p>
              Clear, practical, and expert-reviewed guides to help you secure
              loans at the lowest interest rates, build a 750+ credit score, and
              make smarter financial choices.
            </p>

            {/* SEARCH BAR */}
            <div className="blog-search">
              <input
                type="text"
                placeholder="Search articles on Home Loans, CIBIL, EMI hacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{ marginRight: "12px", color: "#64748b" }}
                >
                  ✕ Clear
                </button>
              )}
              <button type="button">Search</button>
            </div>

            {/* QUICK LINK TO PUBLISH BLOG FORM */}
            <div style={{ marginTop: "18px", display: "flex", gap: "12px", alignItems: "center" }}>
              <Link
                href="/admin/blogs/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#181717",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                ✍️ Write & Publish New Article →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CATEGORY NAVIGATION
      ======================================== */}
      <section className="blog-categories">
        <div className="blog-container">
          <div className="blog-category-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`blog-category ${
                  activeCategory === cat ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURED ARTICLE (When showing all & no search)
      ======================================== */}
      {featuredBlog && activeCategory === "All" && !searchQuery && (
        <section className="blog-featured">
          <div className="blog-container">
            <article className="featured-article">
              <div className="featured-image">
                <div className="featured-image-placeholder">
                  <span>LOANSAARTHI EDITORIAL</span>
                  <strong>{featuredBlog.category}</strong>
                </div>
              </div>

              <div className="featured-content">
                <p className="article-category">{featuredBlog.category}</p>
                <h2>{featuredBlog.title}</h2>
                <p>{featuredBlog.excerpt}</p>

                <div className="article-meta">
                  <span>{featuredBlog.authorName || "LoanSaarthi Experts"}</span>
                  <span>•</span>
                  <span>{featuredBlog.readTime || "6 min read"}</span>
                  <span>•</span>
                  <span>{formatDate(featuredBlog.createdAt)}</span>
                </div>

                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="blog-read-more"
                >
                  Read full guide →
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ========================================
          LATEST ARTICLES GRID
      ======================================== */}
      <section className="blog-latest">
        <div className="blog-container">
          <div className="blog-section-header">
            <div>
              <p className="blog-eyebrow">
                {activeCategory === "All" ? "LATEST ARTICLES" : activeCategory.toUpperCase()}
              </p>
              <h2>
                Explore our
                <span> financial insights.</span>
              </h2>
            </div>
            <p>
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}{" "}
              available to help you navigate your borrowing journey.
            </p>
          </div>

          {filteredBlogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3 style={{ fontSize: "22px", marginBottom: "10px", color: "var(--navy)" }}>
                No articles found
              </h3>
              <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
                We couldn't find any articles matching your search query or filter.
              </p>
              <button
                type="button"
                className="blog-read-more"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="article-grid">
              {displayArticles.map((article) => (
                <article className="article-card" key={article.slug}>
                  <Link href={`/blog/${article.slug}`} className="article-image">
                    <div className="article-image-placeholder">
                      <span>{article.category}</span>
                    </div>
                  </Link>

                  <div className="article-card-content">
                    <div className="article-card-top">
                      <span className="article-category">{article.category}</span>
                      <span className="article-date">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>

                    <h3>
                      <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                    </h3>

                    <p>{article.excerpt}</p>

                    <div className="article-card-footer">
                      <span>{article.readTime || "5 min read"}</span>
                      <Link href={`/blog/${article.slug}`}>Read Article →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          EXPLORE BY TOPIC
      ======================================== */}
      <section className="blog-topics">
        <div className="blog-container">
          <div className="blog-topics-header">
            <p className="blog-eyebrow">EXPLORE BY PRODUCT</p>
            <h2>
              Find loan solutions
              <span> tailored for you.</span>
            </h2>
          </div>

          <div className="topic-grid">
            <Link href="/personal-loan" className="topic-card">
              <span>01</span>
              <div>
                <h3>Personal Loans</h3>
                <p>Collateral-free instant cash from ₹50,000 to ₹40 Lakhs at competitive interest rates.</p>
              </div>
              <strong>→</strong>
            </Link>

            <Link href="/home-loan" className="topic-card">
              <span>02</span>
              <div>
                <h3>Home Loans</h3>
                <p>Turn dream homes into reality with interest rates starting at 8.40% p.a. & tenures up to 30 years.</p>
              </div>
              <strong>→</strong>
            </Link>

            <Link href="/business-loan" className="topic-card">
              <span>03</span>
              <div>
                <h3>Business Loans</h3>
                <p>Working capital, machinery loans, and unsecured business expansion funding up to ₹5 Crores.</p>
              </div>
              <strong>→</strong>
            </Link>

            <Link href="/loan-against-property" className="topic-card">
              <span>04</span>
              <div>
                <h3>Loan Against Property</h3>
                <p>Unlock the locked equity of your residential or commercial real estate at rock-bottom rates.</p>
              </div>
              <strong>→</strong>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          CALL TO ACTION
      ======================================== */}
      <section className="blog-cta">
        <div className="blog-container">
          <div className="blog-cta-inner">
            <div>
              <p className="blog-eyebrow">READY TO APPLY?</p>
              <h2>
                Check your loan eligibility
                <span> with 30+ lenders in 2 minutes.</span>
              </h2>
            </div>
            <Link href="/" className="blog-cta-button">
              Check Eligibility Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          DISCLAIMER
      ======================================== */}
      <section className="blog-disclaimer">
        <div className="blog-container">
          <p>
            <strong>Disclaimer:</strong> The information published on LoanSaarthi
            guides and blogs is intended purely for general financial education
            and awareness. Loan interest rates, processing fees, loan-to-value
            ratios, and approval parameters are subject to the lending policies of
            individual partner banks and NBFCs. Please verify official terms
            before submitting loan documents.
          </p>
        </div>
      </section>
    </div>
  );
}