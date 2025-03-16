import { PrismaClient, Student } from "@prisma/client";
import { generateWallet } from "../utils/solana";

const prisma = new PrismaClient();

class StudentService {
  async registerStudent(data: {
    name: string;
    email: string;
    telegramId?: string;
    universityId: string;
    department: string;
    Batch: string;
    university: string;
    password: string;
  }): Promise<Student> {
    try {
      // Generate wallet address and seed phrase
      const { publicKey: walletAddress, seedPhrase } = generateWallet();

      // Create the student in the database
      const student = await prisma.student.create({
        data: {
          name: data.name,
          email: data.email,
          telegramId: data.telegramId,
          universityId: data.universityId,
          department: data.department,
          batch: data.Batch,
          university: data.university,
          walletAddress,
          seedPhrase, // Ensure this is encrypted before saving in a real-world scenario
          password: data.password, // Ensure this is hashed before saving
        },
      });

      return student;
    } catch (error) {
      console.error("Error in registerStudent:", error);
      throw new Error("Failed to register student");
    }
  }

  async getStudent(id: number): Promise<Student | null> {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
      });

      return student;
    } catch (error) {
      console.error("Error in getStudent:", error);
      throw new Error("Failed to fetch student");
    }
  }

 //add delete by id
 async deleteStudent(id: number): Promise<Student> {
    try {
      const student = await prisma.student.delete({
        where: { id },
      });
      return student;
    } catch (error) {
      console.error("Error in deleteStudent:", error);
      throw new Error("Failed to delete student");
    }
  }

  async updateStudent(id: number, data: {
    name?: string;
    email?: string;
    telegramId?: string;
    universityId?: string;
    department?: string;
    Batch?: string;
    university?: string;
    password?: string;
  }): Promise<Student> {
    try {
      const student = await prisma.student.update({
        where: { id },
        data,
      });
      return student;
    } catch (error) {
      console.error("Error in updateStudent:", error);
      throw new Error("Failed to update student");
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const students = await prisma.student.findMany();
      return students;
    } catch (error) {
      console.error("Error in getAllStudents:", error);
      throw new Error("Failed to fetch students");
    }
  }


          
}

export default new StudentService();