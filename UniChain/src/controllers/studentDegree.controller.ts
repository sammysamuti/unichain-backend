import { Request, Response } from 'express';
import {
  createStudentDegree,
  getStudentDegreeById,
  updateStudentDegree,
  deleteStudentDegree
} from '../services/studentDegree.service';

export const createStudentDegreeController = async (req: Request, res: Response) => {
  try {
    const studentDegree = await createStudentDegree(req.body);
    res.status(201).json(studentDegree);
  } catch (error) {
        res.status(400).json({ error: (error as Error).message });
  }
};

export const getStudentDegreeController = async (req: Request, res: Response) => {
  try {
    const studentDegree = await getStudentDegreeById(req.params.id);
    if (!studentDegree) {
      return res.status(404).json({ error: 'Student degree not found' });
    }
    res.json(studentDegree);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateStudentDegreeController = async (req: Request, res: Response) => {
  try {
    const studentDegree = await updateStudentDegree(req.params.id, req.body);
    res.json(studentDegree);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteStudentDegreeController = async (req: Request, res: Response) => {
  try {
    await deleteStudentDegree(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
