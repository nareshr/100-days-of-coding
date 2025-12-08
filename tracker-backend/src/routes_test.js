// src/routes.js
const express = require('express');
const router = express.Router();
const auth = require('./controllers/authController');
const users = require('./controllers/userController');
const categories = require('./controllers/categoryController');
const dayplans = require('./controllers/dayplanController');
const { requireAuth } = require('./middlewares/authMiddleware');
const { permit } = require('./middlewares/rbac');

// auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// user (admin)
router.get('/users', requireAuth, permit('admin'), users.list);
router.get('/users/me', requireAuth, users.me);
router.get('/users/:id', requireAuth, permit('admin'), users.getById);
router.patch('/users/:id', requireAuth, permit('admin'), users.update);
router.delete('/users/:id', requireAuth, permit('admin'), users.remove);

// categories
router.get('/categories', requireAuth, categories.list);
router.post('/categories', requireAuth, permit('manager','admin'), categories.create);
router.patch('/categories/:id', requireAuth, permit('manager','admin'), categories.update);
router.delete('/categories/:id', requireAuth, permit('admin'), categories.remove);

// dayplans
router.get('/dayplans', requireAuth, dayplans.listForUser);
router.get('/dayplans/:id', requireAuth, dayplans.getById);
router.post('/dayplans', requireAuth, dayplans.createOrUpdate); // create or update
router.patch('/dayplans/:id', requireAuth, dayplans.update);
router.delete('/dayplans/:id', requireAuth, dayplans.remove);

module.exports = router;
