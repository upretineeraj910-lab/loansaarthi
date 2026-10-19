import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const LeadSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    occupation: {
      type: String,
      default: "Salaried",
    },
    loanType: {
      type: String,
      default: "Home Loan",
    },
    income: {
      type: String,
    },
    loanAmount: {
      type: mongoose.Schema.Types.Mixed,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ fullName: 1 });

const Lead =
  mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// =========================
// GET LEADS (PAGINATED & SEARCH)
// =========================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10));
    const search = searchParams.get("search")?.trim() || "";

    const query: Record<string, any> = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { fullName: { $regex: safeSearch, $options: "i" } },
        { name: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { occupation: { $regex: safeSearch, $options: "i" } },
        { loanType: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    await connectDB();

    const [total, leads] = await Promise.all([
      Lead.countDocuments(query),
      Lead.find(query)
        .select("fullName name phone email occupation loanType income loanAmount isVerified createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        success: true,
        leads,
        total,
        page,
        limit,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET LEADS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch leads",
      },
      { status: 500 }
    );
  }
}

// =========================
// CREATE NEW LEAD
// =========================
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      phone,
      fullName,
      email,
      occupation,
      loanType,
      income,
    } = body;

    const leadName = fullName || body.name;
    const leadIncome = income || (body.loanAmount ? String(body.loanAmount) : "");

    if (!phone || !leadName || !email || !leadIncome) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone, full name, email and income are required",
        },
        { status: 400 }
      );
    }

    const newLead = await Lead.create({
      phone,
      fullName: leadName,
      email,
      occupation: occupation || "Salaried",
      loanType: loanType || "Home Loan",
      income: leadIncome,
      isVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead saved successfully",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST LEAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to save lead",
      },
      { status: 500 }
    );
  }
}

