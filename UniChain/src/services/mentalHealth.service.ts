import {
  PrismaClient,
  upcomingSession,
  resources,
  supportCommunity,
} from "@prisma/client";

const prisma = new PrismaClient();

class MentalHealthService {
  // Upcoming Session CRUD
  async createSession(
    data: Omit<upcomingSession, "id">
  ): Promise<upcomingSession> {
    return await prisma.upcomingSession.create({ data });
  }

  async getSession(id: number): Promise<upcomingSession | null> {
    return await prisma.upcomingSession.findUnique({ where: { id } });
  }

  async updateSession(
    id: number,
    data: Partial<upcomingSession>
  ): Promise<upcomingSession> {
    return await prisma.upcomingSession.update({ where: { id }, data });
  }

  async deleteSession(id: number): Promise<upcomingSession> {
    return await prisma.upcomingSession.delete({ where: { id } });
  }

  async getAllSessions(): Promise<upcomingSession[]> {
    return await prisma.upcomingSession.findMany();
  }

  // Resources CRUD
  async createResource(data: Omit<resources, "id">): Promise<resources> {
    return await prisma.resources.create({ data });
  }

  async getResource(id: number): Promise<resources | null> {
    return await prisma.resources.findUnique({ where: { id } });
  }

  async updateResource(
    id: number,
    data: Partial<resources>
  ): Promise<resources> {
    return await prisma.resources.update({ where: { id }, data });
  }

  async deleteResource(id: number): Promise<resources> {
    return await prisma.resources.delete({ where: { id } });
  }

  async getAllResources(): Promise<resources[]> {
    return await prisma.resources.findMany();
  }

  // Support Community CRUD
  async createCommunity(
    data: Omit<supportCommunity, "id">
  ): Promise<supportCommunity> {
    return await prisma.supportCommunity.create({ data });
  }

  async getCommunity(id: number): Promise<supportCommunity | null> {
    return await prisma.supportCommunity.findUnique({ where: { id } });
  }

  async updateCommunity(
    id: number,
    data: Partial<supportCommunity>
  ): Promise<supportCommunity> {
    return await prisma.supportCommunity.update({ where: { id }, data });
  }

  async deleteCommunity(id: number): Promise<supportCommunity> {
    return await prisma.supportCommunity.delete({ where: { id } });
  }

  async getAllCommunities(): Promise<supportCommunity[]> {
    return await prisma.supportCommunity.findMany();
  }
}

export default new MentalHealthService();
