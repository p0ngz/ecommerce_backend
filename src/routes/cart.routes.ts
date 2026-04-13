import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.post('/remove', cartController.removeItem);
router.put('/update', cartController.updateItem);
router.delete('/clear', cartController.clearCart);

export default router;
