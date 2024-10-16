// app/components/AuthButton.js
"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        logout(); // Update context state
        router.push("/login"); // Redirect to login page
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      router.push("/login");
    }
  };

  return (
    <button onClick={handleClick}>
      {isAuthenticated ? "Logout" : "Login"}
    </button>
  );
}
