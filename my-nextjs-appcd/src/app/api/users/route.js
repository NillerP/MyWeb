import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("my_test_database");
  const collection = db.collection("users");

  try {
    const users = await collection.find({}).toArray();
    return new Response(JSON.stringify({ success: true, data: users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error); // Helpful for debugging
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch users" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("my_test_database");
  const collection = db.collection("users");

  try {
    const body = await req.json();
    const { id, updatedData } = body;

    // Ensure `id` and `updatedData` are present
    if (!id || !updatedData) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "ID and updated data must be provided",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update user:", error); // Helpful for debugging
    return new Response(
      JSON.stringify({ success: false, message: "Failed to update user" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
