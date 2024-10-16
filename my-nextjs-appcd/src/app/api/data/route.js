// app/api/data/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb"; // Adjust the path based on where your MongoDB connection file is located

export async function GET() {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;

    // Specify the database and collection
    const db = client.db("my_test_database");
    const collection = db.collection("users");

    // Fetch all users from the "users" collection
    const users = await collection.find({}).toArray();

    // Return the users as a JSON response
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching data from the database:", error);

    // Return an error response if something goes wrong
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
