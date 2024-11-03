"use client"; // Ensure this file is a Client Component

import Link from "next/link";
import React, { useEffect } from "react";
import styles from "@/app/styles/Nav.module.css";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";

const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken"); // Ensure auth token is removed
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/">HOME</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about">ABOUT</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/test">TEST</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/clients">
              CLIENTS <span className="text-red-500 text-auto">+</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/services">
              SERVICES <span className="text-red-500 text-auto">+</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/blackjack">
              BLACKJACK <span className="text-red-500 text-auto">+</span>
            </Link>
          </li>

          {}
          {isAuthenticated ? (
            <>
              {user.isAdmin && (
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
              )}
              <li className="ml-auto">
                <span className="text-white border-2 rounded-md p-2">
                  {user?.username}{" "}
                </span>
              </li>
              <li className="text-white pl-10">
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className={styles.navItemRight}>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
