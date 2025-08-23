import express from 'express';
const orderRouter = express.Router();

orderRouter.post('/', orderController.create);
orderRouter.get('/artisan/:artisanId', authenticateToken, orderController.getByArtisan);
orderRouter.put('/:id/status', authenticateToken, orderController.updateStatus);
orderRouter.put('/:id/tracking', authenticateToken, orderController.addTracking);

export default orderRouter;