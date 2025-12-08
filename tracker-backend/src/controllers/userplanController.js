import prisma from '../prismaClient.js';

// list plans for user
export async function listForUser(req, res) {
  const plans = await prisma.userPlan.findMany({ where: { userId: req.user.id }});
  res.json(plans);
};

export async function create(req, res) {
  const { name, totalWeeks, startDate } = req.body;
  const plan = await prisma.userPlan.create({ data: { userId: req.user.id, name, totalWeeks, startDate: new Date(startDate) }});
  res.json(plan);
};

export async function tasksForPlan(req, res) {
  const { id } = req.params;
  const week = parseInt(req.query.week || '1', 10);
  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id, weekNumber: week },
    include: { topic: { include: { subcategory: true } } },
    orderBy: [{ dayNumber: 'asc' }]
  });
  res.json(tasks);
};

export async function completeTask(req, res) {
  const { id, taskId } = req.params;
  // mark task complete
  await prisma.userPlanTask.updateMany({
    where: { userPlanId: id, id: taskId },
    data: { completed: true, completedAt: new Date() }
  });
  // also write to UserTopicProgress (upsert)
  const task = await prisma.userPlanTask.findUnique({ where: { id: taskId }});
  if (task) {
    const existing = await prisma.userTopicProgress.findFirst({
      where: { userId: req.user.id, topicId: task.topicId, weekNumber: task.weekNumber, dayNumber: task.dayNumber }
    });
    if (existing) {
      await prisma.userTopicProgress.update({ where: { id: existing.id }, data: { completed: true, completedAt: new Date() }});
    } else {
      await prisma.userTopicProgress.create({
        data: { userId: req.user.id, topicId: task.topicId, weekNumber: task.weekNumber, dayNumber: task.dayNumber, completed: true, completedAt: new Date() }
      });
    }
  }
  res.json({ ok: true });
};

export async function uncompleteTask(req, res) {
  const { id, taskId } = req.params;
  await prisma.userPlanTask.updateMany({ where: { userPlanId: id, id: taskId }, data: { completed: false, completedAt: null }});
  // note: you may want to remove UserTopicProgress entry or mark incomplete
  res.json({ ok: true });
};

export async function summary(req, res) {
  try {
    const { id } = req.params;

    const tasks = await prisma.userPlanTask.findMany({
      where: { userPlanId: id },
      select: { id: true, completed: true }
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    const percent = total ? Math.round((completed / total) * 100) : 0;

    res.json({
      totalTasks: total,
      completedTasks: completed,
      percent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /userplans/:id/tasksByDate?date=YYYY-MM-DD
export async function tasksByDate(req, res) {
  const { id } = req.params;
  const dateStr = req.query.date;
  const plan = await prisma.userPlan.findUnique({ where: { id }});
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const start = new Date(plan.startDate);
  const target = new Date(dateStr);
  const diffDays = Math.floor((target - start) / (24*3600*1000));
  if (diffDays < 0) return res.json([]);

  const weekNumber = Math.floor(diffDays / 7) + 1;
  const dayNumber = (diffDays % 7) + 1;

  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id, weekNumber, dayNumber },
    include: { topic: { include: { subcategory: true } } }
  });

  res.json(tasks);
};

// GET /userplans/:id/dayBuckets
export async function dayBuckets(req, res) {
  const { id } = req.params;
  // Get last 90 days:
  const plan = await prisma.userPlan.findUnique({ where: { id } });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id },
    select: { completed: true, completedAt: true, weekNumber: true, dayNumber: true }
  });

  const dayBuckets = [];
  const start = new Date(plan.startDate);
  for (let i=0; i<90; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const str = date.toISOString().slice(0,10);
    const filtered = tasks.filter(t => {
      const d = new Date(start);
      d.setDate(d.getDate() + (t.weekNumber-1)*7 + (t.dayNumber-1));
      return d.toISOString().slice(0,10) === str;
    });
    if (filtered.length === 0) continue;
    const total = filtered.length;
    const completed = filtered.filter(t => t.completed).length;
    dayBuckets.push({ date: str, total, completed });
  }

  res.json(dayBuckets);
};

// GET /userplans/:id/weeklyBuckets
export async function weeklyBuckets(req, res) {
  const { id } = req.params;
  const tasks = await prisma.userPlanTask.findMany({
    where: { userPlanId: id },
    select: { completed: true, weekNumber: true }
  });
  if (!tasks.length) return res.json([]);

  const maxWeek = tasks.reduce((max, t) => Math.max(max, t.weekNumber), 0);
  const weeks = [];
  for (let w=1; w<=maxWeek; w++) {
    const filtered = tasks.filter(t => t.weekNumber === w);
    if (filtered.length === 0) continue;
    const total = filtered.length;
    const completed = filtered.filter(t => t.completed).length;
    weeks.push({ week: w, total, completed });
  }
  res.json(weeks);
};
