"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Make sure AuthContext is set up correctly
import { useEffect } from "react";

const withAuthAdmin = (WrappedComponent, redirectTo) => {
  const Wrapper = (props) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated || !user?.isAdmin) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user?.isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuthAdmin;
