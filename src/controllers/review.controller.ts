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
            res.status(500).send(error)
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { transaction } = req.query

            const transaction_id = await prisma.transactions.findUnique({
                where: {
                    transaction_code: transaction?.toString()
                }
            })

            const data = await prisma.reviews.create({
                data: {
                    ...req.body,
                    transaction_id: transaction_id?.transaction_id,
                    user_id: res.locals.decript.id
                }
            })

            // console.log(transaction)
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default ReviewController;