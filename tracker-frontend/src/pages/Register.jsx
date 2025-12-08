import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await API.post('/auth/register', { email, password });
      localStorage.setItem('token', r.data.token); // unified key
      nav('/');
      // if refresh() passed via props, call refresh here
    } catch (err) {
      alert(err?.response?.data?.error || 'Register failed');
    }
  };
  return (
    <form onSubmit={submit} className="max-w-md bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Register</h3>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-2" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded mb-2" />
      <button className="px-3 py-2 bg-blue-600 text-white rounded">Register</button>
    </form>
  );
}
