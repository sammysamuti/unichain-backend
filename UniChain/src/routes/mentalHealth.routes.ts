import { Router } from "express";
import MentalHealthController from "../controllers/mentalHealth.controller";

const router = Router();

// Upcoming Session Routes
router.post("/sessions", MentalHealthController.createSession);
router.get("/sessions/:id", MentalHealthController.getSession);
router.put("/sessions/:id", MentalHealthController.updateSession);
router.delete("/sessions/:id", MentalHealthController.deleteSession);
router.get("/sessions", MentalHealthController.getAllSessions);

// Resources Routes
router.post("/resources", MentalHealthController.createResource);
router.get("/resources/:id", MentalHealthController.getResource);
router.put("/resources/:id", MentalHealthController.updateResource);
router.delete("/resources/:id", MentalHealthController.deleteResource);
router.get("/resources", MentalHealthController.getAllResources);

// Support Community Routes
router.post("/communities", MentalHealthController.createCommunity);
router.get("/communities/:id", MentalHealthController.getCommunity);
router.put("/communities/:id", MentalHealthController.updateCommunity);
router.delete("/communities/:id", MentalHealthController.deleteCommunity);
router.get("/communities", MentalHealthController.getAllCommunities);

export default router;
