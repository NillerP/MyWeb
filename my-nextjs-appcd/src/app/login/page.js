// app/login/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import validator from "validator";
import styles from "@/app/styles/login.module.css";
import withAuth from "@/app/components/withAuth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setUsername(sanitizedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validator.isAlphanumeric(username)) {
      setError(
        "Invalid username format. Only letters and numbers are allowed."
      );
      return;
    }

    if (!validator.isLength(password, { min: 6 })) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.success) {
          localStorage.setItem("authToken", result.token);
          setSuccess("Login successful!");
          login(result.user, result.token);
          router.push("/");
        } else {
          setError(result.error || "Login failed");
        }
      } else {
        setError(`Error: ${response.status} - ${result.error}`);
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  return (
    <div className={styles.box}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.text}>
          <h1>Login</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className={styles.input}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.loginbutton}>
          <button
            type="submit"
            className="hover:bg-[rgba(2,0,20,1)] active:shadow-inner active:bg-[rgba(2,0,50,1)]"
          >
            Login
          </button>
        </div>
        <div className={styles.signup}>
          <a href="/signup">
            <p>don{`'`}t have an account? Sign Up</p>
          </a>
        </div>
        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

// Wrap the Login component with the withAuthRedirect HOC
export default withAuth(Login, "/");
