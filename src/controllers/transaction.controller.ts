import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "crypto";

class TransactionsController {
    public async getByUser(req: Request, res: Response) {
        try {
            const transactions = await prisma.transactions.findMany({
                where: {
                    user_id: Number(res.locals.decript.id),
                }, include: {
                    Event: true,
                    Ticket: true,
                }, orderBy: {
                    payment_deadline: "desc"
                }
            })
            res.status(200).send(transactions);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const transaction = await prisma.transactions.findUnique({
                where: {
                    transaction_code: req.params.id
                },
                include: {
                    Event: true,
                    User: true,
                    Ticket: true,
                    TransactionTickets: true,
                    Voucher: true,
                }
            });
            res.status(200).send(transaction);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { event_id, ticket_id, voucher_id = null, quantity, total_price, payment_method, used_point } = req.body;

            console.log("Request body:", req.body);

            if (!res.locals.decript?.id || !event_id || !ticket_id || !quantity || typeof total_price === "undefined" || !payment_method) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const ticket = await prisma.tickets.findUnique({
                where: { ticket_id: Number(ticket_id) },
                include: { Event: true }
            });

            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found" });
            }

            console.log("RUN")
            console.log(ticket)

            if (ticket.Event.event_ID !== Number(event_id)) {
                return res.status(400).json({ message: "Ticket does not belong to this event" });
            }

            if (ticket.kuota < Number(quantity)) {
                return res.status(400).json({ message: "Not enough tickets available" });
            }

            const transaction = await prisma.transactions.create({
                data: {
                    transaction_code: randomUUID().slice(0, 6),
                    user_id: Number(res.locals.decript?.id),
                    event_id: Number(event_id),
                    ticket_id: Number(ticket_id),
                    voucher_id: voucher_id ? Number(voucher_id) : null,
                    used_point: Number(used_point) || 0,
                    status: "waiting_payment",
                    payment_method: String(payment_method),
                    // payment_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    payment_deadline: new Date(Date.now() + 1 * 60 * 1000),
                    TransactionTickets: {
                        create: {
                            ticket_id: Number(ticket_id),
                            quantity: Number(quantity)
                        }
                    }
                },
                include: {
                    User: true,
                    Event: true,
                    Ticket: true,
                    Voucher: true,
                    TransactionTickets: true
                }
            });

            await prisma.tickets.update({
                where: { ticket_id: Number(ticket_id) },
                data: { kuota: ticket.kuota - Number(quantity) }
            });

            if (Number(used_point) > 0) {
                await prisma.users.update({
                    where: { user_id: Number(res.locals.decript?.id) },
                    data: {
                        points: {
                            decrement: Number(used_point)
                        }
                    }
                });
            }

            res.status(201).json({
                message: "Transaction created successfully",
                data: transaction
            });

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}

export default TransactionsController