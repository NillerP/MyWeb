// app/signup/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import styles from "@/app/styles/signup.module.css";
import withAuth from "@/app/components/withAuth";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Simple client-side validation
  const validateForm = () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.success) {
          setSuccess("Signup successful!");
          setUsername("");
          setEmail("");
          setPassword("");
          router.push("/login");
        } else {
          setError(result.error || "Signup failed");
        }
      } else {
        setError(`Error: ${response.status} - ${result.error}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  if (isAuthenticated) {
    router.push("/"); // Redirect to home page if already authenticated
    return null; // Prevent rendering the signup form
  }

  return (
    <div className={styles.box}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.text}>
          <h1>Sign Up</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.loginbutton}>
          <button type="submit">Sign Up</button>
        </div>
        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

// Wrap the Signup component with the withAuthRedirect HOC
export default withAuth(Signup, "/");
