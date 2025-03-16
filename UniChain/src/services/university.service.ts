import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createUniversity = async (data: {
  name: string;
  email: string;
  walletAddress: string;
  seedPhrase: string;
  location: string;
  password: string;
}) => {
  return prisma.university.create({ data });
};

export const getUniversityById = async (id: number) => {
  return prisma.university.findUnique({ where: { id } });
};

export const updateUniversity = async (id: number, data: {
  name?: string;
  email?: string;
  walletAddress?: string;
  seedPhrase?: string;
  location?: string;
  password?: string;
}) => {
  return prisma.university.update({ where: { id }, data });
};

export const deleteUniversity = async (id: number) => {
  return prisma.university.delete({ where: { id } });
};