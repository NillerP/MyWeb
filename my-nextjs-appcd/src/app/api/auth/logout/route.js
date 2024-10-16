// app/api/auth/logout/route.js (Next.js 13+ App Router)
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear cookies or tokens (if you're using cookie-based authentication)
    return NextResponse.json(
      { success: true },
      {
        headers: { "Set-Cookie": "token=; Max-Age=0; path=/" },
      }
    );

    // If you're using sessions, add your session invalidation logic here
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { success: false, message: "Error during logout" },
      { status: 500 }
    );
  }
}
