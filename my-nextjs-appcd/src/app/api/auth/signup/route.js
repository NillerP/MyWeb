import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcrypt";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { username, password, email } = await req.json();

    // Validate username: alphanumeric and non-empty
    if (!username || !validator.isAlphanumeric(username)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid username format. Only letters and numbers are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate email: non-empty and valid email format
    if (!email || !validator.isEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format.",
        },
        { status: 400 }
      );
    }

    // Validate password: at least 6 characters long
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
    const normalizedEmail = validator.normalizeEmail(email);

    const client = await clientPromise;
    const db = client.db("my_test_database");
    const collection = db.collection("users");

    // Check if the user already exists
    const existingUser = await collection.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User or email already exists" },
        { status: 400 }
      );
    }
    const userId = uuidv4();
    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
    await collection.insertOne({
      userId: userId,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      coins: 1000,
      isAdmin: false,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: userId,
    });
  } catch (error) {
    console.error("Error during signup:", error.message, error.stack); // Log detailed error info
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
