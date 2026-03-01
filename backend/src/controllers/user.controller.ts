import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Property from '../models/Property';
import Booking from '../models/Booking';

// @desc    Get dashboard analytics
// @route   GET /api/users/admin/analytics
// @access  Private (Admin)
export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const pendingProperties = await Property.countDocuments({ approved: false });
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProperties,
                pendingProperties,
                totalBookings,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
