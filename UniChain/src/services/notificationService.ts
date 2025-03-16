import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (
    title: string,
    message: string,
    recipient: string,
    sentBy: string,
    type: string
) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                recipient,
                sentBy,
                type,
            },
        });
        return notification;
    } catch (error) {
        throw new Error(`Error creating notification: ${(error as Error).message}`);
    }
};
