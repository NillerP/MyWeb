// app/page.js (or any other component file)

"use client"; // If you're using Client Components

import { useState } from "react";

export default function CoinDeduction() {
  const [message, setMessage] = useState("");
  const userId = "user-id"; // Replace this with the actual user ID from your context or state

  const handleDeductCoins = async () => {
    const coinsToDeduct = 500;

    try {
      const response = await fetch("/api/coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, coinsToDeduct }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error deducting coins:", error);
      setMessage("An error occurred while deducting coins.");
    }
  };

  return (
    <div>
      <button onClick={handleDeductCoins}>Deduct 500 Coins</button>
      {message && <p>{message}</p>}
    </div>
  );
}
