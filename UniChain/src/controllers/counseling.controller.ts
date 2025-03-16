import { Request, Response } from "express";
import * as counselorService from "../services/counseling.service";

// Add a new counselor
export const addCounselor = async (req: Request, res: Response) => {
  try {
    const counselor = await counselorService.createCounselor(req.body);
    res.status(201).json(counselor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get a list of counselors (with optional filters)
export const getCounselors = async (req: Request, res: Response) => {
  try {
    const counselors = await counselorService.fetchCounselors(req.query);
    res.status(200).json(counselors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCounselor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const counselor = await counselorService.getCounselor(id);
    res.status(200).json(counselor);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// Update counselor availability
export const updateCounselorAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCounselor = await counselorService.updateAvailability(id, req.body.availability);
    res.status(200).json(updatedCounselor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

