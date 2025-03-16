import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { sentAt: 'desc' },
        });
        return res.json(notifications);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching notifications: ${(error as Error).message}` });
    }
};
