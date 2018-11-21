const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

const selfController = require('../controllers/user/self');
const userController = require('../controllers/user/user');
const editController = require('../controllers/user/edit');
const followController = require('../controllers/user/follow');
const unfollowController = require('../controllers/user/unfollow');

router.get('/', selfController);
router.get('/:user', userController);
router.post('/edit', editController);
router.post('/follow/:user', followController);
router.post('/unfollow/:user', unfollowController);

module.exports = router;