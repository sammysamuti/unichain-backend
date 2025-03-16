import express from 'express';
import { mintDegreeController } from '../controllers/mint.controller';

const router = express.Router();

router.post('/mint/:universityId', mintDegreeController);

export default router;
