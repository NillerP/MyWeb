// hoc/withAuth.js
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const withAuth = (WrappedComponent, redirectTo) => {
  const Wrapper = (props) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, router]);

    // Show a loading spinner or nothing while redirecting
    if (isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
