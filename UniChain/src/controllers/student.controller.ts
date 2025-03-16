import { Request, Response } from "express";
import studentService from "../services/student.service";

class StudentController {
  async registerStudent(req: Request, res: Response) {
    try {
      const { name, email, telegramId, universityId, department, Batch, university, password } = req.body;

      // Validate required fields
      if (!name || !email || !universityId || !department || !Batch || !university || !password) {
        return res.status(400).json({
          error: "Name, email, universityId, department, batch, university, and password are required",
        });
      }

      // Register the student
      const student = await studentService.registerStudent({
        name,
        email,
        telegramId,
        universityId,
        department,
        Batch,
        university,
        password,
      });

      // Return the created student (excluding sensitive data like password and seedPhrase)
      const { password: _, seedPhrase: __, ...safeStudent } = student;
      res.status(201).json(safeStudent);
    } catch (error) {
      console.error("Error in registerStudent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Fetch the student
      const student = await studentService.getStudent(Number(id));

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Return the student (excluding sensitive data like password and seedPhrase)
      const { password: _, seedPhrase: __, ...safeStudent } = student;
      res.status(200).json(safeStudent);
    } catch (error) {
      console.error("Error in getStudent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Delete the student
      const student = await studentService.deleteStudent(Number(id));

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error in deleteStudent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, telegramId, universityId, department, Batch, university, password } = req.body;

      const updatedStudent = await studentService.updateStudent(Number(id), {
        name,
        email,
        telegramId,
        universityId,
        department,
        Batch,
        university,
        password
      });

      const { password: _, seedPhrase: __, ...safeStudent } = updatedStudent;
      res.status(200).json(safeStudent);
    } catch (error) {
      console.error("Error in updateStudent:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllStudents(req: Request, res: Response) {
    try {
      const students = await studentService.getAllStudents();
      const safeStudents = students.map(student => {
        const { password, seedPhrase, ...rest } = student;
        return rest;
      });
      res.status(200).json(safeStudents);
    } catch (error) {
      console.error("Error in getAllStudents:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}



export default new StudentController();
