const express = require('express');
const router = express.Router();

const redirectController = require('../controllers/ad/redirect');

const log = require('../middleware/log');
router.use(log);

router.get('/:ad/:user', redirectController);
router.get('/redirect/:ad/:user', redirectController);

module.exports = router;
