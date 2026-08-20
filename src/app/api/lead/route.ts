// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

// // Simple Inline Schema (alag se schema file banane ki bhi zarurat nahi padegi)
// const LeadSchema = new mongoose.Schema(
//   {
//     phone: { type: String, required: true },
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     occupation: { type: String, default: "Salaried" },
//     loanType: { type: String, default: "Home Loan" },
//     isVerified: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { phone, fullName, email, occupation, loanType } = body;

//     if (!phone || !fullName || !email) {
//       return NextResponse.json(
//         { success: false, message: "Required fields missing" },
//         { status: 400 }
//       );
//     }

//     // Agar MongoDB connected nahi hai toh connect karega
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI!);
//     }

//     const newLead = await Lead.create({
//       phone,
//       fullName,
//       email,
//       occupation,
//       loanType,
//       isVerified: true,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Lead saved successfully",
//       data: newLead,
//     });
//   } catch (error: any) {
//     console.error("Lead Save Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    occupation: { type: String, default: "Salaried" },
    loanType: { type: String, default: "Home Loan" },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, fullName, email, occupation, loanType } = body;

    if (!phone || !fullName || !email) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is missing in .env.local");
      return NextResponse.json(
        { success: false, message: "Database URI not configured" },
        { status: 500 }
      );
    }

    // Connect with a 5-second timeout to avoid infinite pending state
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
    }

    const newLead = await Lead.create({
      phone,
      fullName,
      email,
      occupation,
      loanType,
      isVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully",
      data: newLead,
    });
  } catch (error: any) {
    console.error("Database / API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to connect to database" },
      { status: 500 }
    );
  }
}