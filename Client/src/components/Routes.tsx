import React from 'react'
import { Navigate } from 'react-router-dom'

  type Props = {
    children: React.ReactNode
  }

  export default function ProtectedRoutes({children}: Props){
    const token = localStorage.getItem("token");

    if(!token) {
      return <Navigate to="/" replace />
    }

    return children
  }
