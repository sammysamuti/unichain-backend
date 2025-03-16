import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AuthService {
  async login(email: string, password: string) {
    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student || student.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, seedPhrase: __, ...safeStudent } = student;
    return safeStudent;
  }

  async UvLogin(email: string, password: string) {
    const university = await prisma.university.findUnique({
      where: { email }
    });

    if (!university || university.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, seedPhrase: __, ...safeUniversity } = university;
    return safeUniversity;
  }
}

export default new AuthService();
