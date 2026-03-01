import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    ownerId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    location: string;
    type: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    status: 'Available' | 'Sold' | 'Rented';
    approved: boolean;
    createdAt: Date;
}

const PropertySchema: Schema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        location: { type: String, required: true },
        type: { type: String, required: true },
        area: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        amenities: { type: [String], default: [] },
        images: { type: [String], default: [] },
        status: { type: String, enum: ['Available', 'Sold', 'Rented'], default: 'Available' },
        approved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IProperty>('Property', PropertySchema);
