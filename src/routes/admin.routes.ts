import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { productController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);

// Product management (admin view - includes inactive products)
router.get('/products', productController.getAllAdmin);

export default router;
