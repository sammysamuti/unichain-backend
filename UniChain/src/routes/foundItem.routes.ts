import { Router } from 'express';
import { FoundItemController } from '../controllers/foundItem.controller';

const router = Router();
const foundItemController = new FoundItemController();

// Create a new found item
router.post('/', foundItemController.createFoundItem);

// Get all found items
router.get('/', foundItemController.getFoundItems);

// Get found item by ID
router.get('/:id', foundItemController.getFoundItemById);

// Get my found items
router.get('/my-items', foundItemController.getMyFoundItems);

// Update found item
router.put('/:id', foundItemController.updateFoundItem);

// Delete found item
router.delete('/:id', foundItemController.deleteFoundItem);

export default router; 