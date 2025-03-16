import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';

const router = Router();

// Route to book a session (create a session)
router.post('/', sessionController.bookSession);

// Route to get a counselor's availability (time slots)
router.get('/counselors/:counselorId/availability', sessionController.getCounselorAvailability);

// Route to update the session status (after payment or after completion)
router.put('/status', sessionController.updateSessionStatus);

router.get("/student/:studentId", sessionController.getSessionsByStudent);
router.get("/counselor/:counselorId", sessionController.getSessionsByCounselor);

export default router;
