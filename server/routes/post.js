const express = require('express');
const router = express.Router();

const likeController = require('../controllers/post/like');
const unlikeController = require('../controllers/post/unlike');

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

router.post('/like/:post', likeController);
router.post('/unlike/:post', unlikeController);

module.exports = router;