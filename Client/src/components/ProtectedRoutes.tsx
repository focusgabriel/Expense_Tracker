// import React, { useEffect, useState } from 'react'
// import { Navigate } from 'react-router-dom'
// import refreshClient from '../api/fetch'

// import { SplinePointer } from "lucide-react";
// import { Navigate } from "react-router-dom";

// type Props = {
//   children: React.ReactNode
// }

// export default function ProtectedRoutes({ children }: Props) {
//   const [authChecked, setAuthChecked] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     const checkAuth = async () => {
//       try {
//         await refreshClient.post("/auth/me", {}, { withCredentials: true });
//         if (!cancelled) setIsAuthenticated(true);
//       } catch {
//         // Not authenticated
//         if (!cancelled) setIsAuthenticated(false);
//       } finally {
//         if (!cancelled) setAuthChecked(true);
//       }
//     };

//     checkAuth();

//     return () => { cancelled = true; };
//   }, []);

//   if (!authChecked) {
//     // Show nothing while checking auth (loading state)
//     <div className="flex h-screen items-center justify-center">
//       Loading...
//     </div>  }

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return children
// }

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div  className="flex h-screen items-center justify-center">Loading...</div>;
    // or your spinner component

    
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}