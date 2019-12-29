const express = require('express');
const router = express.Router();

const privacyPolicyController = require('../controllers/web/privacy-policy');
const termsController = require('../controllers/web/terms');
const contactController = require('../controllers/web/contact');

router.get('/privacy-policy', privacyPolicyController);
router.get('/terms', termsController);
router.get('/contact', contactController);

module.exports = router;