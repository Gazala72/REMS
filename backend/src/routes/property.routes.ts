import express from 'express';
import {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    getAllPropertiesAdmin,
    approveProperty,
} from '../controllers/property.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

// Specific routes first
router.get('/admin/all', protect as any, authorize('admin') as any, getAllPropertiesAdmin);
router.get('/owner/me', protect as any, authorize('owner') as any, getMyProperties);
router.put('/:id/approve', protect as any, authorize('admin') as any, approveProperty);

// Generic routes
router.get('/', getProperties);
router.post('/', protect as any, authorize('owner', 'admin') as any, createProperty);
router.get('/:id', getProperty);
router.put('/:id', protect as any, authorize('owner', 'admin') as any, updateProperty);
router.delete('/:id', protect as any, authorize('owner', 'admin') as any, deleteProperty);

export default router;
