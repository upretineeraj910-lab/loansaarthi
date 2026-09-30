import { notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import "./single-blog.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
      <p>A personal loan is an unsecured financing option that allows you to borrow funds without pledging any collateral or security such as gold or property. Because of its flexibility, personal loans are commonly used for medical emergencies, home renovations, debt consolidation, weddings, and higher education.</p>
      
      <h2>Key Factors That Determine Your Interest Rate</h2>
      <ul>
        <li><strong>Credit Score (CIBIL):</strong> A score of 750+ qualifies you for the most competitive interest rates (starting as low as 10.49% p.a.).</li>
        <li><strong>Monthly Net Income:</strong> Salaried individuals earning above ₹25,000/month in Tier-1 cities or ₹20,000 in Tier-2 cities have higher approval odds.</li>
        <li><strong>Employer Profile:</strong> Working with top MNCs, government bodies, or Category-A corporate firms gives you access to special corporate rate discounts.</li>
        <li><strong>Fixed Obligation to Income Ratio (FOIR):</strong> Lenders prefer your total ongoing EMIs to be below 40-50% of your net monthly earnings.</li>
      </ul>

      <h2>Documents Required for Quick Processing</h2>
      <p>To ensure same-day digital sanction, keep the following KYC and income papers ready:</p>
      <ol>
        <li>PAN Card and Aadhaar Card (duly verified via DigiLocker OTP).</li>
        <li>Latest 3 months' salary slips.</li>
        <li>Latest 6 months' bank statements reflecting salary credits.</li>
        <li>Current residential address proof (Utility bill or Rental agreement).</li>
      </ol>

      <h2>How LoanSaarthi Helps You Secure the Best Deal</h2>
      <p>Instead of applying with multiple banks separately (which generates multiple hard inquiries on your credit bureau and lowers your score), LoanSaarthi matches your financial profile with 30+ leading banks and NBFCs through a single soft-check application.</p>
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
      <p>In India, banks use your 3-digit CIBIL score (ranging between 300 and 900) to gauge your repayment track record. A score above 750 categorizes you as a prime borrower, qualifying you for pre-approved loans, waiver of processing fees, and significantly reduced interest rates.</p>

      <h2>4 Steps to Improve Your Score in 90 Days</h2>
      <h3>1. Never Miss or Delay an EMI or Credit Card Payment</h3>
      <p>Payment history accounts for approximately 35% of your total credit score. Even a single 30-day delay on a credit card bill can knock 40-60 points off your score. Set up automated standing instructions for full statement payments.</p>

      <h3>2. Maintain Credit Utilization Below 30%</h3>
      <p>If your total credit card limit is ₹1,00,000, keep your monthly spending under ₹30,000. Spending 80-90% of your limit signals credit hunger to scoring algorithms, which hurts your score even if you pay on time.</p>

      <h3>3. Check Your Credit Report for Inaccuracies</h3>
      <p>Frequently, banks report loans that have already been settled or closed as 'active' due to reporting delays. Raising an online dispute on the CIBIL portal can restore your score within 30 to 45 days.</p>

      <h3>4. Avoid Applying for Multiple Credit Cards Simultaneously</h3>
      <p>Every loan application triggers a 'Hard Inquiry' by the bank. Multiple hard inquiries within a short timeframe create negative scoring adjustments.</p>
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
      <h2>Tax Deductions Available on Home Loans in India</h2>
      <p>Buying a home is one of life's biggest milestones. To encourage homeownership, the Income Tax Act provides attractive tax deductions on both the interest and principal components of your home loan EMIs under the old tax regime.</p>

      <h2>1. Section 24(b) - Interest Deduction</h2>
      <p>You can claim up to <strong>₹2,00,000 per financial year</strong> on the interest paid towards a self-occupied property. If the property is rented out, the entire interest can be claimed as a deduction against rental income subject to overall loss limits.</p>

      <h2>2. Section 80C - Principal Repayment</h2>
      <p>The principal portion of your EMI qualifies for tax deduction under Section 80C up to a cumulative limit of <strong>₹1,50,000 per year</strong>. Stamp duty and registration charges paid during property purchase are also deductible under this section.</p>

      <h2>Joint Home Loan: Double Your Tax Exemption</h2>
      <p>If you take a home loan jointly with your spouse or family member and both are co-owners, each co-borrower can independently claim up to ₹2 Lakh on interest and ₹1.5 Lakh on principal, doubling your household tax relief to up to ₹7,00,000 annually!</p>
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
      <h2>Funding Options for Growing Indian Businesses</h2>
      <p>Managing cash flow cycles, supplier credit, inventory stocking, and business expansion often demands external debt. Two prominent borrowing tools available to business owners are Business Term Loans and Dropline Overdraft (DOD) facilities.</p>

      <h2>What is a Business Term Loan?</h2>
      <p>A term loan provides a lump-sum amount upfront that must be paid back in predetermined monthly EMIs over a tenure of 1 to 5 years. Interest is charged on the entire disbursed capital from day one.</p>

      <h2>What is a Dropline Overdraft (DOD)?</h2>
      <p>A Dropline Overdraft sanctions a credit limit in your current account. You only pay interest on the exact amount you withdraw and for the number of days you utilize it. The drawing power gradually drops every month, ensuring systematic deleveraging without bulky principal bullet payments.</p>

      <h2>Which One Should You Choose?</h2>
      <ul>
        <li>Choose a <strong>Business Term Loan</strong> for fixed capital expenses like purchasing machinery, opening a new branch, or IT infrastructure.</li>
        <li>Choose a <strong>Dropline Overdraft</strong> for fluctuating working capital needs, vendor invoices, seasonal inventory peaks, or receivables gaps.</li>
      </ul>
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
      <h2>Unlock Your Real Estate Wealth</h2>
      <p>Loan Against Property (LAP) is a secured loan where you mortgage an existing self-occupied residential house, commercial office, or industrial property to access funding of up to 60-70% of the property's registered market valuation.</p>

      <h2>Why LAP is Better Than an Unsecured Loan</h2>
      <ul>
        <li><strong>Low Interest Rates:</strong> LAP rates typically range between 8.75% and 11.5% p.a., nearly half the cost of unsecured personal or business loans.</li>
        <li><strong>Longer Repayment Tenure:</strong> Repay comfortably over 10 to 15 years, keeping monthly EMIs low and affordable.</li>
        <li><strong>High Loan Amount:</strong> Eligible borrowers can secure funding from ₹25 Lakhs up to ₹15 Crores.</li>
        <li><strong>Retain Property Ownership:</strong> You retain complete possession and usage of your property while enjoying liquid capital.</li>
      </ul>
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
      <h2>The Reality of a 20-Year Home Loan</h2>
      <p>On a ₹50,00,000 home loan taken at 8.75% for 20 years, your total interest payout is approximately ₹52,18,000 — meaning you pay more in interest than the original property price borrowed!</p>

      <h2>3 Proven Prepayment Hacks</h2>
      <h3>1. Pay 1 Extra EMI Every Year</h3>
      <p>Simply paying 13 EMIs in a year instead of 12 directly attacks the principal balance. This single habit can trim your 20-year tenure down by nearly 4.5 years, saving over ₹9.5 Lakhs in interest!</p>

      <h3>2. Increase Your EMI by 5% with Every Annual Salary Hike</h3>
      <p>As your salary rises each year, step up your EMI by 5%. This gradual increase is barely felt in monthly household budgets, yet it shrinks your overall repayment tenure by nearly 8 years.</p>

      <h3>3. Channel Annual Bonuses and Tax Refunds Towards Part-Prepayment</h3>
      <p>RBI rules mandate zero prepayment penalty on floating-rate home loans for individual borrowers. Direct lump sums from annual bonuses, maturities, or incentives into principal prepayment.</p>
    `,
  },
];

async function getArticle(slug: string): Promise<BlogArticle | null> {
  try {
    await connectToDatabase();
    const dbBlog = await Blog.findOne({ slug }).lean();
    if (dbBlog) {
      return {
        _id: String(dbBlog._id),
        title: dbBlog.title,
        slug: dbBlog.slug,
        category: dbBlog.category,
        excerpt: dbBlog.excerpt,
        content: dbBlog.content,
        readTime: dbBlog.readTime || "5 min read",
        createdAt: dbBlog.createdAt,
        authorName: "LoanSaarthi Editorial Team",
      };
    }
  } catch (err) {
    console.error("Error fetching blog from DB, checking fallback data:", err);
  }

  // Fallback data check
  const fallback = FALLBACK_BLOGS.find((b: BlogArticle) => b.slug === slug);
  return fallback || null;
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | LoanSaarthi",
      description: "The requested financial guide could not be found.",
    };
  }

  return {
    title: `${article.title} | LoanSaarthi Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

// 2. Main Page Render
export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Get 2 related articles
  const relatedArticles = FALLBACK_BLOGS.filter(
    (b: BlogArticle) => b.slug !== slug
  ).slice(0, 2);

  const formattedDate = (() => {
    try {
      const d = new Date(article.createdAt);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Recently Published";
    }
  })();

  return (
    <article className="single-blog-page">
      <div className="single-blog-container">
        {/* BREADCRUMBS */}
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <Link href="/blog">Blog</Link>
          <span className="separator">/</span>
          <span>{article.category}</span>
          <span className="separator">/</span>
          <span className="current">{article.title}</span>
        </nav>

        {/* ARTICLE HEADER */}
        <header className="article-header">
          <span className="article-badge">{article.category}</span>
          <h1>{article.title}</h1>

          <div className="article-header-meta">
            <span>
              By <strong>{article.authorName || "LoanSaarthi Editorial Team"}</strong>
            </span>
            <span>•</span>
            <span>{article.readTime || "5 min read"}</span>
            <span>•</span>
            <span>Published on {formattedDate}</span>
          </div>
        </header>

        {/* SUMMARY CALLOUT */}
        {article.excerpt && (
          <div className="article-summary-box">
            <h4>Key Takeaway</h4>
            <p>{article.excerpt}</p>
          </div>
        )}

        {/* RICH ARTICLE BODY */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* IN-ARTICLE CTA BOX */}
        <div className="article-inline-cta">
          <div>
            <h3>Need a {article.category} with Quick Approval?</h3>
            <p>
              Compare interest rates across 30+ leading banks & NBFCs with zero
              impact on your credit score. Transparent, fast, and completely
              digital.
            </p>
          </div>
          <Link href="/" className="article-cta-btn">
            Check Loan Eligibility →
          </Link>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="article-footer-nav">
          <Link href="/blog" className="back-to-blogs-link">
            ← Back to all financial guides
          </Link>
          <Link href="/contact-us" className="back-to-blogs-link">
            Have questions? Contact an expert →
          </Link>
        </div>

        {/* RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section">
            <h3>Recommended Financial Guides</h3>
            <div className="related-articles-grid">
              {relatedArticles.map((rel: BlogArticle) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="related-card"
                >
                  <div>
                    <span className="cat">{rel.category}</span>
                    <h4>{rel.title}</h4>
                    <p>{rel.excerpt}</p>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--brand-green)",
                      fontWeight: 700,
                      marginTop: "16px",
                      display: "block",
                    }}
                  >
                    Read Guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}