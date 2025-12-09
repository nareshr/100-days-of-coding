import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';

export async function setRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const r = await prisma.role.findUnique({ where: { name: role }});
  if (!r) return res.status(404).json({ error: 'Role not found' });
  const u = await prisma.user.update({ where: { id }, data: { roleId: r.id }});
  res.json(u);
}

/* USERS */
export async function listUsers(req, res) {
  const users = await prisma.user.findMany({ 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: { select: { name: true } }, 
      createdAt: true 
    }
  });
  res.json(users);
}

export async function createUser(req, res) {
  const { name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find or get the role
  const roleName = role || 'user';
  let roleRecord = await prisma.role.findUnique({ where: { name: roleName } });
  if (!roleRecord) {
    return res.status(400).json({ error: `Role '${roleName}' not found` });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({ 
    data: { 
      name, 
      email, 
      passwordHash, 
      roleId: roleRecord.id 
    },
    include: { role: { select: { name: true } } }
  });
  res.json(user);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password, role, ...otherData } = req.body;
  
  const updateData = { ...otherData };
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  
  // Handle password update
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }
  
  // Handle role update
  if (role) {
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: `Role '${role}' not found` });
    }
    updateData.roleId = roleRecord.id;
  }
  
  // Remove fields that shouldn't be updated directly
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.role; // Remove role object if present
  
  const updated = await prisma.user.update({ 
    where: { id }, 
    data: updateData,
    include: { role: { select: { name: true } } }
  });
  res.json(updated);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  await prisma.user.delete({ where: { id }});
  res.json({ ok: true });
}

/* CATEGORIES */
export async function listCategories(req, res) {
  const rows = await prisma.category.findMany();
  res.json(rows);
}
export async function createCategory(req, res) {
  const { name } = req.body;
  const r = await prisma.category.create({ data: { name }});
  res.json(r);
}
export async function updateCategory(req, res) {
  const { id } = req.params;
  const r = await prisma.category.update({ where: { id }, data: req.body });
  res.json(r);
}
export async function deleteCategory(req, res) {
  const { id } = req.params;
  await prisma.category.delete({ where: { id }});
  res.json({ ok: true });
}

/* PLANS */
export async function listPlans(req, res) {
  const rows = await prisma.userPlan.findMany();
  res.json(rows);
}
export async function getPlan(req, res) {
  const { id } = req.params;
  const plan = await prisma.userPlan.findUnique({ where: { id } });
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json(plan);
}

export async function createPlan(req, res) {
  const { name, startDate, totalWeeks, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const plan = await prisma.userPlan.create({
    data: {
      name,
      totalWeeks,
      startDate: new Date(startDate),
      userId: parseInt(userId)
    }
  });

  res.json(plan);
}

export async function updatePlan(req, res) {
  const { id } = req.params;
  const r = await prisma.userPlan.update({ where: { id }, data: req.body });
  res.json(r);
}
export async function deletePlan(req, res) {
  const { id } = req.params;
  await prisma.userPlan.delete({ where: { id }});
  res.json({ ok: true });
}

// PLAN TASKS MANAGEMENT
export async function getPlanTasks(req, res) {
  const { id } = req.params;
  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id },
    include: {
      topic: {
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        }
      }
    },
    orderBy: [
      { weekNumber: 'asc' },
      { dayNumber: 'asc' }
    ]
  });
  res.json(tasks);
}

