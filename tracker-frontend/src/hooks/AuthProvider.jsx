import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const r = await api.get("/auth/me");
      setUser(r.data.user || null);
    } catch (e) {
      console.error("Failed to fetch /auth/me", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // auto-login from cookie / token
    fetchMe();
  }, [fetchMe]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      refresh: fetchMe,
      setUser,
    }),
    [user, loading, fetchMe]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
