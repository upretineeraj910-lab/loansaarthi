// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

// const LeadSchema = new mongoose.Schema(
//   {
//     phone: { type: String, required: true },
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     occupation: { type: String, default: "Salaried" },
//     loanType: { type: String, default: "Home Loan" },
//     income:{ type: String, required: true },
//     isVerified: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { phone, fullName, email, occupation, loanType,income } = body;

//     if (!phone || !fullName || !email || !income) {
//       return NextResponse.json(
//         { success: false, message: "Required fields missing" },
//         { status: 400 }
//       );
//     }

//     const uri = process.env.MONGODB_URI;
//     if (!uri) {
//       console.error("MONGODB_URI is missing in .env.local");
//       return NextResponse.json(
//         { success: false, message: "Database URI not configured" },
//         { status: 500 }
//       );
//     }

//     // Connect with a 5-second timeout to avoid infinite pending state
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(uri, {
//         serverSelectionTimeoutMS: 5000,
//         bufferCommands: false,
//       });
//     }

//     const newLead = await Lead.create({
//       phone,
//       fullName,
//       email,
//       occupation,
//       loanType,
//       income,
//       isVerified: true,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Lead saved successfully",
//       data: newLead,
//     });
//   } catch (error: any) {
//     console.error("Database / API Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to connect to database" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

const LeadSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
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
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lead =
  mongoose.models.Lead || mongoose.model("Lead", LeadSchema);


// =========================
// GET ALL LEADS
// =========================
export async function GET() {
  try {
    await connectDB();

    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        leads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leads",
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

    if (!phone || !fullName || !email || !income) {
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
      fullName,
      email,
      occupation,
      loanType,
      income,
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
  } catch (error) {
    console.error("POST LEAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save lead",
      },
      { status: 500 }
    );
  }
}