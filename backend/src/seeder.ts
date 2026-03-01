import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Property from './models/Property';
import Booking from './models/Booking';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rems';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data for a clean slate, except admin if you want. Let's just create the required ones.
        // Or just create them without clearing.

        // Create Owner Account
        const salt = await bcrypt.genSalt(10);
        const ownerPassword = await bcrypt.hash('password123', salt);

        let owner = await User.findOne({ email: 'owner@rems.com' });
        if (!owner) {
            owner = await User.create({
                name: 'John Owner',
                email: 'owner@rems.com',
                password: ownerPassword,
                role: 'owner',
                phone: '+1234567890'
            });
            console.log('Owner account created.');
        } else {
            console.log('Owner account already exists.');
        }

        // Create Buyer Account
        const buyerPassword = await bcrypt.hash('password123', salt);
        let buyer = await User.findOne({ email: 'buyer@rems.com' });
        if (!buyer) {
            buyer = await User.create({
                name: 'Jane Buyer',
                email: 'buyer@rems.com',
                password: buyerPassword,
                role: 'buyer',
                phone: '+0987654321'
            });
            console.log('Buyer account created.');
        } else {
            console.log('Buyer account already exists.');
        }

        // Add 8 Properties
        const propertiesData = [
            {
                ownerId: owner._id,
                title: 'Modern Luxury Villa',
                description: 'A beautiful luxury villa with a private pool and stunning ocean views.',
                price: 1500000,
                location: 'Beverly Hills, CA',
                type: 'Residential',
                area: 4500,
                bedrooms: 5,
                bathrooms: 4,
                amenities: ['Pool', 'Ocean View', 'Garage', 'Garden'],
                images: ['https://images.unsplash.com/photo-1613490900233-08a7dc6c9b73?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Downtown Skyscraper Office',
                description: 'Premium commercial office space in the heart of the city.',
                price: 850000,
                location: 'New York, NY',
                type: 'Commercial',
                area: 2500,
                bedrooms: 0,
                bathrooms: 2,
                amenities: ['Elevator', 'Security', 'Wi-Fi', 'Conference Room'],
                images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Cozy Suburban House',
                description: 'Perfect family home in a quiet suburban neighborhood with great schools nearby.',
                price: 450000,
                location: 'Austin, TX',
                type: 'Residential',
                area: 2100,
                bedrooms: 3,
                bathrooms: 2,
                amenities: ['Backyard', 'Garage', 'Fireplace'],
                images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Beachfront Condo',
                description: 'Wake up to the sound of waves in this beautiful beachfront condominium.',
                price: 650000,
                location: 'Miami, FL',
                type: 'Residential',
                area: 1200,
                bedrooms: 2,
                bathrooms: 2,
                amenities: ['Beach Access', 'Gym', 'Pool', 'Balcony'],
                images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Spacious Commercial Warehouse',
                description: 'Large warehouse space suitable for logistics and storage.',
                price: 1200000,
                location: 'Chicago, IL',
                type: 'Commercial',
                area: 10000,
                bedrooms: 0,
                bathrooms: 4,
                amenities: ['Loading Dock', 'High Ceilings', 'Parking'],
                images: ['https://images.unsplash.com/photo-1586528116311-ad8ed7c159ae?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Mountain View Cabin',
                description: 'A serene cabin retreat surrounded by nature and breathtaking mountain views.',
                price: 320000,
                location: 'Denver, CO',
                type: 'Residential',
                area: 1500,
                bedrooms: 3,
                bathrooms: 1,
                amenities: ['Fireplace', 'Deck', 'Hiking Trails'],
                images: ['https://images.unsplash.com/photo-1542315104-1b489aabcddc?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Modern Loft Apartment',
                description: 'Stylish loft with exposed brick walls and high ceilings in a trendy neighborhood.',
                price: 550000,
                location: 'Seattle, WA',
                type: 'Residential',
                area: 1100,
                bedrooms: 1,
                bathrooms: 1,
                amenities: ['Gym', 'Rooftop Lounge', 'Smart Home Tech'],
                images: ['https://images.unsplash.com/photo-1502672260266-1c1e54116499?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            },
            {
                ownerId: owner._id,
                title: 'Prime Agricultural Land',
                description: 'Fertile land ready for farming or development.',
                price: 250000,
                location: 'Fresno, CA',
                type: 'Land',
                area: 50000,
                bedrooms: 0,
                bathrooms: 0,
                amenities: ['Water Access', 'Fenced'],
                images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80'],
                status: 'Available',
                approved: true
            }
        ];

        const insertedProperties = await Property.insertMany(propertiesData);
        console.log(`Added ${insertedProperties.length} properties.`);

        // Buyer books one property
        const propertyToBook = insertedProperties[0];
        const booking = await Booking.create({
            propertyId: propertyToBook._id,
            buyerId: buyer._id,
            ownerId: owner._id,
            bookingDate: new Date('2026-03-15'),
            paymentStatus: 'Pending'
        });
        console.log('Buyer booked standard property:', propertyToBook.title);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
