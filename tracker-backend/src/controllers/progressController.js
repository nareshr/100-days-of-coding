import prisma from '../prismaClient.js';

// summary for user
export async function summary(req, res) {
  const uid = req.user.id;
  const totalCompleted = await prisma.userTopicProgress.count({ where: { userId: uid, completed: true }});
  const totalTasks = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid } }});
  res.json({ totalCompleted, totalTasks });
};

export async function weekReport(req, res) {
  const uid = req.user.id;
  const week = parseInt(req.params.weekNumber, 10);
  const total = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid }, weekNumber: week }});
  const done = await prisma.userTopicProgress.count({ where: { userId: uid, weekNumber: week, completed: true }});
  res.json({ week, total, done, completionRate: total ? (done/total) : 0 });
};

export async function categoryReport(req, res) {
  const uid = req.user.id;
  const name = req.params.categoryName;
  const cat = await prisma.category.findFirst({ where: { name }});
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const subs = await prisma.subcategory.findMany({ where: { categoryId: cat.id }});
  const subIds = subs.map(s => s.id);
  const topics = await prisma.topic.findMany({ where: { subcategoryId: { in: subIds } }, select: { id: true }});
  const topicIds = topics.map(t => t.id);
  const total = await prisma.userPlanTask.count({ where: { userPlan: { userId: uid }, topicId: { in: topicIds } }});
  const done = await prisma.userTopicProgress.count({ where: { userId: uid, topicId: { in: topicIds }, completed: true }});
  res.json({ category: name, total, done, completionRate: total ? (done/total) : 0 });
};
