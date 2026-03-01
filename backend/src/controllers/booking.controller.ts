import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import Property from '../models/Property';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Buyer)
export const createBooking = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { propertyId, bookingDate } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        const booking = await Booking.create({
            propertyId,
            buyerId: req.user.id,
            ownerId: property.ownerId,
            bookingDate,
            paymentStatus: 'Pending'
        });

        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Buyer)
export const getMyBookings = async (req: any, res: Response, next: NextFunction) => {
    try {
        const bookings = await Booking.find({ buyerId: req.user.id }).populate('propertyId', 'title location price');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get owner property bookings
// @route   GET /api/bookings/owner-bookings
// @access  Private (Owner)
export const getOwnerBookings = async (req: any, res: Response, next: NextFunction) => {
    try {
        const bookings = await Booking.find({ ownerId: req.user.id }).populate('propertyId', 'title').populate('buyerId', 'name email phone');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Update payment status (Structure ready)
// @route   PUT /api/bookings/:id/payment
// @access  Private (Admin/Owner)
export const updatePaymentStatus = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        booking.paymentStatus = paymentStatus;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};
