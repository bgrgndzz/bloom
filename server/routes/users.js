const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const log = require('../middleware/log');
router.use(isLoggedIn);
router.use(log);

const listController = require('../controllers/users/list');

router.get('/list', listController);

module.exports = router;
