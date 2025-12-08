const express = require('express');
const router = express.Router();

// controllers
const auth = require('../controllers/authController');
const topics = require('../controllers/topicController');
const categories = require('../controllers/categoryController');
const userplans = require('../controllers/userplanController');
const progress = require('../controllers/progressController');
const admin = require('../controllers/adminController');

const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/rbac');

// auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', requireAuth, auth.me);
router.post('/auth/logout', auth.logout);
router.post('/auth/forgot', auth.forgot);

// categories & topics
router.get('/categories', categories.list);
router.post('/categories', requireAuth, permit('manager','admin'), categories.create);
router.post('/categories/:id/subcategories', requireAuth, permit('manager','admin'), categories.createSub);

router.get('/topics', topics.list);
router.post('/topics', requireAuth, permit('manager','admin'), topics.create);
router.patch('/topics/:id', requireAuth, permit('manager','admin'), topics.update);
router.delete('/topics/:id', requireAuth, permit('admin'), topics.remove);

// weekly plan (global)
router.get('/weeklyplan', topics.weeklyPlan);
router.get('/weeklyplan/:weekNumber', topics.weeklyPlanWeek);

// user plans
router.get('/userplans', requireAuth, userplans.listForUser);
router.post('/userplans', requireAuth, userplans.create);
router.get('/userplans/:id/tasks', requireAuth, userplans.tasksForPlan);
router.post('/userplans/:id/tasks/:taskId/complete', requireAuth, userplans.completeTask);
router.post('/userplans/:id/tasks/:taskId/uncomplete', requireAuth, userplans.uncompleteTask);
router.get('/userplans/:id/summary', requireAuth, userplans.summary);
router.get('/userplans/:id/tasksByDate', requireAuth, userplans.tasksByDate);
router.get('/userplans/:id/dayBuckets', requireAuth, userplans.dayBuckets);
router.get('/userplans/:id/weeklyBuckets', requireAuth, userplans.weeklyBuckets);
// progress / reports
router.get('/progress/summary', requireAuth, progress.summary);
router.get('/progress/week/:weekNumber', requireAuth, progress.weekReport);
router.get('/progress/category/:categoryName', requireAuth, progress.categoryReport);

// admin
router.get('/users', requireAuth, permit('admin'), admin.listUsers);
router.patch('/users/:id/role', requireAuth, permit('admin'), admin.setRole);

module.exports = router;
