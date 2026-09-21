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

    return NextResponse.json({
      authenticated: true,
      role: payload.role,
    });
  } catch (error) {
    console.error("AUTH ME ERROR:");

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}