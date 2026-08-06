import "./blog.css";

const categories = [
  "All",
  "Personal Loan",
  "Business Loan",
  "Credit Cards",
  "EMI & Finance",
  "Credit Score",
];

const articles = [
  {
    category: "Personal Loan",
    title: "What Is a Personal Loan and How Does It Work?",
    excerpt:
      "Understand the basics of personal loans, common uses, eligibility factors, interest rates, and important things to consider before applying.",
    date: "June 12, 2026",
    readTime: "6 min read",
    image: "/blog/personal-loan.jpg",
    slug: "what-is-a-personal-loan",
  },
  {
    category: "Credit Score",
    title: "Credit Score: What It Means and Why It Matters",
    excerpt:
      "Learn how your credit history can influence your borrowing journey and what responsible credit behaviour looks like.",
    date: "June 08, 2026",
    readTime: "5 min read",
    image: "/blog/credit-score.jpg",
    slug: "credit-score-guide",
  },
  {
    category: "Business Loan",
    title: "A Beginner's Guide to Business Loans",
    excerpt:
      "Explore the basics of business financing and the factors businesses may consider when looking for funding.",
    date: "June 03, 2026",
    readTime: "7 min read",
    image: "/blog/business-loan.jpg",
    slug: "business-loan-guide",
  },
  {
    category: "Credit Cards",
    title: "How to Choose a Credit Card for Your Spending Habits",
    excerpt:
      "Rewards, cashback, annual fees, interest charges and other factors to consider when comparing credit cards.",
    date: "May 28, 2026",
    readTime: "6 min read",
    image: "/blog/credit-card.jpg",
    slug: "how-to-choose-credit-card",
  },
  {
    category: "EMI & Finance",
    title: "Understanding EMI: A Simple Guide for Borrowers",
    excerpt:
      "Learn what EMI means, how loan repayments work, and why interest rates and tenure matter.",
    date: "May 21, 2026",
    readTime: "5 min read",
    image: "/blog/emi.jpg",
    slug: "understanding-emi",
  },
  {
    category: "Personal Loan",
    title: "Things to Consider Before Applying for a Loan",
    excerpt:
      "Before applying, understand your borrowing needs, repayment ability, loan costs and the terms offered by the lender.",
    date: "May 15, 2026",
    readTime: "6 min read",
    image: "/blog/loan-tips.jpg",
    slug: "before-applying-for-loan",
  },
];

