import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  // Extract the token from the Authorization header
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  // Check if token is provided
  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token provided" },
      { status: 401 }
    );
  }

  // Check if JWT_SECRET is available
  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Example user data based on decoded token
    const user = {
      username: decoded.username,
      _id: decoded._id,
      isAdmin: decoded.isAdmin,
      email: decoded.email,
      coins: decoded.coins,
    };

    // Return success response with user data
    return NextResponse.json({ success: true, user });
  } catch (error) {
    // Handle token verification errors
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
