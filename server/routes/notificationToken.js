const express = require('express');
const router = express.Router();

const registerController = require('../controllers/notificationToken/register');
const unregisterController = require('../controllers/notificationToken/unregister');

const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/register', isLoggedIn, registerController);
router.post('/unregister', unregisterController);

module.exports = router;
