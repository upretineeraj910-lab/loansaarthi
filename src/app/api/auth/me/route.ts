import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(
      token,
      secret
    );

    let name = payload.name as string | undefined;

    if (!name && payload.id) {
      try {
        const connectToDatabase = (await import("@/lib/mongodb")).default;
        const User = (await import("@/models/User")).default;
        await connectToDatabase();
        const userDoc = await User.findById(payload.id).select("name").lean();
        if (userDoc?.name) {
          name = userDoc.name;
        }
      } catch (err) {
        // Fallback to email prefix
      }
    }

    if (!name && payload.email) {
      const emailStr = payload.email as string;
      const prefix = emailStr.split("@")[0];
      name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    return NextResponse.json({
      authenticated: true,
      id: payload.id,
      email: payload.email,
      name: name || "User",
      role: payload.role,
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}