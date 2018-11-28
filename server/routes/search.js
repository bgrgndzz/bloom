const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

const usersController = require('../controllers/search/users');
const topicsController = require('../controllers/search/topics');

router.get('/users/:search', usersController);
router.get('/topics/:search', topicsController);

module.exports = router;