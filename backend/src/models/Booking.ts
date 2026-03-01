import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    propertyId: mongoose.Types.ObjectId;
    buyerId: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    bookingDate: Date;
    createdAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
        buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
        bookingDate: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
