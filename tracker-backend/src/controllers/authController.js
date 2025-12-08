import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { signToken, verifyToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email & password required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "User exists" });
  }

  let role = await prisma.role.findUnique({ where: { name: "user" } });
  if (!role) {
    role = await prisma.role.create({ data: { name: "user", permissions: {} } });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash: hash, roleId: role.id },
    include: { role: true },
  });

  const token = signToken({ userId: user.id, role: user.role.name });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email & password required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id, role: user.role.name });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ ok: true });
}

export async function me(req, res) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(200).json({ user: null });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(200).json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { role: true },
  });

  if (!user) {
    return res.status(200).json({ user: null });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  });
}
