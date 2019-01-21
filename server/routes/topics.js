const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
router.use(isLoggedIn);

const listController = require('../controllers/topics/list');

router.get('/list/:sort/:page', listController);

module.exports = router;