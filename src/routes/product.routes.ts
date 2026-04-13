import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), productController.create);
router.put('/:id', authenticate, authorize('ADMIN'), productController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), productController.delete);

export default router;
