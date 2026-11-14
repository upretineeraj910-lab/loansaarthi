import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import EligibilityLead from "@/models/EligibilityLead";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const rawPhone = (body.phone || body.number || "").toString().trim();
    const digitsOnly = rawPhone.replace(/\D/g, "");
    const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : rawPhone;

    const leadName = (body.fullName || body.name || "").toString().trim();

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: "Valid 10-digit mobile number is required" },
        { status: 400 }
      );
    }

    if (!leadName) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 }
      );
    }

    const payload = {
      fullName: leadName,
      name: leadName,
      phone: formattedPhone,
      loanType: body.loanType || "Personal Loan",
      occupation: body.occupation || "Salaried",
      monthlyIncome: Number(body.monthlyIncome || body.income || body.salary || 0),
      existingEmi: Number(body.existingEmi || 0),
      cibil: body.cibil || "unknown",
      maxLoanEligible: Number(body.loanAmount || body.maxLoan || 0),
      estimatedEmi: Number(body.emi || 0),
      source: "Eligibility Checker",
    };

    // Upsert into dedicated "eligibility_leads" collection
    const savedRecord = await EligibilityLead.findOneAndUpdate(
      { phone: formattedPhone },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Eligibility lead recorded successfully",
        data: savedRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Eligibility lead save error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to save eligibility record",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const records = await EligibilityLead.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch records",
      },
      { status: 500 }
    );
  }
}
