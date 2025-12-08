// src/services/auth.js
import api from "./api";

export async function login(email, password) {
  const r = await api.post("/auth/login", { email, password });
  if (r.data.token) {
    localStorage.setItem('token', r.data.token);
  }
  return r.data;
}

export async function register(data) {
  const r = await api.post("/auth/register", data);
  return r.data;
}

export async function logout() {
  localStorage.removeItem('token');
  const r = await api.post("/auth/logout");
  return r.data;
}

export async function forgotPassword(email) {
  const r = await api.post("/auth/forgot", { email });
  return r.data;
}

export async function me() {
  const r = await api.get("/auth/me");
  return r.data;
}



// import { auth } from "./firebase";

// // SIGN IN WITH EMAIL
// export async function signInEmail(email, password) {
//   return auth.signInWithEmailAndPassword(email, password);
// }

// // REGISTER NEW ACCOUNT
// export async function registerEmail(email, password) {
//   return auth.createUserWithEmailAndPassword(email, password);
// }

// // OPTIONAL: SIGN OUT
// export function logout() {
//   return auth.signOut();
// }

// // LISTEN FOR AUTH CHANGES
// export function onAuthChange(callback) {
//   return auth.onAuthStateChanged(callback);
// }

