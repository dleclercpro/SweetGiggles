import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import NotifyController from '../controllers/NotifyController';
import CreateOrderController from '../controllers/CreateOrderController';
import DeleteOrderController from '../controllers/DeleteOrderController';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.post(`/notify`, NotifyController);
router.post(`/order`, CreateOrderController);
router.delete(`/order`, DeleteOrderController);



export default router;