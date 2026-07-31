import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import refreshClient from "../api/fetch";
import { AuthContext, type User } from "../lib/AuthContext";
import { saveAuthLocally, getStoredAuth, clearAuthLocally, isBrowserOnline } from "../lib/offlineTransactions";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    // Initialize from local storage for instant offline access
    return getStoredAuth();
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await refreshClient.get("/auth/me");
      setUser(data.user);
      saveAuthLocally(data.user);
    } catch {
      // If offline, try to use cached auth
      if (!isBrowserOnline()) {
        const cached = getStoredAuth();
        if (cached) {
          setUser(cached);
        } else {
          setUser(null);
        }
      } else {
        // Online but request failed - clear auth
        setUser(null);
        clearAuthLocally();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthLocally();
  };

  // Check auth when app loads
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for automatic logout events from the interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      clearAuthLocally();
      navigate("/", { replace: true });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
