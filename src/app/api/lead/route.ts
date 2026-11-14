import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getAuthUser, canViewLeadVault, isSuperAdmin } from "@/lib/crmAuth";

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
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please sign in to view customer leads." },
        { status: 401 }
      );
    }

    if (!canViewLeadVault(authUser.role)) {
      return NextResponse.json(
        { success: false, message: "Access Denied: You do not have permission to view customer leads." },
        { status: 403 }
      );
    }

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

    const rawPhone = (body.phone || body.number || "").toString().trim();
    // Extract last 10 digits
    const digitsOnly = rawPhone.replace(/\D/g, "");
    const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : rawPhone;

    const leadName = (body.fullName || body.name || "").toString().trim();
    const leadEmail = (body.email || "").toString().trim();
    const leadIncome = String(
      body.income || body.salary || body.loanAmount || ""
    ).trim();
    const leadLoanType = body.loanType || "Personal Loan";
    const leadOccupation = body.occupation || "Salaried";
    const leadLoanAmount = body.loanAmount || body.maxLoan;

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 10-digit mobile number is required",
        },
        { status: 400 }
      );
    }

    if (!leadName) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required",
        },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      phone: formattedPhone,
      fullName: leadName,
      name: leadName,
      occupation: leadOccupation,
      loanType: leadLoanType,
      isVerified: true,
    };

    if (leadEmail) updatePayload.email = leadEmail;
    if (leadIncome) updatePayload.income = leadIncome;
    if (leadLoanAmount) updatePayload.loanAmount = leadLoanAmount;

    // Use findOneAndUpdate with upsert to prevent duplicate key error if user submits again
    const lead = await Lead.findOneAndUpdate(
      {
        $or: [
          { phone: formattedPhone },
          { phone: cleanPhone },
          ...(digitsOnly ? [{ phone: digitsOnly }] : []),
        ],
      },
      {
        $set: updatePayload,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Lead saved successfully",
        lead,
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
// DELETE LEAD (SUPER ADMIN ONLY)
// =========================
export async function DELETE(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!isSuperAdmin(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: Only Super Admin can delete customer leads.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Lead ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    await Lead.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Lead permanently removed from vault.",
    });
  } catch (error: any) {
    console.error("DELETE LEAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete lead" },
      { status: 500 }
    );
  }
}