export default function BlogPage() {
  return (
    <main className="blog-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="blog-hero">
        <div className="blog-container">

          <div className="blog-hero-content">

            <p className="blog-eyebrow">
              LOANSAARTHI JOURNAL
            </p>

            <h1>
              Financial knowledge
              <span> made simple.</span>
            </h1>

            <p>
              Explore practical guides, financial insights and useful
              information about loans, credit cards, EMIs and personal finance.
            </p>

            <div className="blog-search">
              <input
                type="search"
                placeholder="Search financial articles..."
                aria-label="Search financial articles"
              />

              <button type="button">
                Search
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          CATEGORIES
      ======================================== */}

      <section className="blog-categories">
        <div className="blog-container">

          <div className="blog-category-list">

            {categories.map((category, index) => (
              <button
                key={category}
                className={
                  index === 0
                    ? "blog-category active"
                    : "blog-category"
                }
              >
                {category}
              </button>
            ))}

          </div>

        </div>
      </section>


      {/* ========================================
          FEATURED ARTICLE
      ======================================== */}

      <section className="blog-featured">
        <div className="blog-container">

          <article className="featured-article">

            <div className="featured-image">
              <div className="featured-image-placeholder">
                <span>LOANSAARTHI</span>
                <strong>Financial Guide</strong>
              </div>
            </div>

            <div className="featured-content">

              <p className="article-category">
                PERSONAL FINANCE
              </p>

              <h2>
                Make better financial decisions
                with the right information.
              </h2>

              <p>
                Whether you're considering a loan, comparing credit cards,
                planning your EMI or simply trying to understand your credit
                score, our guides are designed to make financial concepts
                easier to understand.
              </p>

              <div className="article-meta">
                <span>LoanSaarthi Editorial Team</span>
                <span>•</span>
                <span>8 min read</span>
              </div>

              <a
                href="/Blog/financial-guide"
                className="blog-read-more"
              >
                Read the guide →
              </a>

            </div>

          </article>

        </div>
      </section>


      {/* ========================================
          LATEST ARTICLES
      ======================================== */}

      <section className="blog-latest">

        <div className="blog-container">

          <div className="blog-section-header">

            <div>
              <p className="blog-eyebrow">
                LATEST FROM LOANSAARTHI
              </p>

              <h2>
                Explore our latest
                <span> financial guides.</span>
              </h2>
            </div>

            <p>
              Simple explanations and practical information to help you
              understand important financial topics.
            </p>

          </div>


          <div className="article-grid">

            {articles.map((article) => (

              <article
                className="article-card"
                key={article.slug}
              >

                <a
                  href={`/Blog/${article.slug}`}
                  className="article-image"
                >
                  <div className="article-image-placeholder">
                    <span>{article.category}</span>
                  </div>
                </a>

                <div className="article-card-content">

                  <div className="article-card-top">

                    <span className="article-category">
                      {article.category}
                    </span>

                    <span className="article-date">
                      {article.date}
                    </span>

                  </div>

                  <h3>
                    <a href={`/Blog/${article.slug}`}>
                      {article.title}
                    </a>
                  </h3>

                  <p>
                    {article.excerpt}
                  </p>

                  <div className="article-card-footer">

                    <span>
                      {article.readTime}
                    </span>

                    <a
                      href={`/Blog/${article.slug}`}
                    >
                      Read →
                    </a>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* ========================================
          FINANCIAL TOPICS
      ======================================== */}

      <section className="blog-topics">

        <div className="blog-container">

          <div className="blog-topics-header">

            <p className="blog-eyebrow">
              EXPLORE BY TOPIC
            </p>

            <h2>
              Find information
              <span> that matters to you.</span>
            </h2>

          </div>


          <div className="topic-grid">

            <a
              href="/Loan"
              className="topic-card"
            >
              <span>01</span>

              <div>
                <h3>Loans</h3>
                <p>
                  Understand different types of loans and the borrowing
                  process.
                </p>
              </div>

              <strong>→</strong>
            </a>


            <a
              href="/Credit_card"
              className="topic-card"
            >
              <span>02</span>

              <div>
                <h3>Credit Cards</h3>
                <p>
                  Learn about rewards, cashback, fees and responsible usage.
                </p>
              </div>

              <strong>→</strong>
            </a>


            <a
              href="/EMI_calculator"
              className="topic-card"
            >
              <span>03</span>

              <div>
                <h3>EMI & Finance</h3>
                <p>
                  Understand EMIs, repayment periods and loan calculations.
                </p>
              </div>

              <strong>→</strong>
            </a>


            <a
              href="/Blog/credit-score-guide"
              className="topic-card"
            >
              <span>04</span>

              <div>
                <h3>Credit Score</h3>
                <p>
                  Learn how responsible credit behaviour can support your
                  financial journey.
                </p>
              </div>

              <strong>→</strong>
            </a>

          </div>

        </div>

      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="blog-cta">

        <div className="blog-container">

          <div className="blog-cta-inner">

            <div>

              <p className="blog-eyebrow">
                HAVE QUESTIONS?
              </p>

              <h2>
                Your financial journey
                <span> starts with understanding.</span>
              </h2>

            </div>

            <a
              href="/Contact_Us"
              className="blog-cta-button"
            >
              Talk to LoanSaarthi →
            </a>

          </div>

        </div>

      </section>


      {/* ========================================
          DISCLAIMER
      ======================================== */}

      <section className="blog-disclaimer">

        <div className="blog-container">

          <p>
            <strong>Disclaimer:</strong> The information published on this
            blog is intended for general educational purposes and should not
            be considered financial, legal or investment advice. Loan terms,
            interest rates, fees, eligibility criteria and other conditions
            vary by lender and product. Always verify the latest information
            directly with the relevant lender or financial institution before
            making a financial decision.
          </p>

        </div>

      </section>

    </main>
  );
}