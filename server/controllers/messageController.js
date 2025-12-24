const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, appointmentId } = req.body;

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
            appointment: appointmentId
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message' });
    }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const userIdObj = new mongoose.Types.ObjectId(currentUserId);

        const pipeline = [
            {
                $match: {
                    $or: [
                        { sender: userIdObj },
                        { receiver: userIdObj }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", userIdObj] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$content" },
                    lastMessageTime: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver", userIdObj] },
                                        { $eq: ["$read", false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    lastMessageTime: 1,
                    unreadCount: 1,
                    name: "$userDetails.name",
                    avatar: "$userDetails.avatar"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ];

        const conversations = await Message.aggregate(pipeline);

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des conversations' });
    }
};

// @desc    Get conversation between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        // Mark as read
        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, read: false },
            { read: true }
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages' });
    }
};

// @desc    Get unread count
// @route   GET /api/messages/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user.id,
            read: false
        });

        res.json({
            success: true,
            data: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
