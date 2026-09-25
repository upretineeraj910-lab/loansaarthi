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

const Lead =
  mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

// =========================
// GET LEADS (PAGINATED & SEARCH)
// =========================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10);
    const search = searchParams.get("search")?.trim() || "";

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { occupation: { $regex: search, $options: "i" } },
        { loanType: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    await connectDB();

    const [total, leads] = await Promise.all([
      Lead.countDocuments(query),
      Lead.find(query)
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

// =========================
// DELETE LEAD
// =========================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Lead ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Lead deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE LEAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete lead" },
      { status: 500 }
    );
  }
}