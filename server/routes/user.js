const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

const selfController = require('../controllers/user/self');
const userController = require('../controllers/user/user');

router.get('/', selfController);
router.get('/:user', userController);

module.exports = router;