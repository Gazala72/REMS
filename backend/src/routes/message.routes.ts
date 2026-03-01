import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect as any);

router.post('/', sendMessage);
router.get('/', getMessages);

export default router;
