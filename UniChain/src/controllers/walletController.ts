import { Request, Response } from 'express';
import { checkBalance, sendSolana } from '../utils/solana';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getWalletDetails = async (req: Request, res: Response) => {
    const studentId = parseInt(req.params.id);
    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { walletAddress: true, seedPhrase: true }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const balance = await checkBalance(student.walletAddress);
        return res.json({ walletAddress: student.walletAddress, seedPhrase: student.seedPhrase, balance });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching wallet details: ${(error as Error).message}` });
    }
};

export const sendSol = async (req: Request, res: Response) => {
    const { senderId, receiverAddress, amount } = req.body;
    try {
        const sender = await prisma.student.findUnique({
            where: { id: senderId },
            select: { seedPhrase: true, walletAddress: true }
        });

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        const balance = await checkBalance(sender.walletAddress);
        if (balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const signature = await sendSolana(sender.seedPhrase, amount, receiverAddress);
        return res.json({ signature });
    } catch (error) {
        return res.status(500).json({ message: `Error sending SOL: ${(error as Error).message}` });
    }
};
