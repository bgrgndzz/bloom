const express = require('express');
const router = express.Router();

const indexController = require('../controllers/admin/index');
const loginGetController = require('../controllers/admin/loginGet');
const loginPostController = require('../controllers/admin/loginPost');
const panelController = require('../controllers/admin/panel');

router.get('/', indexController);
router.get('/login', loginGetController);
router.get('/panel', panelController);

router.post('/login', loginPostController);

module.exports = router;