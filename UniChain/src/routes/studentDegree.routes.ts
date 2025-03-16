import express from 'express';
import {
  createStudentDegreeController,
  getStudentDegreeController,
  updateStudentDegreeController,
  deleteStudentDegreeController
} from '../controllers/studentDegree.controller';

const router = express.Router();

router.post('/', createStudentDegreeController);
router.get('/:id', getStudentDegreeController);
router.put('/:id', updateStudentDegreeController);
router.delete('/:id', deleteStudentDegreeController);

export default router;
