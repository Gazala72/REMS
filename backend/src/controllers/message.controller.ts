import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { receiverId, propertyId, text } = req.body;

        // basic validation
        if (!receiverId || !propertyId || !text) {
            return res.status(400).json({ success: false, message: 'Please provide receiver, property, and text' });
        }

        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            propertyId,
            text,
        });

        res.status(201).json({ success: true, data: message });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user messages
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req: any, res: Response, next: NextFunction) => {
    try {
        const messages = await Message.find({
            $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        })
            .populate('senderId', 'name email')
            .populate('receiverId', 'name email')
            .populate('propertyId', 'title')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        next(err);
    }
};
