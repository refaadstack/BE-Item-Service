import express from 'express';
import * as itemController from '../controllers/itemController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

// Get all items with pagination, search, and sorting
router.get('/', itemController.getAllItems);

router.get('/bulk', itemController.getItemsByIds);     // GET /api/items/bulk?ids=1,2,3 - HARUS SEBELUM /:id

// Get items statistics
router.get('/stats/summary', itemController.getItemsStats);

// Get item by ID
router.get('/:id', itemController.getItemById);

// Create new item
router.post('/', itemController.createItem);

// Update item
router.put('/:id', itemController.updateItem);

// Delete item
router.delete('/:id', itemController.deleteItem);

// Bulk delete items
router.delete('/', itemController.bulkDeleteItems);

export default router;
