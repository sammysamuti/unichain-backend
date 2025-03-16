import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const student = await authService.login(email, password);
      res.json(student);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async uvLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const university = await authService.UvLogin(email, password);
      res.json(university);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}

export default new AuthController();
