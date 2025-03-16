import { Router } from 'express';
import { addCounselor, getCounselors, updateCounselorAvailability, getCounselor } from '../controllers/counseling.controller';

const router = Router();

router.post('/', addCounselor); 
router.get('/', getCounselors);
router.get('/:id', getCounselor);
router.put('/availability/:id', updateCounselorAvailability);


export default router;
