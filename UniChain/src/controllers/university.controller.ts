import { Request, Response } from 'express';
import {
  createUniversity,
  getUniversityById,
  updateUniversity,
  deleteUniversity
} from '../services/university.service';

export const createUniversityController = async (req: Request, res: Response) => {
  try {
    const university = await createUniversity(req.body);
    res.status(201).json(university);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversityController = async (req: Request, res: Response) => {
  try {
    const university = await getUniversityById(Number(req.params.id));
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateUniversityController = async (req: Request, res: Response) => {
  try {
    const university = await updateUniversity(Number(req.params.id), req.body);
    res.json(university);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUniversityController = async (req: Request, res: Response) => {
  try {
    await deleteUniversity(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};