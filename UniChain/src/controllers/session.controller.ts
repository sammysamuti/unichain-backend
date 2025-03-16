import { Request, Response } from 'express';
import * as sessionService from '../services/session.service';
import { SessionStatus } from '@prisma/client';


// Create a new session (book a session)
export const bookSession = async (req: Request, res: Response) => {
    
    try {
      const { studentId, counselorId, dateTime, paymentTx } = req.body;
  
      console.log('Student ID:', studentId);
        console.log('Counselor ID:', counselorId);

      // Ensure valid dateTime format
      const sessionDateTime = new Date(dateTime);
  
      if (isNaN(sessionDateTime.getTime())) {
        return res.status(400).json({ message: 'Invalid dateTime format.' });
      }

  
      // Create the session if the student exists
      const session = await sessionService.createSession(studentId, counselorId, sessionDateTime, paymentTx);
      res.status(201).json(session);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating session.' });
    }
  };
// Get counselor availability (time slots)
export const getCounselorAvailability = async (req: Request, res: Response) => {
  try {
    const { counselorId } = req.params;
    const availability = await sessionService.getCounselorAvailability(counselorId);

    if (!availability) {
      return res.status(404).json({ message: 'Counselor availability not found.' });
    }

    res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving counselor availability.' });
  }
};

// Update session status (e.g., after payment or after session)
export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId, status } = req.body;

    if (!Object.values(SessionStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid session status.' });
    }

    const updatedSession = await sessionService.updateSessionStatus(sessionId, status);
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating session status.' });
  }
};
