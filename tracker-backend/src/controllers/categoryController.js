import prisma from '../prismaClient.js';

export async function list(req, res) {
  const cats = await prisma.category.findMany({ include: { subcategories: true }});
  res.json(cats);
};

export async function create(req, res) {
  const { name, description, type } = req.body;
  const c = await prisma.category.create({ data: { name, description, type }});
  res.json(c);
};

export async function createSub(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const sub = await prisma.subcategory.create({ data: { name, categoryId: id }});
  res.json(sub);
};
