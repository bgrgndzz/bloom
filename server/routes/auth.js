const express = require('express');
const router = express.Router();

const loginController = require('../controllers/auth/login');
const registerController = require('../controllers/auth/register');

router.post('/login', loginController);
router.post('/register', registerController);

module.exports = router;