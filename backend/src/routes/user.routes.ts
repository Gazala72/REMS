import express from 'express';
import { getAdminAnalytics, getUsers, deleteUser } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

router.use(protect as any);
router.use(authorize('admin') as any);

router.get('/', getUsers);
router.get('/admin/analytics', getAdminAnalytics);
router.delete('/:id', deleteUser);

export default router;