export async function createPlanTask(req, res) {
  const { id } = req.params;
  const { topicId, weekNumber, dayNumber } = req.body;
  
  if (!topicId || !weekNumber || !dayNumber) {
    return res.status(400).json({ error: 'topicId, weekNumber, and dayNumber are required' });
  }

  const task = await prisma.userPlanTask.create({
    data: {
      userPlanId: id,
      topicId,
      weekNumber: parseInt(weekNumber),
      dayNumber: parseInt(dayNumber)
    },
    include: {
      topic: {
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
  res.json(task);
}

export async function updatePlanTask(req, res) {
  const { id, taskId } = req.params;
  const { topicId, weekNumber, dayNumber } = req.body;
  
  const updateData = {};
  if (topicId) updateData.topicId = topicId;
  if (weekNumber !== undefined) updateData.weekNumber = parseInt(weekNumber);
  if (dayNumber !== undefined) updateData.dayNumber = parseInt(dayNumber);

  const task = await prisma.userPlanTask.update({
    where: { id: taskId, userPlanId: id },
    data: updateData,
    include: {
      topic: {
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
  res.json(task);
}

export async function deletePlanTask(req, res) {
  const { id, taskId } = req.params;
  await prisma.userPlanTask.delete({
    where: { id: taskId, userPlanId: id }
  });
  res.json({ ok: true });
}

export async function bulkCreatePlanTasks(req, res) {
  const { id } = req.params;
  const { tasks } = req.body; // Array of { topicId, weekNumber, dayNumber }
  
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'tasks array is required' });
  }

  const created = await prisma.userPlanTask.createMany({
    data: tasks.map(t => ({
      userPlanId: id,
      topicId: t.topicId,
      weekNumber: parseInt(t.weekNumber),
      dayNumber: parseInt(t.dayNumber)
    }))
  });
  res.json({ created: created.count });
}

// EXPORT PLAN DATA
export async function exportPlanCSV(req, res) {
  const { id } = req.params;
  const plan = await prisma.userPlan.findUnique({ where: { id } });
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id },
    include: {
      topic: {
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        }
      }
    },
    orderBy: [
      { weekNumber: 'asc' },
      { dayNumber: 'asc' }
    ]
  });

  // Generate CSV
  const headers = ['Week', 'Day', 'Topic Title', 'Category', 'Subcategory', 'Difficulty', 'Link', 'Completed'];
  const rows = tasks.map(t => [
    t.weekNumber,
    t.dayNumber,
    t.topic.title,
    t.topic.subcategory.category.name,
    t.topic.subcategory.name,
    t.topic.difficulty || '',
    t.topic.link || '',
    t.completed ? 'Yes' : 'No'
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="plan-${plan.name}-${Date.now()}.csv"`);
  res.send(csv);
}

export async function exportPlanJSON(req, res) {
  const { id } = req.params;
  const plan = await prisma.userPlan.findUnique({ 
    where: { id },
    include: {
      tasks: {
        include: {
          topic: {
            include: {
              subcategory: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy: [
          { weekNumber: 'asc' },
          { dayNumber: 'asc' }
        ]
      }
    }
  });
  
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="plan-${plan.name}-${Date.now()}.json"`);
  res.json(plan);
}

// -------- ADMIN REPORTS (user-wise) --------
function getUserId(req) {
  return req.query.userId || req.user.id;
}

export async function adminReportSummary(req, res) {
  const uid = getUserId(req);
  const totalCompleted = await prisma.userTopicProgress.count({ where: { userId: uid, completed: true }});
  const totalTasks = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid } }});
  res.json({ userId: uid, totalCompleted, totalTasks });
}

export async function adminReportWeek(req, res) {
  const uid = getUserId(req);
  const week = parseInt(req.params.weekNumber, 10);
  const total = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid }, weekNumber: week }});
  const done = await prisma.userTopicProgress.count({ where: { userId: uid, weekNumber: week, completed: true }});
  res.json({ userId: uid, week, total, done, completionRate: total ? done / total : 0 });
}

export async function adminReportCategory(req, res) {
  const uid = getUserId(req);
  const name = req.params.categoryName;
  const cat = await prisma.category.findFirst({ where: { name }});
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const subs = await prisma.subcategory.findMany({ where: { categoryId: cat.id }});
  const subIds = subs.map(s => s.id);
  const topics = await prisma.topic.findMany({ where: { subcategoryId: { in: subIds } }, select: { id: true }});
  const topicIds = topics.map(t => t.id);
  const total = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid }, topicId: { in: topicIds } }});
  const done = await prisma.userTopicProgress.count({ where: { userId: uid, topicId: { in: topicIds }, completed: true }});
  res.json({ userId: uid, category: name, total, done, completionRate: total ? done / total : 0 });
}

export async function adminReportTopics(req, res) {
  const uid = getUserId(req);
  const items = await prisma.userTopicProgress.groupBy({
    by: ['topicId'],
    where: { userId: uid, completed: true },
    _count: { completed: true }
  });
  const topicIds = items.map(i => i.topicId);
  const topics = await prisma.topic.findMany({
    where: { id: { in: topicIds } },
    include: { subcategory: { include: { category: true } } }
  });
  const map = new Map(topics.map(t => [t.id, t]));
  const results = items.map(i => ({
    topicId: i.topicId,
    title: map.get(i.topicId)?.title || '',
    category: map.get(i.topicId)?.subcategory?.category?.name || '',
    subcategory: map.get(i.topicId)?.subcategory?.name || '',
    completedCount: i._count.completed || 0
  }));
  res.json(results);
}

export async function adminReportDaily(req, res) {
  const uid = getUserId(req);
  const rows = await prisma.userTopicProgress.findMany({
    where: { userId: uid, completed: true },
    select: { completedAt: true }
  });
  const map = new Map();
  for (const r of rows) {
    if (!r.completedAt) continue;
    const d = r.completedAt.toISOString().slice(0,10);
    map.set(d, (map.get(d) || 0) + 1);
  }
  const out = Array.from(map.entries()).map(([date, completed]) => ({ date, completed })).sort((a,b)=> a.date.localeCompare(b.date));
  res.json(out);
}
