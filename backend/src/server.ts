import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import messageRoutes from './routes/message.routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import fs from 'fs';

// Set uploads folder as static
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('REMS API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rems';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(`MongoDB Connected: ${MONGO_URI}`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    });
