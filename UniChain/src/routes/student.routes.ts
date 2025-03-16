import { Router } from "express";
import studentController from "../controllers/student.controller";

const router = Router();
router.post("/register", studentController.registerStudent);
router.get("/:id", studentController.getStudent);
router.get("/", studentController.getAllStudents);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
export default router;
