import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class ReviewController {
    public async getAll(req: Request, res: Response) {
        try {
            const { eventId } = req.query

            const data = await prisma.events.findUnique({
                where: {
                    event_ID: Number(eventId)
                },
                include: {
                    Transactions: {
                        include: {
                            Reviews: {
                                include: {
                                    User: true
                                }
                            }
                        }
                    }
                }
            })
            res.status(200).send(data)
        } catch (error) {
            console.log(error)
        }
    }
}

export default ReviewController;