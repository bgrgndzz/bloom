const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const log = require('../middleware/log');
router.use(isLoggedIn);
router.use(log);

const listController = require('../controllers/topics/list');

router.get('/list/:sort/:page', listController);

module.exports = router;