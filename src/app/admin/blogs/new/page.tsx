"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Loan Against Property",
  "Credit Score",
  "Financial Advice",
];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Personal Loan",
    readTime: "5 min read",
    excerpt: "",
    content: "",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById(
      "content-textarea"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText =
      formData.content.substring(start, end) || "Your text here";
    const replacement = openTag + selectedText + closeTag;

    const newContent =
      formData.content.substring(0, start) +
      replacement +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length
      );
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.slug.trim()) {
        throw new Error("Title and Slug are required.");
      }
      if (!formData.excerpt.trim()) {
        throw new Error("Excerpt summary is required.");
      }
      if (!formData.content.trim()) {
        throw new Error("Article content is required.");
      }

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create blog post.");
      }

      setSuccessMsg("Blog published successfully! Redirecting...");
      setTimeout(() => {
        router.push("/blog/" + formData.slug);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 6px 0",
              color: "#0f172a",
            }}
          >
            Publish New Financial Guide
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Create and publish articles to the LoanSaarthi knowledge hub.
          </p>
        </div>
        <Link
          href="/blog"
          style={{
            fontSize: "13px",
            color: "#6FAE45",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid #6FAE45",
            padding: "8px 14px",
            borderRadius: "6px",
          }}
        >
          ← View Blog Page
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          style={{
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: activeTab === "edit" ? "2px solid #6FAE45" : "none",
            color: activeTab === "edit" ? "#6FAE45" : "#64748b",
            cursor: "pointer",
          }}
        >
          Edit Form
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          style={{
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "preview" ? "2px solid #6FAE45" : "none",
            color: activeTab === "preview" ? "#6FAE45" : "#64748b",
            cursor: "pointer",
          }}
        >
          Live Preview
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            padding: "12px 16px",
            background: "#f0fdf4",
            color: "#15803d",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      {activeTab === "preview" ? (
        <div
          style={{
            background: "#ffffff",
            padding: "32px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#6FAE45",
              background: "#EAF4E4",
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            {formData.category}
          </span>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              margin: "16px 0 10px 0",
              color: "#0f172a",
            }}
          >
            {formData.title || "Your Blog Title Will Appear Here"}
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            Slug: <code>/blog/{formData.slug || "your-slug"}</code> •{" "}
            {formData.readTime}
          </p>
          {formData.excerpt && (
            <div
              style={{
                background: "#f8fafc",
                borderLeft: "4px solid #6FAE45",
                padding: "14px 18px",
                borderRadius: "4px",
                marginBottom: "24px",
                fontStyle: "italic",
                color: "#334155",
              }}
            >
              {formData.excerpt}
            </div>
          )}
          <div
            style={{ lineHeight: 1.8, color: "#334155" }}
            dangerouslySetInnerHTML={{
              __html:
                formData.content ||
                "<p>Your article content will be previewed here...</p>",
            }}
          />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
                color: "#334155",
              }}
            >
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Complete Personal Loan Eligibility and Interest Rates Guide 2026"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  color: "#334155",
                }}
              >
                URL Slug * (Auto-generated)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "#f8fafc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  color: "#334155",
                }}
              >
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "#ffffff",
                  boxSizing: "border-box",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
                color: "#334155",
              }}
            >
              Estimated Read Time
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
              placeholder="e.g. 6 min read"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
                color: "#334155",
              }}
            >
              Excerpt / Key Takeaway (Short Summary) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Brief summary displayed on cards and search results..."
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Article Body (HTML supported) *
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => insertTag("<h2>", "</h2>")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("<h3>", "</h3>")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("<p>", "</p>")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("<strong>", "</strong>")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  List
                </button>
              </div>
            </div>

            <textarea
              id="content-textarea"
              required
              rows={12}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="<h2>Introduction</h2><p>Write your article text here...</p>"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "monospace",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#6FAE45",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Publishing to Database..."
                : "🚀 Publish Blog Guide"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              style={{
                backgroundColor: "#ffffff",
                color: "#334155",
                fontWeight: 600,
                fontSize: "14px",
                padding: "12px 20px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Preview Article
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
