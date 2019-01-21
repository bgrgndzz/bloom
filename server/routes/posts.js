const express = require('express');
const router = express.Router();

const listController = require('../controllers/posts/list');
const feedController = require('../controllers/posts/feed');
const createController = require('../controllers/posts/create');

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

router.get('/list/feed/:page', feedController);
router.get('/list/:topic/:sort/:page', listController);
router.post('/create/:topic', createController);

module.exports = router;