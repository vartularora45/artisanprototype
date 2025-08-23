import express from 'express';

const productRouter = express.Router();

productRouter.post('/create-from-voice', authenticateToken, productController.createFromVoice);
productRouter.get('/artisan/:artisanId', productController.getByArtisan);
productRouter.put('/:id', authenticateToken, productController.update);
productRouter.post('/:id/publish', authenticateToken, productController.publishToChannels);
productRouter.get('/pricing-suggestions', productController.getPricingSuggestions);

export default productRouter;