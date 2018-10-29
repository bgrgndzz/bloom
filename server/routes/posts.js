const express = require('express');
const router = express.Router();

const listController = require('../controllers/posts/list');
const createController = require('../controllers/posts/create');

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

router.get('/list/:topic', listController);
router.post('/create/:topic', createController);

module.exports = router;