// controllers/planController.js
import prisma from "../prismaClient.js";

// GET summary for a plan
export async function planSummary(req, res) {
  const { id } = req.params;
  // total tasks and completed for the plan and user (if multi-user)
  const total = await prisma.userPlanTask.count({ where: { userPlanId: id }});
  const completed = await prisma.userPlanTask.count({ where: { userPlanId: id, completed: true }});
  res.json({ totalTasks: total, completedTasks: completed, percent: total ? Math.round((completed/total)*100) : 0 });
}

// dayBuckets for last 90 days
export async function dayBuckets(req, res) {
  const { id } = req.params;
  // Get all tasks with weekNumber and dayNumber and map to dates using plan.startDate
  const plan = await prisma.userPlan.findUnique({ where: { id }});
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  const tasks = await prisma.userPlanTask.findMany({ where: { userPlanId: id }, select: { weekNumber: true, dayNumber: true, completed: true } });

  const start = new Date(plan.startDate);
  const map = new Map();
  for (const t of tasks) {
    const offsetDays = (t.weekNumber - 1) * 7 + (t.dayNumber - 1);
    const dt = new Date(start);
    dt.setDate(start.getDate() + offsetDays);
    const dateStr = dt.toISOString().slice(0,10);
    const prev = map.get(dateStr) || { total: 0, completed: 0 };
    prev.total += 1;
    if (t.completed) prev.completed += 1;
    map.set(dateStr, prev);
  }

  // ensure last 90 days keys included (with zeros)
  const today = new Date();
  const out = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const val = map.get(ds) || { total: 0, completed: 0 };
    out.push({ date: ds, total: val.total, completed: val.completed });
  }
  res.json(out);
}

// weeklyBuckets
export async function weeklyBuckets(req, res) {
  const { id } = req.params;
  const tasks = await prisma.userPlanTask.findMany({ where: { userPlanId: id }, select: { weekNumber: true, completed: true }});
  const m = new Map();
  for (const t of tasks) {
    const w = t.weekNumber;
    const pv = m.get(w) || { total: 0, completed: 0 };
    pv.total += 1;
    if (t.completed) pv.completed += 1;
    m.set(w, pv);
  }
  const out = Array.from(m.entries()).map(([week, v]) => ({ week, total: v.total, completed: v.completed })).sort((a,b) => a.week - b.week);
  res.json(out);
}

// tasksByDate?date=YYYY-MM-DD
export async function tasksByDate(req, res) {
  const { id } = req.params;
  const dateStr = req.query.date;
  const plan = await prisma.userPlan.findUnique({ where: { id }});
  if (!plan) return res.json([]);
  const start = new Date(plan.startDate);
  const target = new Date(dateStr);
  const diff = Math.floor((target - start) / (24*3600*1000));
  if (diff < 0) return res.json([]);
  const weekNumber = Math.floor(diff / 7) + 1;
  const dayNumber = (diff % 7) + 1;
  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id, weekNumber, dayNumber },
    include: { topic: true }
  });
  res.json(tasks);
}

export async function completeTask(req, res) {
  const { id, taskId } = req.params;
  await prisma.userPlanTask.update({ where: { id: taskId }, data: { completed: true, completedAt: new Date() }});
  res.json({ ok: true });
}
export async function uncompleteTask(req, res) {
  const { id, taskId } = req.params;
  await prisma.userPlanTask.update({ where: { id: taskId }, data: { completed: false, completedAt: null }});
  res.json({ ok: true });
}

// Weekly tasks for a plan: GET /userplans/:id/tasks?week=1
export async function tasksForWeek(req, res) {
  const { id } = req.params;
  const week = Number(req.query.week) || 1;

  try {
    const tasks = await prisma.userPlanTask.findMany({
      where: { userPlanId: id, weekNumber: week },
      include: { 
        topic: { 
          include: { 
            subcategory: true 
          } 
        } 
      },
      orderBy: [
        { dayNumber: "asc" },
        { id: "asc" },
      ],
    });
    res.json(tasks);
  } catch (err) {
    console.error("tasksForWeek error", err);
    res.status(500).json({ error: "Failed to load tasks" });
  }
}
