import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return NextResponse.json({
        available: true,
        email: normalizedEmail,
        suggestions: [],
      });
    }

    // Generate smart suggestions if email is already taken
    const [username, domain] = normalizedEmail.split("@");
    const targetDomain = domain || "loansaarthi.com";

    // Candidate prefixes
    const candidates: string[] = [
      `${username}1@${targetDomain}`,
      `${username}2@${targetDomain}`,
      `${username}7@${targetDomain}`,
      `${username}_01@${targetDomain}`,
      `${username.replace(/_/g, ".")}@${targetDomain}`,
      `${username}${Math.floor(10 + Math.random() * 90)}@${targetDomain}`,
    ];

    // Remove duplicates
    const uniqueCandidates = Array.from(new Set(candidates)).filter(
      (c) => c !== normalizedEmail
    );

    // Find which candidates already exist in the database
    const foundUsers = await User.find({
      email: { $in: uniqueCandidates },
    }).select("email");

    const takenEmails = new Set(foundUsers.map((u) => u.email.toLowerCase()));

    // Filter to strictly available suggestions
    const availableSuggestions = uniqueCandidates
      .filter((candidate) => !takenEmails.has(candidate))
      .slice(0, 3);

    return NextResponse.json({
      available: false,
      email: normalizedEmail,
      suggestions: availableSuggestions,
    });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Failed to verify email availability" },
      { status: 500 }
    );
  }
}

