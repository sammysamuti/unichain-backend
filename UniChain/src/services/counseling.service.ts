import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new counselor
export const createCounselor = async (data: any) => {
    const counselor = await prisma.counselor.create({
      data,
    });
    return counselor;  // Return the newly created counselor
  };
  
// Fetch counselors with optional filters
export const fetchCounselors = async (filters: any) => {
  return await prisma.counselor.findMany({
    where: filters,
  });
};

export const getCounselor = async (id: string) => {
  return await prisma.counselor.findUnique({
    where: { id },
  });
};

// Update counselor availability
export const updateAvailability = async (id: string, availability: boolean) => {
  return await prisma.counselor.update({
    where: { id },
    data: { availability },
  });
};
