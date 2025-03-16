import { Request, Response } from "express";
import MentalHealthService from "../services/mentalHealth.service";

class MentalHealthController {
  // Upcoming Session Handlers
  async createSession(req: Request, res: Response) {
    try {
      const session = await MentalHealthService.createSession(req.body);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getSession(req: Request, res: Response) {
    try {
      const session = await MentalHealthService.getSession(
        Number(req.params.id)
      );
      if (session) {
        res.status(200).json(session);
      } else {
        res.status(404).json({ error: "Session not found" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateSession(req: Request, res: Response) {
    try {
      const session = await MentalHealthService.updateSession(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const session = await MentalHealthService.deleteSession(
        Number(req.params.id)
      );
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllSessions(req: Request, res: Response) {
    try {
      const sessions = await MentalHealthService.getAllSessions();
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Resources Handlers
  async createResource(req: Request, res: Response) {
    try {
      const resource = await MentalHealthService.createResource(req.body);
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getResource(req: Request, res: Response) {
    try {
      const resource = await MentalHealthService.getResource(
        Number(req.params.id)
      );
      if (resource) {
        res.status(200).json(resource);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateResource(req: Request, res: Response) {
    try {
      const resource = await MentalHealthService.updateResource(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteResource(req: Request, res: Response) {
    try {
      const resource = await MentalHealthService.deleteResource(
        Number(req.params.id)
      );
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllResources(req: Request, res: Response) {
    try {
      const resources = await MentalHealthService.getAllResources();
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Support Community Handlers
  async createCommunity(req: Request, res: Response) {
    try {
      const community = await MentalHealthService.createCommunity(req.body);
      res.status(201).json(community);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCommunity(req: Request, res: Response) {
    try {
      const community = await MentalHealthService.getCommunity(
        Number(req.params.id)
      );
      if (community) {
        res.status(200).json(community);
      } else {
        res.status(404).json({ error: "Community not found" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateCommunity(req: Request, res: Response) {
    try {
      const community = await MentalHealthService.updateCommunity(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(community);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteCommunity(req: Request, res: Response) {
    try {
      const community = await MentalHealthService.deleteCommunity(
        Number(req.params.id)
      );
      res.status(200).json(community);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllCommunities(req: Request, res: Response) {
    try {
      const communities = await MentalHealthService.getAllCommunities();
      res.status(200).json(communities);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new MentalHealthController();
