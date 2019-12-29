const express = require('express');
const router = express.Router();

const listController = require('../controllers/notifications/list');
const countController = require('../controllers/notifications/count');

const isLoggedIn = require('../middleware/isLoggedIn');

router.use(isLoggedIn);

router.get('/list/:page', listController);
router.get('/count', countController);

module.exports = router;
