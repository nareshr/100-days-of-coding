import React, { useState } from "react";
import { forgotPassword } from "../../services/auth";

export default function ForgotPassword(){
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMsg("Check your email for reset instructions.");
    } catch (error) {
      setErr("Failed to request reset.");
    }
  };

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto card">
        <h2 className="text-2xl font-semibold mb-3">Reset password</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-lg border" />
          {msg && <div className="text-green-600">{msg}</div>}
          {err && <div className="text-red-500">{err}</div>}
          <button className="btn btn-primary">Send reset email</button>
        </form>
      </div>
    </div>
  );
}
