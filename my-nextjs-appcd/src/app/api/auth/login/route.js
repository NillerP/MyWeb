// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb"; // Ensure the path is correct for your project structure
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// Check if the JWT_SECRET environment variable is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validate username: ensure it's alphanumeric and non-empty
    if (!username || !validator.isAlphanumeric(username)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid username format. Only alphanumeric characters are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate password: ensure it's at least 6 characters long
    if (!password || !validator.isLength(password, { min: 6 })) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    // Normalize and sanitize inputs
    const normalizedUsername = validator.trim(username).toLowerCase();
    const sanitizedPassword = validator.trim(password);

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("my_test_database");
    const collection = db.collection("users");

    // Look for the user in the database
    const user = await collection.findOne({ username: normalizedUsername });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(
      sanitizedPassword,
      user.password
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        coins: user.coins,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return success response with the token and user data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        coins: user.coins,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
