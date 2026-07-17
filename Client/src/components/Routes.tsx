import React from 'react'
import { Navigate } from 'react-router-dom'

  type Props = {
    children: React.ReactNode
  }

  export default function ProtectedRoutes({children}: Props){
    const accessToken = localStorage.getItem("accessToken");

    if(!accessToken) {
      return <Navigate to="/" replace />
    }

    return children
  }
