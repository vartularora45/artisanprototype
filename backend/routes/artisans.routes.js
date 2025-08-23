import express from 'express';
const router = express.Router();
const artisanController = require('../controllers/artisanController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', artisanController.register);
router.get('/:id/profile', authenticateToken, artisanController.getProfile);
router.put('/:id/profile', authenticateToken, artisanController.updateProfile);
router.post('/:id/story', authenticateToken, artisanController.uploadStory);
router.get('/:id/dashboard', authenticateToken, artisanController.getDashboard);
export default router;