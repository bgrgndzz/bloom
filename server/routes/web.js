const express = require('express');
const router = express.Router();

const privacyPolicyController = require('../controllers/web/privacy-policy');

router.get('/privacy-policy', privacyPolicyController);

module.exports = router;