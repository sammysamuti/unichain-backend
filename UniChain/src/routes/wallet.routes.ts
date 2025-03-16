import { Router } from 'express';
import { getWalletDetails } from '../controllers/walletController';
import { sendSol } from '../controllers/walletController';

const router = Router();

router.get('/:id', getWalletDetails);
router.post('/send', sendSol);

export default router;
