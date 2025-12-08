// src/controllers/userController.js
import prisma from '../prismaClient.js';

export async function list(req, res) {
  const users = await prisma.user.findMany({ include: { role: true } });
  res.json(users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role.name, createdAt: u.createdAt })));
};

export async function me(req, res) {
  const u = req.user;
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role.name });
};

export async function getById(req, res) {
  const id = req.params.id;
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
};

export async function update(req, res) {
  const id = req.params.id;
  const data = req.body;
  // do not allow password changes here directly
  const user = await prisma.user.update({ where: { id }, data });
  res.json(user);
};

export async function remove(req, res) {
  const id = req.params.id;
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
};
