import { PrismaClient } from '@prisma/client';
import { mintOnSolana } from '../utils/minter';

const prisma = new PrismaClient();

export async function mintDegreeNFT(universityId: number) {
  const degree = await prisma.studentDegree.findFirst({
    where: { universityId },
  });

  if (!degree) {
    throw new Error('Degree not found');
  }

  return await mintOnSolana(degree);
}