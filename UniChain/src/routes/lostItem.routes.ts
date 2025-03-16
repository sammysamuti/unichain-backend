import { Router } from 'express';
import {
  createLostItem,
  getLostItems,
  getLostItemById,
  getLostItemsByUserId,
  updateLostItem,
  deleteLostItem
} from '../controllers/lostItem.controller';

const router = Router();

// Create a new lost item
router.post('/', createLostItem);

// Get all lost items
router.get('/', getLostItems);

// Get lost item by ID
router.get('/:id', getLostItemById);

// Get my lost items
router.get('/user/:userId', getLostItemsByUserId);

// Update lost item
router.put('/:id', updateLostItem);

// Delete lost item
router.delete('/:id', deleteLostItem);

export default router;
