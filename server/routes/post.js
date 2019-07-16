const express = require('express');
const router = express.Router();

const likesController = require('../controllers/post/likes');
const likeController = require('../controllers/post/like');
const unlikeController = require('../controllers/post/unlike');
const reportController = require('../controllers/post/report');

const isLoggedIn = require('../middleware/isLoggedIn');
const log = require('../middleware/log');
router.use(isLoggedIn);
router.use(log);

router.get('/likes/:post', likesController);
router.post('/like/:post', likeController);
router.post('/unlike/:post', unlikeController);
router.post('/report/:post', reportController);

module.exports = router;
