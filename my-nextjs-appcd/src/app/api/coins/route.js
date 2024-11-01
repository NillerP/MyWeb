import clientPromise from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const { userId1, coins } = await request.json();

    // Basic validation
    if (!userId1 || typeof coins !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid userId or coins value" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("my_test_database");
    const collection = db.collection("users");

    // Attempt the update
    const result = await collection.updateOne(
      { userId: userId1 },
      { $set: { coins } }
    );

    // Check if the update was acknowledged
    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "No document found or coins already set" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
