import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
