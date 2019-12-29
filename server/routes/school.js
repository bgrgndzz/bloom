const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const log = require('../middleware/log');
router.use(isLoggedIn);
router.use(log);

const schoolController = require('../controllers/school/school');

router.get('/:school/:page', schoolController);

module.exports = router;
