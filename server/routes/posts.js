const express = require('express');
const router = express.Router();

const listController = require('../controllers/posts/list');
const feedController = require('../controllers/posts/feed');
const createController = require('../controllers/posts/create');

const isLoggedIn = require('../middleware/isLoggedIn');
const log = require('../middleware/log');
router.use(isLoggedIn);
router.use(log);

router.get('/list/feed/:page', feedController);
router.get('/list/:topic/:sort/:page', listController);
router.post('/create/:topic', createController);

module.exports = router;