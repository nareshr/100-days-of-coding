import prisma from '../prismaClient.js';
import { getPagination } from "../utils/pagination.js";

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

export const getCategories = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        include: { subcategories: true },
        orderBy: { id: "asc" },
      }),
      prisma.category.count(),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
