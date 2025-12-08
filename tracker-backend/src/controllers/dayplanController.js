// src/controllers/dayplanController.js
import prisma from '../prismaClient.js';

export async function listForUser(req, res) {
  const userId = req.user.id;
  const plans = await prisma.dayPlan.findMany({ where: { userId }, orderBy: { dayNumber: 'asc' } });
  res.json(plans);
};

export async function getById(req, res) {
  const { id } = req.params;
  const plan = await prisma.dayPlan.findUnique({ where: { id } });
  if (!plan) return res.status(404).json({ error: 'Not found' });
  res.json(plan);
};

export async function createOrUpdate(req, res) {
  const userId = req.user.id;
  const payload = req.body;
  // payload must include dayNumber and date
  if (!payload.dayNumber) return res.status(400).json({ error: 'dayNumber required' });
  // upsert by userId + dayNumber
  const existing = await prisma.dayPlan.findFirst({ where: { userId, dayNumber: payload.dayNumber } });
  if (existing) {
    const updated = await prisma.dayPlan.update({ where: { id: existing.id }, data: payload });
    return res.json(updated);
  } else {
    const created = await prisma.dayPlan.create({ data: { ...payload, userId } });
    return res.json(created);
  }
};

export async function update(req, res) {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.dayPlan.update({ where: { id }, data });
  res.json(updated);
};

export async function remove(req, res) {
  const { id } = req.params;
  await prisma.dayPlan.delete({ where: { id } });
  res.json({ ok: true });
};
