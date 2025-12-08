import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import useAuth from "../../hooks/useAuth";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refresh, setUser } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const response = await login(email, password);
      // Update user state directly from login response to avoid timing issues
      if (response.user) {
        setUser(response.user);
      } else {
        // Fallback to refresh if user data not in response
        await refresh();
      }
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto card">
        <h2 className="text-2xl font-semibold mb-3">Sign in</h2>
        <form onSubmit={submit} className="space-y-3">
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="Email" 
            className="w-full p-3 rounded-lg border" 
            disabled={loading}
          />
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full p-3 rounded-lg border" 
            disabled={loading}
          />
          {err && <div className="text-red-500">{err}</div>}
          <div className="flex items-center justify-between">
            <button 
              type="submit"
              className="btn btn-primary flex items-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
            <a href="/forgot" className="subtext">Forgot?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
