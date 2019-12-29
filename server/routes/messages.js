const express = require('express');
const router = express.Router();

const countController = require('../controllers/messages/count');
const conversationsController = require('../controllers/messages/conversations');
const conversationController = require('../controllers/messages/conversation');
const sendController = require('../controllers/messages/send');

const isLoggedIn = require('../middleware/isLoggedIn');

router.use(isLoggedIn);

router.get('/count', countController);
router.get('/conversations/:page', conversationsController);
router.get('/conversation/:user/:page', conversationController);
router.post('/send/:user', sendController);

module.exports = router;
