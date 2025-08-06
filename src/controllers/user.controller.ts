import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class UserController {
    public async getProfile(req: Request, res: Response) {
        try {
            const userId = res.locals.decript.id;
            const user = await prisma.users.findUnique({
                where: { user_id: userId },
                select: {
                    username: true,
                    points: true,
                    email: true,
                }
            });
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send({ message: "Internal server error", error });
        }
    }
}