import express from 'express';
import { createBooking, getMyBookings, getOwnerBookings, updatePaymentStatus } from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

router.post('/', protect as any, authorize('buyer') as any, createBooking);
router.get('/my-bookings', protect as any, authorize('buyer') as any, getMyBookings);
router.get('/owner-bookings', protect as any, authorize('owner') as any, getOwnerBookings);
router.put('/:id/payment', protect as any, authorize('admin', 'owner') as any, updatePaymentStatus);

export default router;
