const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getUnreadCount, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/unread', getUnreadCount);
router.get('/:userId', getConversation);

module.exports = router;
