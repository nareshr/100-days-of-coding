import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth";

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto card">
        <h2 className="text-2xl font-semibold mb-3">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded-lg border" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-lg border" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 rounded-lg border" />
          {err && <div className="text-red-500">{err}</div>}
          <div className="flex items-center justify-between">
            <button className="btn btn-primary">Register</button>
            <a href="/login" className="subtext">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
