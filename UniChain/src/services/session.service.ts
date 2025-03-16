import { PrismaClient, SessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new session (book a session)
export const createSession = async (studentId: number, counselorId: string, dateTime: Date, paymentTx?: string) => {
  const session = await prisma.session.create({
    data: {
      studentId,
      counselorId,
      dateTime,
      paymentTx, // Optional field
      status: SessionStatus.PENDING, // Default status is PENDING
    },
  });

  return session;
};


// Get the available times for a specific counselor
export const getCounselorAvailability = async (counselorId: string) => {
  // Assuming availability is stored as JSON in the `availability` field of the Counselor model
  const counselor = await prisma.counselor.findUnique({
    where: { id: counselorId },
    select: { availability: true },
  });

  return counselor?.availability;
};

// Update session status (e.g., after payment or after the session is completed)
export const updateSessionStatus = async (sessionId: string, status: SessionStatus) => {
  const session = await prisma.session.update({
    where: { id: sessionId },
    data: { status },
  });

  return session;
};

export const getSessionsByStudentId = async (studentId: number) => {
  return await prisma.session.findMany({
    where: { studentId },
    include: {
      counselor: { select: { id: true, name: true, expertise: true } },
    },
  });
};

export const getSessionsByCounselorId = async (counselorId: string) => {
  return await prisma.session.findMany({
    where: { counselorId },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
  });
};
