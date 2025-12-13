import prisma from '../prismaClient.js';
import { getPagination } from "../utils/pagination.js";

export async function list(req, res) {
  const { category, subcategory, difficulty, type, q } = req.query;

  const where = {};

  if (q) where.title = { contains: q, mode: 'insensitive' };
  if (difficulty) where.difficulty = difficulty;
  if (type) where.type = type;

  if (subcategory) {
    const sub = await prisma.subcategory.findFirst({ where: { name: subcategory }});
    if (sub) where.subcategoryId = sub.id;
  } 
  else if (category) {
    const cat = await prisma.category.findFirst({ where: { name: category }});
    if (cat) {
      const subs = await prisma.subcategory.findMany({ where: { categoryId: cat.id }});
      where.subcategoryId = { in: subs.map(s => s.id) };
    }
  }

  const list = await prisma.topic.findMany({
    where,
    include: { 
      subcategory: {
        include: {
          category: true
        }
      }
    },
    take: 200
  });

  res.json(list);
};

// CREATE topic
export async function create(req, res) {
  try {
    const { title, difficulty, type, estimatedTime, link, numericGoal, subcategoryId } = req.body;

    const t = await prisma.topic.create({
      data: {
        title,
        difficulty,
        type,
        estimatedTime,
        link,
        numericGoal,
        subcategoryId
      }
    });

    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE topic  <-- **THIS MUST EXIST**
export async function update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const t = await prisma.topic.update({
      where: { id },
      data
    });

    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE topic
export async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.topic.delete({ where: { id }});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BULK IMPORT topics (expects JSON body { topics: [...] })
export async function importTopics(req, res) {
  try {
    const { topics } = req.body;
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: "topics array is required" });
    }

    const data = topics.map(t => ({
      title: t.title,
      difficulty: t.difficulty || null,
      type: t.type || null,
      estimatedTime: t.estimatedTime || null,
      link: t.link || null,
      numericGoal: t.numericGoal || null,
      subcategoryId: t.subcategoryId,
    })).filter(t => t.title && t.subcategoryId);

    if (data.length === 0) {
      return res.status(400).json({ error: "No valid topics found (need title and subcategoryId)" });
    }

    const created = await prisma.topic.createMany({ data });
    res.json({ created: created.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// EXPORT topics as CSV
export async function exportTopicsCSV(req, res) {
  try {
    const list = await prisma.topic.findMany({
      include: {
        subcategory: {
          include: { category: true }
        }
      },
      orderBy: [{ title: 'asc' }]
    });

    const headers = ['Title','Category','Subcategory','Difficulty','Type','EstimatedTime','Link'];
    const rows = list.map(t => [
      t.title,
      t.subcategory?.category?.name || '',
      t.subcategory?.name || '',
      t.difficulty || '',
      t.type || '',
      t.estimatedTime ?? '',
      t.link || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="topics-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// EXPORT topics as JSON
export async function exportTopicsJSON(req, res) {
  try {
    const list = await prisma.topic.findMany({
      include: {
        subcategory: {
          include: { category: true }
        }
      },
      orderBy: [{ title: 'asc' }]
    });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="topics-${Date.now()}.json"`);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// WEEKLY PLAN (canonical)
export async function weeklyPlan(req, res) {
  const items = await prisma.weeklyPlanTopic.findMany({
    include: { topic: { include: { subcategory: true } } },
    orderBy: [{ weekNumber: 'asc' }, { dayNumber: 'asc' }]
  });
  res.json(items);
};

export async function weeklyPlanWeek(req, res) {
  const w = parseInt(req.params.weekNumber, 10);

  const items = await prisma.weeklyPlanTopic.findMany({
    where: { weekNumber: w },
    include: { topic: { include: { subcategory: true } } },
    orderBy: [{ dayNumber: 'asc' }]
  });

  res.json(items);
};

export const getTopics = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const { q, categoryId, subcategoryId } = req.query;

    const where = {};

    if (q) {
      where.title = { contains: q, mode: "insensitive" };
    }

    if (subcategoryId) {
      where.subcategoryId = String(subcategoryId);
    }

    if (categoryId) {
      where.subcategory = {
        categoryId: String(categoryId),
      };
    }

    const [items, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        skip,
        take: limit,
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { id: "asc" },
      }),
      prisma.topic.count({ where }),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    console.error("getTopics error:", err);
    return res.status(500).json({ error: "Failed to fetch topics" });
  }
};
