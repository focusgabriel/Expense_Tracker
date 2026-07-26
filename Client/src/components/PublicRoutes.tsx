import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div  className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}