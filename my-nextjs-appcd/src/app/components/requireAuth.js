"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const requireAuth = (WrappedComponent, redirectTo = "/login") => {
  const Wrapper = (props) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(redirectTo); // Redirect to login page if not authenticated
      }
    }, [isAuthenticated, router]);

    // While checking auth status, you could return a loading indicator or nothing.
    if (!isAuthenticated) {
      return null; // Optionally, display a loading spinner or placeholder here
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default requireAuth;
