import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createStudentDegree = async (data: any) => {
  return prisma.studentDegree.create({ data });
};

export const getStudentDegreeById = async (id: string) => {
  return prisma.studentDegree.findUnique({ where: { id } });
};

export const updateStudentDegree = async (id: string, data: any) => {
  return prisma.studentDegree.update({ where: { id }, data });
};

export const deleteStudentDegree = async (id: string) => {
  return prisma.studentDegree.delete({ where: { id } });
};
