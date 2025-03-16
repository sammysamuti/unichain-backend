import express from 'express';
import {
  createUniversityController,
  getUniversityController,
  updateUniversityController,
  deleteUniversityController
} from '../controllers/university.controller';

const router = express.Router();

router.post('/register', createUniversityController);
router.get('/:id', getUniversityController);
router.put('/:id', updateUniversityController);
router.delete('/:id', deleteUniversityController);

export default router;