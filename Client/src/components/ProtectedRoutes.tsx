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
import { Loader2 } from "lucide-react";
import { isBrowserOnline } from "../lib/offlineTransactions";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div  className="flex h-screen items-center justify-center"><Loader2 size={18} className="animate-spin" />&nbsp; Loading...</div>;
  }

  // If offline and not authenticated, allow access if there's cached data
  if (!isAuthenticated) {
    // Only redirect to login if online (so user can login)
    if (isBrowserOnline()) {
      return <Navigate to="/" replace />;
    }
    // If offline, show a message instead of redirecting
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-700 shadow-sm max-w-md">
          <p className="font-semibold">You're offline</p>
          <p className="mt-1 text-amber-600">
            Please log in while online to access the app offline. 
            Once authenticated, your session will be cached for offline use.
          </p>
        </div>
      </div>
    );
  }

  return <div className="md:px-3"> {children}</div>
}
