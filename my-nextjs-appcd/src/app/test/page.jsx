"use client";

import { useState } from "react";

export default function HomePage() {
  const [userId1, setUserId] = useState("");
  const [coins, setCoins] = useState(0);
  const [status, setStatus] = useState("");

  const updateCoins = async () => {
    try {
      const response = await fetch("/api/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId1, coins }),
      });

      // Attempt to parse JSON if response is ok and contains valid JSON
      const data = response.ok ? await response.json() : null;

      if (data && data.success) {
        setStatus(`Success: ${JSON.stringify(data)}`);
      } else {
        setStatus(`Error: ${data ? data.error : "Unknown error"}`);
      }
    } catch (error) {
      setStatus(`Request failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Update Coins</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId1}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Coins"
        value={coins}
        onChange={(e) => setCoins(Number(e.target.value))}
      />
      <button onClick={updateCoins}>Update Coins</button>
      <p>{status}</p>
    </div>
  );
}
