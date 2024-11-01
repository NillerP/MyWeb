import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function GET(request, { params }) {
  const client = await clientPromise;
  const db = client.db("my_test_database"); // Replace with your database name

  // Extract userId from params
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Convert userId to ObjectId
  let userIdObjectId;
  try {
    userIdObjectId = new ObjectId(userId); // Convert to ObjectId
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid User ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Find the user by userId
  const userCoins = await db
    .collection("users")
    .findOne({ _id: userIdObjectId });

  if (!userCoins) {
    return new Response(
      JSON.stringify({ error: "User not found or no coins found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify(userCoins), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
