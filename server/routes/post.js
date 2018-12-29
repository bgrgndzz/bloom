const express = require('express');
const router = express.Router();

const likeController = require('../controllers/post/like');
const unlikeController = require('../controllers/post/unlike');
const reportController = require('../controllers/post/report');

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

router.post('/like/:post', likeController);
router.post('/unlike/:post', unlikeController);
router.post('/report/:post', reportController);

module.exports = router;