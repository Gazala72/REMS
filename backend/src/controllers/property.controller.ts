import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property';

// @desc    Get all properties (with filtering, sorting, pagination)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { keyword, location, type, minPrice, maxPrice, bedrooms, bathrooms, sort } = req.query;

        let query: any = { approved: true }; // Only show approved properties to public

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
        if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

        let sortObj: any = { createdAt: -1 };
        if (sort === 'price_asc') sortObj = { price: 1 };
        else if (sort === 'price_desc') sortObj = { price: -1 };

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Property.countDocuments(query);
        const properties = await Property.find(query).sort(sortObj).skip(startIndex).limit(limit).populate('ownerId', 'name email phone');

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            data: properties,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const property = await Property.findById(req.params.id).populate('ownerId', 'name email phone');
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Owner/Admin)
export const createProperty = async (req: any, res: Response, next: NextFunction) => {
    try {
        req.body.ownerId = req.user.id;

        // For testing/smooth flow, we are making all newly created properties
        // approved by default so the Buyer can see them immediately on the platform.
        req.body.approved = true;

        const property = await Property.create(req.body);
        res.status(201).json({ success: true, data: property });
    } catch (err) {
        next(err);
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = async (req: any, res: Response, next: NextFunction) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        // Make sure user is property owner or admin
        if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req: any, res: Response, next: NextFunction) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get owner properties
// @route   GET /api/properties/owner/my-properties
// @access  Private (Owner)
export const getMyProperties = async (req: any, res: Response, next: NextFunction) => {
    try {
        const properties = await Property.find({ ownerId: req.user.id });
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all properties (Admin)
// @route   GET /api/properties/admin/all
// @access  Private (Admin)
export const getAllPropertiesAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const properties = await Property.find().populate('ownerId', 'name email');
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        next(err);
    }
};
// @desc    Approve/Reject property (Admin)
// @route   PUT /api/properties/:id/approve
// @access  Private (Admin)
export const approveProperty = async (req: any, res: Response, next: NextFunction) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        next(err);
    }
};
