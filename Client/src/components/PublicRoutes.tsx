import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

export default function PublicRoutes({ children }: Props) {
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();

  if (accessToken) {
    // Redirect back to where they came from, or default to /overview
    const from = location.state?.from?.pathname || "/overview";
    return <Navigate to={from} replace />;
  }

  return children
}