import { Router } from 'express';
import { createClaim, getReceivedClaims, getSentClaims, reviewClaim, markReturned } from '../controllers/lostClaim.controller';

const router = Router();

// Create a new claim
router.post('/', createClaim);

// Get claims received on finder's items
router.get('/received/:finderId', getReceivedClaims);

// Get claims sent by user
router.get('/sent/:userId', getSentClaims);

// Review a claim (accept/reject)
router.put('/:id/review', reviewClaim);

// Mark item as physically returned
router.put('/:id/return', markReturned);

export default router;
